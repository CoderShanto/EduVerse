<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\IdeaMember;
use App\Models\IdeaShowcase;
use App\Models\IdeaUpdate;
use App\Models\ProblemIdea;
use App\Models\User;
use App\Models\Enrollment;
use App\Models\Activity;
use App\Models\Lesson;
use App\Models\Chapter;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    public function index(Request $request)
    {
        // ✅ Students only
        $students = User::where('role', 'student')
            ->select('id', 'name')
            ->get();

        // ===========================
        // INNOVATION POINTS
        // ===========================

        $selectedIdeaIds = ProblemIdea::where('is_selected', 1)->pluck('id')->toArray();

        $updatesByUser = IdeaUpdate::selectRaw('user_id, COUNT(*) as cnt')
            ->groupBy('user_id')
            ->pluck('cnt', 'user_id');

        $showcases = IdeaShowcase::select('idea_id', 'score')
            ->get()
            ->keyBy('idea_id');

        $ideaIds = array_unique(array_merge($selectedIdeaIds, $showcases->keys()->toArray()));

        $members = [];
        if (!empty($ideaIds)) {
            $members = IdeaMember::select('idea_id', 'user_id')
                ->whereIn('idea_id', $ideaIds)
                ->get();
        }

        $selectedIdeasByUser = [];
        $completedIdeasByUser = [];
        $qualityBonusByUser = [];

        foreach ($members as $m) {
            if (in_array($m->idea_id, $selectedIdeaIds)) {
                $selectedIdeasByUser[$m->user_id] = ($selectedIdeasByUser[$m->user_id] ?? 0) + 1;
            }

            if ($showcases->has($m->idea_id)) {
                $completedIdeasByUser[$m->user_id] = ($completedIdeasByUser[$m->user_id] ?? 0) + 1;

                $score = (int) ($showcases[$m->idea_id]->score ?? 0);
                if ($score >= 8) {
                    $qualityBonusByUser[$m->user_id] = ($qualityBonusByUser[$m->user_id] ?? 0) + 5;
                }
            }
        }

        // ===========================
        // LMS COMPLETED COURSES (+10 each)
        // ===========================

        // Get enrollments grouped by user
        $enrollments = Enrollment::select('user_id', 'course_id')->get();

        $courseIds = $enrollments->pluck('course_id')->unique()->values()->toArray();

        // Total lessons per course (published + has video)
        // ✅ Qualify lessons.status to avoid ambiguous column error
        $totalLessonsByCourse = Chapter::query()
            ->whereIn('chapters.course_id', $courseIds)
            ->join('lessons', 'lessons.chapter_id', '=', 'chapters.id')
            ->where('lessons.status', 1)
            ->whereNotNull('lessons.video')
            ->groupBy('chapters.course_id')
            ->selectRaw('chapters.course_id as course_id, COUNT(lessons.id) as total')
            ->pluck('total', 'course_id');

        // Completed lessons per user per course (activities is_completed = yes)
        $completedLessonsByUserCourse = Activity::query()
            ->where('is_completed', 'yes')
            ->groupBy('user_id', 'course_id')
            ->selectRaw('user_id, course_id, COUNT(*) as completed')
            ->get();

        $completedMap = []; // [user_id][course_id] = completed_count
        foreach ($completedLessonsByUserCourse as $row) {
            $completedMap[$row->user_id][$row->course_id] = (int) $row->completed;
        }

        // Now compute completed courses per user
        $completedCoursesByUser = []; // user_id => count

        foreach ($enrollments as $enr) {
            $uid = $enr->user_id;
            $cid = $enr->course_id;

            $totalLessons = (int) ($totalLessonsByCourse[$cid] ?? 0);
            $doneLessons  = (int) ($completedMap[$uid][$cid] ?? 0);

            if ($totalLessons > 0 && $doneLessons >= $totalLessons) {
                $completedCoursesByUser[$uid] = ($completedCoursesByUser[$uid] ?? 0) + 1;
            }
        }

        // ===========================
        // FINAL LEADERBOARD
        // ===========================

        $rows = $students->map(function ($u) use (
            $updatesByUser,
            $selectedIdeasByUser,
            $completedIdeasByUser,
            $qualityBonusByUser,
            $completedCoursesByUser
        ) {
            $updates      = (int) ($updatesByUser[$u->id] ?? 0);
            $selected     = (int) ($selectedIdeasByUser[$u->id] ?? 0);
            $completed    = (int) ($completedIdeasByUser[$u->id] ?? 0);
            $qualityBonus = (int) ($qualityBonusByUser[$u->id] ?? 0);

            $completedCourses = (int) ($completedCoursesByUser[$u->id] ?? 0);

            $score =
                ($updates * 5) +
                ($selected * 25) +
                ($completed * 50) +
                $qualityBonus +
                ($completedCourses * 10);

            return [
                'user_id' => $u->id,
                'name' => $u->name,
                'score' => $score,

                // innovation
                'updates' => $updates,
                'selected_ideas' => $selected,
                'completed_ideas' => $completed,
                'quality_bonus' => $qualityBonus,

                // lms
                'completed_courses' => $completedCourses,
            ];
        })
        ->sortByDesc('score')
        ->values();

        return response()->json([
            'status' => 200,
            'data' => $rows,
        ], 200);
    }
}