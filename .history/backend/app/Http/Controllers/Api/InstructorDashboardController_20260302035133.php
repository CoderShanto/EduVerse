<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InstructorDashboardController extends Controller
{
    public function stats(Request $request)
    {
        $user = $request->user(); // instructor/admin
        $userId = $user->id;

        /**
         * ✅ Find instructor courses
         * Your Course table might store owner as:
         * - user_id (most common)
         * - instructor_id
         *
         * We'll support BOTH safely.
         */
        $courseIds = Course::query()
            ->where(function ($q) use ($userId) {
                $q->where('user_id', $userId)
                  ->orWhere('instructor_id', $userId);
            })
            ->pluck('id')
            ->toArray();

        $totalCourses = count($courseIds);

        // ✅ total enrollments on my courses
        $totalEnrollments = $totalCourses > 0
            ? Enrollment::whereIn('course_id', $courseIds)->count()
            : 0;

        // ✅ reviews for my courses
        $reviewsAgg = $totalCourses > 0
            ? Review::whereIn('course_id', $courseIds)
                ->selectRaw('COUNT(*) as total_reviews, AVG(rating) as avg_rating')
                ->first()
            : null;

        $totalReviews = (int) ($reviewsAgg->total_reviews ?? 0);
        $avgRating = round((float) ($reviewsAgg->avg_rating ?? 0), 2);

        // ✅ latest 5 enrollments (with user + course title)
        $recentEnrollments = $totalCourses > 0
            ? Enrollment::whereIn('course_id', $courseIds)
                ->with([
                    'user:id,name,email',
                    'course:id,title'
                ])
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
            'stats' => [
                'total_courses' => $totalCourses,
                'total_enrollments' => $totalEnrollments,
                'total_reviews' => $totalReviews,
                'avg_rating' => $avgRating,
                'recent_enrollments' => $recentEnrollments,
            ]
        ], 200);
    }
}