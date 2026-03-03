<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
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

        // STUDENT
        if ($role === 'student') {
            $enrolledCount = Enrollment::where('user_id', $user->id)->count();

            return response()->json([
                'status' => 200,
                'role' => 'student',
                'stats' => [
                    'enrolled_courses' => $enrolledCount,
                ],
            ]);
        }

        // INSTRUCTOR
        if ($role === 'instructor') {
            $myCoursesQuery = Course::where('user_id', $user->id);

            $totalCourses = (clone $myCoursesQuery)->count();
            $publishedCourses = (clone $myCoursesQuery)->where('status', 1)->count();

            $courseIds = (clone $myCoursesQuery)->pluck('id')->toArray();
            $totalEnrollments = Enrollment::whereIn('course_id', $courseIds)->count();

            $reviewsCount = Review::whereIn('course_id', $courseIds)->count();
            $reviewsSum = Review::whereIn('course_id', $courseIds)->sum('rating');
            $avgRating = $reviewsCount > 0 ? round($reviewsSum / $reviewsCount, 1) : 0.0;

            return response()->json([
                'status' => 200,
                'role' => 'instructor',
                'stats' => [
                    'total_courses' => $totalCourses,
                    'published_courses' => $publishedCourses,
                    'total_enrollments' => $totalEnrollments,
                    'avg_rating' => $avgRating,
                ],
            ]);
        }

        // ADMIN
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
            ]);
        }

        return response()->json(['status' => 403, 'message' => 'Forbidden'], 403);
    }
}