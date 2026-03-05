<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PortfolioController extends Controller
{
    public function me(Request $request)
    {
        return $this->buildPortfolio($request->user());
    }

    public function show(Request $request, $userId)
    {
        $u = User::find($userId);
        if (!$u) {
            return response()->json(['status' => 404, 'message' => 'User not found'], 404);
        }
        return $this->buildPortfolio($u);
    }

    private function buildPortfolio(User $user)
    {
        // ✅ frontend base url (React)
        $frontend = rtrim(config('app.frontend_url'), '/');

        // ===============================
        // COURSES (completed + progress)
        // ===============================

        $enrollments = Enrollment::where('user_id', $user->id)
            ->with([
                'course' => function ($q) {
                    // ✅ include 'image' column — this is what your DB stores
                    $q->select('id', 'title', 'image')
                      ->withCount([
                          'lessons as total_lessons' => function ($qq) {
                              $qq->where('lessons.status', 1)->whereNotNull('lessons.video');
                          }
                      ]);
                }
            ])
            ->get();

        $courseProgress = [];
        foreach ($enrollments as $enr) {
            if (!$enr->course) continue;

            $courseId     = $enr->course->id;
            $totalLessons = (int) ($enr->course->total_lessons ?? 0);

            $completedLessonsCount = Activity::where([
                'user_id'      => $user->id,
                'course_id'    => $courseId,
                'is_completed' => 'yes',
            ])->count();

            $pct = $totalLessons > 0
                ? (int) round(($completedLessonsCount / $totalLessons) * 100)
                : 0;
            if ($pct > 100) $pct = 100;

            // ✅ FIX: build the image URL correctly from the bare filename
            // DB stores e.g. "1759309572-1.jpg" in the `image` column
            $rawImage = $enr->course->image ?? '';
            if ($rawImage) {
                // If it's already a full URL (Cloudinary etc.), use as-is
                if (filter_var($rawImage, FILTER_VALIDATE_URL)) {
                    $courseSmallImage = $rawImage;
                } else {
                    // Bare filename — build the full URL
                    $courseSmallImage = asset('uploads/course/small/' . $rawImage);
                }
            } else {
                $courseSmallImage = '';
            }

            $courseProgress[] = [
                'course_id'          => $courseId,
                'title'              => $enr->course->title,
                'course_small_image' => $courseSmallImage, // ✅ clean URL now
                'total_lessons'      => $totalLessons,
                'completed_lessons'  => $completedLessonsCount,
                'progress'           => $pct,
                'is_completed'       => $pct === 100,
            ];
        }

        $completedCourses  = array_values(array_filter($courseProgress, fn($c) =>  $c['is_completed']));
        $inProgressCourses = array_values(array_filter($courseProgress, fn($c) => !$c['is_completed']));

        usort($inProgressCourses, fn($a, $b) => $b['progress'] <=> $a['progress']);

        // ===============================
        // INNOVATION SHOWCASES
        // ===============================

        $showcases = DB::table('idea_showcases')
            ->join('idea_members',   'idea_members.idea_id',    '=', 'idea_showcases.idea_id')
            ->join('problem_ideas',  'problem_ideas.id',        '=', 'idea_showcases.idea_id')
            ->join('problems',       'problems.id',             '=', 'problem_ideas.problem_id')
            ->where('idea_members.user_id', $user->id)
            ->select(
                'idea_showcases.idea_id',
                'idea_showcases.summary',
                'idea_showcases.tech_stack',
                'idea_showcases.repo_url',
                'idea_showcases.demo_url',
                'idea_showcases.report_url',
                'idea_showcases.cover_image',
                'idea_showcases.score',
                'idea_showcases.created_at',
                'problem_ideas.title as idea_title',
                'problems.title as problem_title'
            )
            ->orderByDesc('idea_showcases.id')
            ->get();

        $showcases = $showcases->map(function ($s) {
            $cover = $s->cover_image ? asset('uploads/showcase/' . $s->cover_image) : null;

            return [
                'idea_id'       => (int) $s->idea_id,
                'idea_title'    => $s->idea_title,
                'problem_title' => $s->problem_title,
                'summary'       => $s->summary,
                'tech_stack'    => $s->tech_stack,
                'repo_url'      => $s->repo_url,
                'demo_url'      => $s->demo_url,
                'report_url'    => $s->report_url,
                'cover_image'   => $cover,
                'score'         => (int) ($s->score ?? 0),
                'created_at'    => $s->created_at,
            ];
        });

        // ===============================
        // BUILD RESPONSE
        // ===============================

        $portfolio = [
            'user' => [
                'id'   => $user->id,
                'name' => $user->name,
                'role' => $user->role,
            ],
            'stats' => [
                'completed_courses'    => count($completedCourses),
                'in_progress_courses'  => count($inProgressCourses),
                'innovation_showcases' => count($showcases),
            ],
            'courses' => [
                'completed'   => $completedCourses,
                'in_progress' => array_slice($inProgressCourses, 0, 6),
            ],
            'certificates' => [
                'count' => count($completedCourses),
                'note'  => 'Certificates can be issued for completed courses.',
            ],
            'innovation' => [
                'showcases' => $showcases,
            ],
            // ✅ public portfolio URL on frontend domain
            'public_url' => $frontend . '/account/portfolio/' . $user->id,
        ];

        return response()->json([
            'status' => 200,
            'data'   => $portfolio,
        ], 200);
    }
}