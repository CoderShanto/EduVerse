<?php

namespace App\Http\Controllers\Api\front;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class AdminCategoryController extends Controller
{
    // GET /api/admin/categories
    public function index(Request $request)
    {
        $q = Category::query()->orderBy('id', 'desc');

        // optional search
        if ($request->filled('search')) {
            $q->where('name', 'like', '%'.$request->search.'%');
        }

        return response()->json([
            'status' => 200,
            'data' => $q->paginate(15),
        ]);
    }

    // POST /api/admin/categories
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:120', 'unique:categories,name'],
            'status' => ['nullable', 'in:0,1'],
        ]);

        $cat = Category::create([
            'name' => $request->name,
            'status' => $request->status ?? 1,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Category created',
            'data' => $cat,
        ]);
    }

    // GET /api/admin/categories/{id}
    public function show($id)
    {
        $cat = Category::findOrFail($id);

        return response()->json([
            'status' => 200,
            'data' => $cat,
        ]);
    }

    // PUT /api/admin/categories/{id}
    public function update(Request $request, $id)
    {
        $cat = Category::findOrFail($id);

        $request->validate([
            'name' => ['required', 'string', 'max:120', 'unique:categories,name,'.$cat->id],
            'status' => ['nullable', 'in:0,1'],
        ]);

        $cat->update([
            'name' => $request->name,
            'status' => $request->status ?? $cat->status,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Category updated',
            'data' => $cat,
        ]);
    }

    // PATCH /api/admin/categories/{id}/status
    public function toggleStatus($id)
    {
        $cat = Category::findOrFail($id);
        $cat->status = $cat->status == 1 ? 0 : 1;
        $cat->save();

        return response()->json([
            'status' => 200,
            'message' => 'Status updated',
            'data' => $cat,
        ]);
    }

    // DELETE /api/admin/categories/{id}
    public function destroy($id)
    {
        $cat = Category::findOrFail($id);
        $cat->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Category deleted',
        ]);
    }
}
