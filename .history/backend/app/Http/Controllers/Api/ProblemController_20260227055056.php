<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Problem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProblemController extends Controller
{
    // GET /api/problems?search=&category=&status=&page=1
    public function index(Request $request)
    {
        $query = Problem::query()
            ->with(['user:id,name']) // show who posted
            ->orderBy('id', 'desc');

        // filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } else {
            // default show open + building
            $query->whereIn('status', ['open', 'building']);
        }

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($qq) use ($s) {
                $qq->where('title', 'like', "%$s%")
                   ->orWhere('description', 'like', "%$s%")
                   ->orWhere('category', 'like', "%$s%");
            });
        }

        $problems = $query->paginate(10);

        return response()->json([
            'status' => 200,
            'data' => $problems
        ], 200);
    }

    // POST /api/problems
    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'status' => 401,
                'message' => 'Unauthenticated'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:100',
            'description' => 'required|string|min:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors()
            ], 422);
        }

        $problem = Problem::create([
            'user_id' => $user->id,
            'title' => $request->title,
            'category' => $request->category,
            'description' => $request->description,
            'status' => 'open',
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Problem posted successfully',
            'data' => $problem
        ], 200);
    }
}