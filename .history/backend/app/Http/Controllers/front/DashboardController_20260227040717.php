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
        // STUDENT DASHBOARD (FIXED)
        // =========================
        if ($role === 'student') {

            /**
             * 1) Get course IDs from enrollments first (correct way)
             * 2) If enrollments empty, fallback to activities table (your current DB situation)
             */
            $enrolledCourseIds = Enrollment::where('user_id', $user->id)
                ->pluck('course_id')
                ->unique()
                ->values();

            if ($enrolledCourseIds->count() === 0) {
                // Fallback: derive "enrolled" courses from activity table
                $enrolledCourseIds = Activity::where('user_id', $user->id)
                    ->whereNotNull('course_id')
                    ->pluck('course_id')
                    ->unique()
                    ->values();
            }

            $enrolledCount = $enrolledCourseIds->count();

            // Load courses + total lesson count (published + has video)
            $courses = Course::whereIn('id', $enrolledCourseIds)
                ->select('id', 'title', 'slug', 'image')
                ->withCount([
                    'lessons as total_lessons' => function ($qq) {
                        $qq->where('status', 1)->whereNotNull('video');
                    }
                ])
                ->get();

            $progressCourses = [];

            foreach ($courses as $course) {
                $courseId     = (int) $course->id;
                $totalLessons = (int) ($course->total_lessons ?? 0);

                /**
                 * IMPORTANT FIX:
                 * Use DISTINCT lesson_id so if you have multiple activity rows
                 * the count stays correct.
                 */
                $completedLessonsCount = Activity::where('user_id', $user->id)
                    ->where('course_id', $courseId)
                    ->where('is_completed', 'yes')
                    ->distinct('lesson_id')
                    ->count('lesson_id');

                $pct = $totalLessons > 0
                    ? (int) round(($completedLessonsCount / $totalLessons) * 100)
                    : 0;

                if ($pct > 100) $pct = 100;

                $progressCourses[] = [
                    'course_id' => $courseId,
                    'title' => $course->title,
                    'slug' => $course->slug,
                    'course_small_image' => $course->course_small_image ?? '',
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