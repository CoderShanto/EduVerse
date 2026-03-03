<?php

namespace App\Http\Controllers\Api\Instructor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

// Adjust these model namespaces if yours are different
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Order;

class InstructorDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // ✅ Instructor-only (NOT admin)
        // If your role field is different, change it here.
        if (strtolower((string) $user->role) !== 'instructor') {
            return response()->json([
                'status' => 403,
                'message' => 'Only instructors can access this dashboard.',
            ], 403);
        }

        // ✅ Instructor courses
        // Change `user_id` to `instructor_id` if that's what you used in courses table.
        $coursesQuery = Course::where('user_id', $user->id);

        // If you have status column and want active only:
        // $coursesQuery->where('status', 1);

        $courseIds = $coursesQuery->pluck('id')->toArray();

        // If instructor has no courses
        if (count($courseIds) === 0) {
            return response()->json([
                'status' => 200,
                'data' => [
                    'total_revenue' => 0,
                    'total_students' => 0,
                    'active_courses' => 0,
                    'avg_rating' => 0,
                    'courses' => [],
                    'recent_enrollments' => [],
                ]
            ], 200);
        }

        // ✅ Total students enrolled in instructor's courses
        $totalStudents = Enrollment::whereIn('course_id', $courseIds)->count();

        // ✅ Total revenue from instructor courses
        // Adjust column names based on your orders schema.
        // Common: orders.total / orders.amount / orders.price
        $totalRevenue = 0;
        if (class_exists(Order::class)) {
            $totalRevenue = (float) Order::whereIn('course_id', $courseIds)
                // If you store paid orders only:
                // ->where('payment_status', 'paid')
                ->sum(DB::raw('amount'));
        }

        // ✅ Recent enrollments (latest 10)
        $recentEnrollments = Enrollment::whereIn('course_id', $courseIds)
            ->orderByDesc('id')
            ->take(10)
            ->get(['id', 'user_id', 'course_id', 'created_at']);

        // Build enrollment display (student name + course title)
        // If your relations exist, you can use with('user','course')
        // Here we do it safely using DB joins.
        $recentEnrollmentRows = DB::table('enrollments')
            ->join('users', 'users.id', '=', 'enrollments.user_id')
            ->join('courses', 'courses.id', '=', 'enrollments.course_id')
            ->whereIn('enrollments.course_id', $courseIds)
            ->orderByDesc('enrollments.id')
            ->limit(10)
            ->select(
                'enrollments.id',
                'users.name as student_name',
                'courses.title as course_title',
                'enrollments.created_at'
            )
            ->get();

        // ✅ Course performance list
        // students per course
        $studentsByCourse = Enrollment::selectRaw('course_id, COUNT(*) as students')
            ->whereIn('course_id', $courseIds)
            ->groupBy('course_id')
            ->pluck('students', 'course_id');

        // revenue per course
        $revenueByCourse = collect();
        if (class_exists(Order::class)) {
            $revenueByCourse = Order::selectRaw('course_id, SUM(amount) as revenue')
                ->whereIn('course_id', $courseIds)
                ->groupBy('course_id')
                ->pluck('revenue', 'course_id');
        }

        // rating: if you have reviews table later, compute here.
        // For now default 0 or show placeholder.
        $courses = Course::whereIn('id', $courseIds)->get(['id', 'title']);

        $courseStats = $courses->map(function ($c) use ($studentsByCourse, $revenueByCourse) {
            return [
                'id' => $c->id,
                'title' => $c->title,
                'students' => (int) ($studentsByCourse[$c->id] ?? 0),
                'revenue' => (float) ($revenueByCourse[$c->id] ?? 0),
                'rating' => 0, // later compute from reviews
            ];
        })->sortByDesc('students')->values();

        // avg rating placeholder (later compute)
        $avgRating = 0;

        return response()->json([
            'status' => 200,
            'data' => [
                'total_revenue' => $totalRevenue,
                'total_students' => $totalStudents,
                'active_courses' => count($courseIds),
                'avg_rating' => $avgRating,
                'courses' => $courseStats,
                'recent_enrollments' => $recentEnrollmentRows,
            ]
        ], 200);
    }
}