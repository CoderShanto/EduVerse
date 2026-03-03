<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChapterController extends Controller
{
    private function canManageCourse(Request $request, Course $course): bool
    {
        $user = $request->user();
        if (!$user) return false;

        if ($user->role === 'admin') return true;

        return $user->role === 'instructor' && (int)$course->user_id === (int)$user->id;
    }

    // Return all chapters of a course (only if owner/admin)
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'course_id' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors()
            ], 422);
        }

        $course = Course::find($request->course_id);
        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found.'
            ], 404);
        }

        if (!$this->canManageCourse($request, $course)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $chapters = Chapter::where('course_id', $course->id)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'status' => 200,
            'message' => 'Chapters retrieved successfully',
            'data' => $chapters
        ], 200);
    }

    // Create a chapter (only owner/admin)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'chapter' => 'required|string',
            'course_id' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors()
            ], 422);
        }

        $course = Course::find($request->course_id);
        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found.'
            ], 404);
        }

        if (!$this->canManageCourse($request, $course)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $chapter = new Chapter();
        $chapter->course_id = $course->id;
        $chapter->title = $request->chapter;
        $chapter->sort_order = 1000;
        $chapter->save();

        return response()->json([
            'status' => 200,
            'data' => $chapter,
            'message' => 'Chapter has been created successfully.'
        ], 200);
    }

    // Update a chapter title (only owner/admin)
    public function update($id, Request $request)
    {
        $chapter = Chapter::with('course')->find($id);
        if (!$chapter) {
            return response()->json([
                'status' => 404,
                'message' => 'Chapter not found.'
            ], 404);
        }

        if (!$chapter->course || !$this->canManageCourse($request, $chapter->course)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validator = Validator::make($request->all(), [
            'chapter' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors()
            ], 422);
        }

        $chapter->title = $request->chapter;
        $chapter->save();

        $chapter->load('lessons');

        return response()->json([
            'status' => 200,
            'data' => $chapter,
            'message' => 'Chapter has been updated successfully.'
        ], 200);
    }

    // Delete a chapter (only owner/admin) - (optional) also delete its lessons
    public function destroy($id, Request $request)
    {
        $chapter = Chapter::with(['course', 'lessons'])->find($id);
        if (!$chapter) {
            return response()->json([
                'status' => 404,
                'message' => 'Chapter not found.'
            ], 404);
        }

        if (!$chapter->course || !$this->canManageCourse($request, $chapter->course)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // If you want cascade delete lessons, do it here (recommended)
        foreach ($chapter->lessons as $lesson) {
            $lesson->delete();
        }

        $chapter->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Chapter has been deleted successfully.'
        ], 200);
    }

    // Sort chapters (only owner/admin)
    public function sortChapters(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'chapters' => 'required|array|min:1',
            'chapters.*.id' => 'required|integer',
            'chapters.*.course_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors()
            ], 422);
        }

        $courseId = $request->chapters[0]['course_id'];

        // Ensure all belong to same course_id
        foreach ($request->chapters as $c) {
            if ((int)$c['course_id'] !== (int)$courseId) {
                return response()->json([
                    'status' => 422,
                    'message' => 'All chapters must belong to the same course.'
                ], 422);
            }
        }

        $course = Course::find($courseId);
        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found.'
            ], 404);
        }

        if (!$this->canManageCourse($request, $course)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Update sort orders
        foreach ($request->chapters as $key => $chapter) {
            Chapter::where('id', $chapter['id'])
                ->where('course_id', $courseId)
                ->update(['sort_order' => $key]);
        }

        $chapters = Chapter::where('course_id', $courseId)
            ->with('lessons')
            ->orderBy('sort_order', 'ASC')
            ->get();

        return response()->json([
            'status' => 200,
            'chapters' => $chapters,
            'message' => 'Order updated successfully.'
        ], 200);
    }
}