<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'status' => 401,
                    'message' => 'Unauthenticated. Token invalid or missing.'
                ], 401);
            }

            $role = strtolower(trim((string)($user->role ?? '')));

            if ($role === '') {
                return response()->json([
                    'status' => 422,
                    'message' => 'User role not found.'
                ], 422);
            }

            // =========================
            // STUDENT DASHBOARD
            // =========================
            if ($role === 'student') {

                $enrolledCourseIds = Enrollment::where('user_id', $user->id)
                    ->pluck('course_id')
                    ->filter()
                    ->unique()
                    ->values();

                if ($enrolledCourseIds->count() === 0) {
                    $enrolledCourseIds = Activity::where('user_id', $user->id)
                        ->pluck('course_id')
                        ->filter()
                        ->unique()
                        ->values();
                }

                $enrolledCount = $enrolledCourseIds->count();

                // detect which video column exists in lessons table
                $videoCol = Schema::hasColumn('lessons', 'video')
                    ? 'video'
                    : (Schema::hasColumn('lessons', 'video_url') ? 'video_url' : null);

                // ✅ courses table has no slug (as per your error), so don't select it
                $coursesQuery = Course::whereIn('id', $enrolledCourseIds)
                    ->select('id', 'title', 'image');

                // ✅ FIX AMBIGUOUS STATUS:
                // qualify columns as lessons.status and lessons.video (or lessons.video_url)
                if (method_exists(Course::class, 'lessons')) {
                    $coursesQuery->withCount([
                        'lessons as total_lessons' => function ($qq) use ($videoCol) {
                            $qq->where('lessons.status', 1);
                            if ($videoCol) {
                                $qq->whereNotNull('lessons.' . $videoCol);
                            }
                        }
                    ]);
                }

                $courses = $coursesQuery->get();

                $progressCourses = [];

                foreach ($courses as $course) {
                    $courseId     = (int) $course->id;
                    $totalLessons = (int) ($course->total_lessons ?? 0);

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
                        'course_small_image' => $course->course_small_image ?? '',
                        'total_lessons' => $totalLessons,
                        'completed_lessons' => $completedLessonsCount,
                        'progress' => $pct,
                    ];
                }

                $completedCourses = collect($progressCourses)->where('progress', 100)->count();
                $streakDays = 0;

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

                if (!Schema::hasColumn('courses', 'user_id')) {
                    return response()->json([
                        'status' => 200,
                        'role' => 'instructor',
                        'stats' => [
                            'total_courses' => 0,
                            'published_courses' => 0,
                            'total_enrollments' => 0,
                            'avg_rating' => 0.0,
                        ],
                        'warning' => 'courses.user_id column not found. Instructor stats disabled until you add it.'
                    ], 200);
                }

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

        } catch (\Throwable $e) {

            Log::error('Dashboard stats error: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'status' => 500,
                'message' => 'Server error in dashboard stats.',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ], 500);
        }
    }
}