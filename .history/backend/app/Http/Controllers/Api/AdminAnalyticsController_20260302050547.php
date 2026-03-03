<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminAnalyticsController extends Controller
{
    private function ensureAdmin(Request $request)
    {
        $role = strtolower(trim($request->user()->role ?? ''));
        if ($role !== 'admin') {
            return response()->json(['status' => 403, 'message' => 'Forbidden'], 403);
        }
        return null;
    }

    public function overview(Request $request)
    {
        if ($r = $this->ensureAdmin($request)) return $r;

        $students = DB::table('users')->where('role', 'student')->count();
        $instructors = DB::table('users')->where('role', 'instructor')->count();

        $totalEnrollments = DB::table('enrollments')->count();

        // ✅ MVP revenue estimate (since no orders table)
        // revenue = sum(course.price) for each enrollment
        $estimatedRevenue = DB::table('enrollments')
            ->join('courses', 'courses.id', '=', 'enrollments.course_id')
            ->sum('courses.price');

        $activeCourses = DB::table('courses')->where('status', 1)->count();
        $totalCourses  = DB::table('courses')->count();

        return response()->json([
            'status' => 200,
            'data' => [
                'students' => $students,
                'instructors' => $instructors,
                'enrollments' => $totalEnrollments,
                'estimated_revenue' => (float)$estimatedRevenue,
                'active_courses' => $activeCourses,
                'total_courses' => $totalCourses,
            ]
        ]);
    }

    public function enrollmentsTrend(Request $request)
    {
        if ($r = $this->ensureAdmin($request)) return $r;

        $days = (int)($request->query('days', 30));
        if ($days < 7) $days = 7;
        if ($days > 120) $days = 120;

        $start = Carbon::now()->subDays($days)->startOfDay();

        $rows = DB::table('enrollments')
            ->selectRaw('DATE(created_at) as day, COUNT(*) as cnt')
            ->where('created_at', '>=', $start)
            ->groupBy('day')
            ->orderBy('day')
            ->get();

        // fill missing days
        $map = $rows->pluck('cnt', 'day')->toArray();
        $labels = [];
        $values = [];
        for ($i = $days; $i >= 0; $i--) {
            $d = Carbon::now()->subDays($i)->format('Y-m-d');
            $labels[] = $d;
            $values[] = (int)($map[$d] ?? 0);
        }

        return response()->json([
            'status' => 200,
            'data' => ['labels' => $labels, 'values' => $values]
        ]);
    }

    public function revenueTrend(Request $request)
    {
        if ($r = $this->ensureAdmin($request)) return $r;

        $days = (int)($request->query('days', 30));
        if ($days < 7) $days = 7;
        if ($days > 120) $days = 120;

        $start = Carbon::now()->subDays($days)->startOfDay();

        // MVP revenue estimate: sum(course.price) grouped by enrollment day
        $rows = DB::table('enrollments')
            ->join('courses', 'courses.id', '=', 'enrollments.course_id')
            ->selectRaw('DATE(enrollments.created_at) as day, SUM(courses.price) as amount')
            ->where('enrollments.created_at', '>=', $start)
            ->groupBy('day')
            ->orderBy('day')
            ->get();

        $map = $rows->pluck('amount', 'day')->toArray();
        $labels = [];
        $values = [];
        for ($i = $days; $i >= 0; $i--) {
            $d = Carbon::now()->subDays($i)->format('Y-m-d');
            $labels[] = $d;
            $values[] = (float)($map[$d] ?? 0);
        }

        return response()->json([
            'status' => 200,
            'data' => ['labels' => $labels, 'values' => $values]
        ]);
    }

    public function topCourses(Request $request)
    {
        if ($r = $this->ensureAdmin($request)) return $r;

        $limit = (int)($request->query('limit', 6));
        if ($limit < 3) $limit = 3;
        if ($limit > 20) $limit = 20;

        $rows = DB::table('enrollments')
            ->join('courses', 'courses.id', '=', 'enrollments.course_id')
            ->selectRaw('courses.id, courses.title, COUNT(enrollments.id) as enrollments')
            ->groupBy('courses.id', 'courses.title')
            ->orderByDesc('enrollments')
            ->limit($limit)
            ->get();

        return response()->json(['status' => 200, 'data' => $rows]);
    }

    public function innovation(Request $request)
    {
        if ($r = $this->ensureAdmin($request)) return $r;

        $problems = DB::table('problems')->count();
        $ideas = DB::table('problem_ideas')->count();
        $votes = DB::table('idea_votes')->count();
        $selectedIdeas = DB::table('problem_ideas')->where('is_selected', 1)->count();
        $showcases = DB::table('idea_showcases')->count();
        $updates = DB::table('idea_updates')->count();

        return response()->json([
            'status' => 200,
            'data' => [
                'problems' => $problems,
                'ideas' => $ideas,
                'votes' => $votes,
                'selected_ideas' => $selectedIdeas,
                'showcases' => $showcases,
                'updates' => $updates,
            ]
        ]);
    }
}