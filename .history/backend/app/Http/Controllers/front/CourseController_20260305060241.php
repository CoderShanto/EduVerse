<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Language;
use App\Models\Lesson;
use App\Models\Level;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;


use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Log;

class CourseController extends Controller
{
    // helper: admin can access all, instructor only own
    private function canManageCourse(Request $request, Course $course): bool
    {
        $user = $request->user();
        if (!$user) return false;

        if ($user->role === 'admin') return true;

        // instructor can manage only own courses
        return $user->role === 'instructor' && (int)$course->user_id === (int)$user->id;
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|min:5'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors()
            ], 422);
        }

        $course = new Course();
        $course->title = $request->title;
        $course->status = 0; // draft
        $course->user_id = $request->user()->id;
        $course->save();

        return response()->json([
            'status' => 200,
            'data' => $course,
            'message' => 'Course has been created successfully.'
        ], 200);
    }

    public function show($id, Request $request)
    {
        $course = Course::with(['chapters', 'chapters.lessons'])->find($id);

        if ($course == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found.'
            ], 404);
        }

        if (!$this->canManageCourse($request, $course)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json([
            'status' => 200,
            'data' => $course
        ], 200);
    }

    public function metaData()
    {
        return response()->json([
            'status' => 200,
            'categories' => Category::all(),
            'levels' => Level::all(),
            'languages' => Language::all(),
        ], 200);
    }

    public function update($id, Request $request)
    {
        $course = Course::find($id);

        if ($course == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found.'
            ], 404);
        }

        if (!$this->canManageCourse($request, $course)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|min:5',
            'category' => 'required',
            'level' => 'required',
            'language' => 'required',
            'sell_price' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors()
            ], 422);
        }

        $course->title = $request->title;
        $course->category_id = $request->category;
        $course->level_id = $request->level;
        $course->language_id = $request->language;
        $course->price = $request->sell_price;
        $course->cross_price = $request->cross_price;
        $course->description = $request->description;
        $course->save();

        return response()->json([
            'status' => 200,
            'data' => $course,
            'message' => 'Course updated successfully.'
        ], 200);
    }

public function saveCourseImage($id, Request $request)
{
    $course = Course::find($id);

    if (!$course) {
        return response()->json(['status' => 404, 'message' => 'Course not found.'], 404);
    }

    if (!$this->canManageCourse($request, $course)) {
        return response()->json(['message' => 'Forbidden'], 403);
    }

    $request->validate([
        'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
    ]);

    try {
        // If you set CLOUDINARY_URL env correctly, this will work
        $cloudinary = new \Cloudinary\Cloudinary();

        // Upload original
        $upload = $cloudinary->uploadApi()->upload(
            $request->file('image')->getRealPath(),
            [
                'folder' => 'course_covers',
                'public_id' => 'course_' . $course->id . '_' . time(),
            ]
        );

        $fullUrl = $upload['secure_url'];
        $publicId = $upload['public_id'];

        // Create small/thumbnail URL (NO DB column named course_small_image)
        $smallUrl = (string) $cloudinary->image($publicId)
            ->resize(\Cloudinary\Transformation\Resize::fill(750, 450))
            ->toUrl();

        // ✅ Save to YOUR existing columns
        $course->image_url = $fullUrl;
        $course->image_small_url = $smallUrl;

        // Optional: if you want image column also to hold the full URL:
        // (If your frontend still uses `image`, this prevents breaking)
        $course->image = $fullUrl;

        $course->save();

        return response()->json([
            'status' => 200,
            'data' => $course,
            'message' => 'Course image uploaded successfully.',
        ]);
    } catch (\Throwable $e) {
        \Log::error('saveCourseImage failed: ' . $e->getMessage());

        return response()->json([
            'status' => 500,
            'message' => 'Image upload failed on server',
            'error' => $e->getMessage(),
        ], 500);
    }
}

   public function changeStatus($id, Request $request)
{
    $course = Course::find($id);

    if ($course == null) {
        return response()->json([
            'status' => 404,
            'message' => 'Course not found.'
        ], 404);
    }

    if (!$this->canManageCourse($request, $course)) {
        return response()->json(['message' => 'Forbidden'], 403);
    }

    $validator = Validator::make($request->all(), [
        'status' => 'required|in:0,1'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => 422,
            'errors' => $validator->errors()
        ], 422);
    }

    // ✅ Optional: still require 1 chapter (keep this if you want)
    $chapters = Chapter::where('course_id', $id)->pluck('id')->toArray();
    if (count($chapters) == 0) {
        return response()->json([
            'status' => 200,
            'course' => $course,
            'message' => 'At least one chapter is required to publish a course.'
        ], 200);
    }

    // ✅ Removed: video requirement

    $course->status = (int)$request->status;
    $course->save();

    $message = ($course->status == 1) ? 'Course published successfully' : 'Course unpublished successfully';

    return response()->json([
        'status' => 200,
        'course' => $course,
        'message' => $message
    ], 200);
}

    public function destroy($id, Request $request)
    {
        $course = Course::find($id);

        if ($course == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found.'
            ], 404);
        }

        if (!$this->canManageCourse($request, $course)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // delete chapter lessons videos
        $chapters = Chapter::where('course_id', $course->id)->get();

        foreach ($chapters as $chapter) {
            $lessons = Lesson::where('chapter_id', $chapter->id)->get();

            foreach ($lessons as $lesson) {
                if (!empty($lesson->video)) {
                    $videoPath = public_path('uploads/course/videos/' . $lesson->video);
                    if (File::exists($videoPath)) {
                        File::delete($videoPath);
                    }
                }
                $lesson->delete();
            }

            $chapter->delete();
        }

        // delete course images
        if (!empty($course->image)) {
            $img1 = public_path('uploads/course/' . $course->image);
            $img2 = public_path('uploads/course/small/' . $course->image);
            if (File::exists($img1)) File::delete($img1);
            if (File::exists($img2)) File::delete($img2);
        }

        $course->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Course deleted successfully.'
        ], 200);
    }

    public function changeFeatured(Request $request, $id)
{
    $request->validate([
        'is_featured' => 'required|in:0,1'
    ]);

    $course = Course::findOrFail($id);

    // Optional: Only admin can feature OR instructor can feature own course
    // if ($request->user()->role !== 'admin' && $course->user_id !== $request->user()->id) {
    //     return response()->json(['status'=>403,'message'=>'Forbidden'],403);
    // }

    $course->is_featured = $request->is_featured;
    $course->save();

    return response()->json([
        'status' => 200,
        'message' => 'Featured status updated',
        'course' => $course
    ]);
}
}