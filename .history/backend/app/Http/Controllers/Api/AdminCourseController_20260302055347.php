<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class AdminCourseController extends Controller
{
    public function index(Request $request)
    {
        // ✅ Optional filters
        $q        = trim($request->keyword ?? '');
        $sort     = $request->sort === 'asc' ? 'asc' : 'desc';
        $category = $request->category ? explode(',', $request->category) : [];
        $level    = $request->level ? explode(',', $request->level) : [];
        $language = $request->language ? explode(',', $request->language) : [];

        $query = Course::query()
            ->with(['category', 'level', 'language', 'user']) // if relations exist
            ->select('id','title','image','price','status','category_id','level_id','language_id','user_id','created_at');

        if ($q !== '') {
            $query->where('title', 'LIKE', "%{$q}%");
        }

        if (!empty($category)) {
            $query->whereIn('category_id', $category);
        }

        if (!empty($level)) {
            $query->whereIn('level_id', $level);
        }

        if (!empty($language)) {
            $query->whereIn('language_id', $language);
        }

        $courses = $query->orderBy('id', $sort)->get();

        return response()->json([
            'status' => 200,
            'data' => $courses
        ], 200);
    }
}