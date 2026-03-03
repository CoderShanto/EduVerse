<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Cloudinary\Cloudinary;

class LessonController extends Controller
{
    private function canManageCourse(Request $request, Course $course): bool
    {
        $user = $request->user();
        if (!$user) return false;

        if ($user->role === 'admin') return true;

        return $user->role === 'instructor' && (int)$course->user_id === (int)$user->id;
    }

    // Create lesson (only owner/admin)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'chapter' => 'required|integer',
            'lesson' => 'required|string',
            'status' => 'nullable|in:0,1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors()
            ], 422);
        }

        $chapter = Chapter::with('course')->find($request->chapter);
        if (!$chapter) {
            return response()->json([
                'status' => 404,
                'message' => 'Chapter not found.'
            ], 404);
        }

        if (!$chapter->course || !$this->canManageCourse($request, $chapter->course)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $lesson = new Lesson();
        $lesson->chapter_id = $chapter->id;
        $lesson->title = $request->lesson;
        $lesson->sort_order = 1000;
        $lesson->status = $request->status ?? 1;
        $lesson->save();

        return response()->json([
            'status' => 200,
            'data' => $lesson,
            'message' => 'Lesson has been created successfully.'
        ], 200);
    }

    // Show lesson (only owner/admin) — this endpoint is used by EditLesson
    public function show($id, Request $request)
    {
        $lesson = Lesson::with('chapter.course')->find($id);

        if (!$lesson) {
            return response()->json([
                'status' => 404,
                'message' => 'Lesson not found.'
            ], 404);
        }

        $course = $lesson->chapter?->course;
        if (!$course || !$this->canManageCourse($request, $course)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json([
            'status' => 200,
            'data' => $lesson,
        ], 200);
    }

    // Update lesson (only owner/admin)
    public function update($id, Request $request)
    {
        $lesson = Lesson::with('chapter.course')->find($id);

        if (!$lesson) {
            return response()->json([
                'status' => 404,
                'message' => 'Lesson not found.'
            ], 404);
        }

        $course = $lesson->chapter?->course;
        if (!$course || !$this->canManageCourse($request, $course)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validator = Validator::make($request->all(), [
            'chapter_id' => 'required|integer',
            'lesson' => 'required|string',
            'free_preview' => 'nullable|boolean',
            'status' => 'nullable|in:0,1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors()
            ], 422);
        }

        // Ensure target chapter belongs to same course (prevents moving lesson into others course)
        $newChapter = Chapter::with('course')->find($request->chapter_id);
        if (!$newChapter || !$newChapter->course) {
            return response()->json([
                'status' => 404,
                'message' => 'Target chapter not found.'
            ], 404);
        }

        if ((int)$newChapter->course->id !== (int)$course->id) {
            return response()->json([
                'status' => 403,
                'message' => 'You cannot move lesson to another course.'
            ], 403);
        }

        $lesson->chapter_id = $newChapter->id;
        $lesson->title = $request->lesson;
        $lesson->is_free_preview = ($request->free_preview) ? 'yes' : 'no';
        $lesson->duration = $request->duration;
        $lesson->description = $request->description;
        $lesson->status = $request->status ?? $lesson->status;
        $lesson->save();

        return response()->json([
            'status' => 200,
            'data' => $lesson,
            'message' => 'Lesson updated successfully.'
        ], 200);
    }

    // Delete lesson (only owner/admin) + delete video file
    public function destroy($id, Request $request)
    {
        $lesson = Lesson::with('chapter.course')->find($id);

        if (!$lesson) {
            return response()->json([
                'status' => 404,
                'message' => 'Lesson not found.'
            ], 404);
        }

        $course = $lesson->chapter?->course;
        if (!$course || !$this->canManageCourse($request, $course)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $chapterId = $lesson->chapter_id;

        if (!empty($lesson->video)) {
            $videoPath = public_path('uploads/course/videos/' . $lesson->video);
            if (File::exists($videoPath)) {
                File::delete($videoPath);
            }
        }

        $lesson->delete();

        $chapter = Chapter::where('id', $chapterId)->with('lessons')->first();

        return response()->json([
            'status' => 200,
            'chapter' => $chapter,
            'message' => 'Lesson has been deleted successfully.'
        ], 200);
    }

    // Upload lesson video (only owner/admin)
   public function saveVideo($id, Request $request)
{
    $lesson = Lesson::with('chapter.course')->find($id);

    if (!$lesson) {
        return response()->json([
            'status' => 404,
            'message' => 'Lesson not found.'
        ], 404);
    }

    $course = $lesson->chapter?->course;
    if (!$course || !$this->canManageCourse($request, $course)) {
        return response()->json(['message' => 'Forbidden'], 403);
    }

    $validator = Validator::make($request->all(), [
        'video' => 'required|file|mimes:mp4,mov,webm,avi,mkv|max:204800', // 200MB
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => 422,
            'errors' => $validator->errors()
        ], 422);
    }

    try {
        // ✅ Upload to Cloudinary (NO local storage)
        $cloudinary = new Cloudinary();

        $upload = $cloudinary->uploadApi()->upload(
            $request->file('video')->getRealPath(),
            [
                'resource_type' => 'video',
                'folder' => 'lms_videos',
                'public_id' => 'lesson_' . $lesson->id . '_' . time(),
            ]
        );

        $videoUrl = $upload['secure_url'];

        // ✅ Save Cloudinary URL in DB
        // Use your existing column "video" to store URL
        $lesson->video = $videoUrl;
        $lesson->save();

        return response()->json([
            'status' => 200,
            'data' => $lesson,
            'message' => 'Video has been uploaded successfully.',
            'video_url' => $videoUrl
        ], 200);

    } catch (\Throwable $e) {
        return response()->json([
            'status' => 500,
            'message' => 'Cloudinary upload failed.',
            'error' => $e->getMessage(),
        ], 500);
    }
}

    // Sort lessons (only owner/admin)
    public function sortLessons(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'lessons' => 'required|array|min:1',
            'lessons.*.id' => 'required|integer',
            'lessons.*.chapter_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors()
            ], 422);
        }

        $chapterId = $request->lessons[0]['chapter_id'];

        // ensure same chapter
        foreach ($request->lessons as $l) {
            if ((int)$l['chapter_id'] !== (int)$chapterId) {
                return response()->json([
                    'status' => 422,
                    'message' => 'All lessons must belong to the same chapter.'
                ], 422);
            }
        }

        $chapter = Chapter::with('course')->find($chapterId);
        if (!$chapter || !$chapter->course) {
            return response()->json([
                'status' => 404,
                'message' => 'Chapter not found.'
            ], 404);
        }

        if (!$this->canManageCourse($request, $chapter->course)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        foreach ($request->lessons as $key => $lesson) {
            Lesson::where('id', $lesson['id'])
                ->where('chapter_id', $chapterId)
                ->update(['sort_order' => $key]);
        }

        $chapterReloaded = Chapter::where('id', $chapterId)->with('lessons')->first();

        return response()->json([
            'status' => 200,
            'chapter' => $chapterReloaded,
            'message' => 'Order updated successfully.'
        ], 200);
    }

   
}