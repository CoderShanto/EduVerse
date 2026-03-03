<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $user = $request->user();
        $role = $user->role;

        // =========================
        // STUDENT DASHBOARD
        // =========================
        if ($role === 'student') {

            // Load enrollments + each course + total lessons count (published + has video)
            $enrollments = Enrollment::where('user_id', $user->id)
                ->with([
                    'course' => function ($q) {
                        $q->select('id', 'title', 'slug', 'image')
                          ->withCount([
                              // IMPORTANT: This assumes Course has a lessons() relationship.
                              // If you don't have it yet, see note below.
                              'lessons as total_lessons' => function ($qq) {
                                  $qq->where('status', 1)->whereNotNull('video');
                              }
                          ]);
                    }
                ])
                ->get();

            $enrolledCount = $enrollments->count();

            $progressCourses = [];

            foreach ($enrollments as $enrollment) {
                if (!$enrollment->course) continue;

                $courseId     = $enrollment->course->id;
                $totalLessons = (int) ($enrollment->course->total_lessons ?? 0);

                $completedLessonsCount = Activity::where([
                        'user_id' => $user->id,
                        'course_id' => $courseId,
                        'is_completed' => 'yes',
                    ])->count();

                $pct = $totalLessons > 0 ? (int) round(($completedLessonsCount / $totalLessons) * 100) : 0;
                if ($pct > 100) $pct = 100;

                $progressCourses[] = [
                    'course_id' => $courseId,
                    'title' => $enrollment->course->title,
                    'slug' => $enrollment->course->slug,
                    'course_small_image' => $enrollment->course->course_small_image ?? '',
                    'total_lessons' => $totalLessons,
                    'completed_lessons' => $completedLessonsCount,
                    'progress' => $pct,
                ];
            }

            // completed courses = progress 100%
            $completedCourses = collect($progressCourses)->where('progress', 100)->count();

            // (Optional) later implement streak properly from Activity dates
            $streakDays = 0;

            // sort highest progress first and take top 5
            usort($progressCourses, fn($a, $b) => $b['progress'] <=> $a['progress']);
            $progressCourses = array_slice($progressCourses, 0, 5);

            return response()->json([
                'status' => 200,
                'role' => 'student',
                'stats' => [
                    'enrolled_courses' => $enrolledCount,
                    'completed_courses' => $completedCourses,
                    'streak_days' => $streakDays,
                    'progress_courses' => $progressCourses,
                ],
            ], 200);
        }

        // =========================
        // INSTRUCTOR DASHBOARD
        // =========================
        if ($role === 'instructor') {
            $myCoursesQuery = Course::where('user_id', $user->id);

            $totalCourses     = (clone $myCoursesQuery)->count();
            $publishedCourses = (clone $myCoursesQuery)->where('status', 1)->count();

            $courseIds = (clone $myCoursesQuery)->pluck('id')->toArray();
            $totalEnrollments = Enrollment::whereIn('course_id', $courseIds)->count();

            $reviewsCount = Review::whereIn('course_id', $courseIds)->count();
            $reviewsSum   = Review::whereIn('course_id', $courseIds)->sum('rating');
            $avgRating    = $reviewsCount > 0 ? round($reviewsSum / $reviewsCount, 1) : 0.0;

            return response()->json([
                'status' => 200,
                'role' => 'instructor',
                'stats' => [
                    'total_courses' => $totalCourses,
                    'published_courses' => $publishedCourses,
                    'total_enrollments' => $totalEnrollments,
                    'avg_rating' => $avgRating,
                ],
            ], 200);
        }

        // =========================
        // ADMIN DASHBOARD
        // =========================
        if ($role === 'admin') {
            return response()->json([
                'status' => 200,
                'role' => 'admin',
                'stats' => [
                    'total_users' => User::count(),
                    'students' => User::where('role', 'student')->count(),
                    'instructors' => User::where('role', 'instructor')->count(),
                    'total_courses' => Course::count(),
                    'published_courses' => Course::where('status', 1)->count(),
                    'total_enrollments' => Enrollment::count(),
                ],
            ], 200);
        }

        return response()->json(['status' => 403, 'message' => 'Forbidden'], 403);
    }
}