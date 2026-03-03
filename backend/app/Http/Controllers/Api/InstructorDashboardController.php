<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Review;
use Illuminate\Http\Request;

class InstructorDashboardController extends Controller
{
    public function stats(Request $request)
    {
        $user = $request->user();
        $instructorId = $user->id;

        // ✅ Instructor-owned courses (your table uses user_id)
        $courseIds = Course::where('user_id', $instructorId)->pluck('id')->toArray();

        $totalCourses = count($courseIds);

        $activeCourses = $totalCourses > 0
            ? Course::where('user_id', $instructorId)->where('status', 1)->count()
            : 0;

        $inactiveCourses = $totalCourses > 0
            ? Course::where('user_id', $instructorId)->where('status', 0)->count()
            : 0;

        // ✅ Enrollments for instructor's courses
        $totalEnrollments = $totalCourses > 0
            ? Enrollment::whereIn('course_id', $courseIds)->count()
            : 0;

        // ✅ Reviews summary (if reviews table exists in your models)
        $reviewsAgg = $totalCourses > 0
            ? Review::whereIn('course_id', $courseIds)
                ->selectRaw('COUNT(*) as total_reviews, AVG(rating) as avg_rating')
                ->first()
            : null;

        $totalReviews = (int) ($reviewsAgg->total_reviews ?? 0);
        $avgRating = round((float) ($reviewsAgg->avg_rating ?? 0), 2);

        // ✅ Recent enrollments list (last 5)
        $recentEnrollments = $totalCourses > 0
            ? Enrollment::whereIn('course_id', $courseIds)
                ->with(['user:id,name,email', 'course:id,title'])
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($e) {
                    return [
                        'id' => $e->id,
                        'student_name' => $e->user->name ?? 'Unknown',
                        'student_email' => $e->user->email ?? null,
                        'course_title' => $e->course->title ?? 'Course',
                        'created_at' => $e->created_at,
                    ];
                })
            : [];

        return response()->json([
            'status' => 200,
            'data' => [
                'total_courses' => $totalCourses,
                'active_courses' => $activeCourses,
                'inactive_courses' => $inactiveCourses,
                'total_enrollments' => $totalEnrollments,
                'total_reviews' => $totalReviews,
                'avg_rating' => $avgRating,
                'recent_enrollments' => $recentEnrollments,
            ],
        ], 200);
    }
}