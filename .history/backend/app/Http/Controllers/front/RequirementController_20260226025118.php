<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Requirement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RequirementController extends Controller
{
    private function canManageCourse(Request $request, Course $course): bool
    {
        $user = $request->user();
        if (!$user) return false;
        if ($user->role === 'admin') return true;
        return $user->role === 'instructor' && (int)$course->user_id === (int)$user->id;
    }

    // list requirements (only owner/admin)
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'course_id' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 422, 'errors' => $validator->errors()], 422);
        }

        $course = Course::find($request->course_id);
        if (!$course) {
            return response()->json(['status' => 404, 'message' => 'Course not found.'], 404);
        }

        if (!$this->canManageCourse($request, $course)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $requirements = Requirement::where('course_id', $course->id)
            ->orderBy('sort_order', 'ASC')
            ->get();

        return response()->json([
            'status' => 200,
            'message' => 'Requirements retrieved successfully',
            'data' => $requirements
        ], 200);
    }

    // create requirement (only owner/admin)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'requirement' => 'required|string',
            'course_id' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 422, 'errors' => $validator->errors()], 422);
        }

        $course = Course::find($request->course_id);
        if (!$course) {
            return response()->json(['status' => 404, 'message' => 'Course not found.'], 404);
        }

        if (!$this->canManageCourse($request, $course)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $requirement = new Requirement();
        $requirement->course_id = $course->id;
        $requirement->text = $request->requirement;
        $requirement->sort_order = 1000;
        $requirement->save();

        return response()->json([
            'status' => 200,
            'data' => $requirement,
            'message' => 'Requirement has been created successfully.'
        ], 200);
    }

    // update requirement (only owner/admin)
    public function update($id, Request $request)
    {
        $requirement = Requirement::find($id);
        if (!$requirement) {
            return response()->json(['status' => 404, 'message' => 'Requirement not found.'], 404);
        }

        $course = Course::find($requirement->course_id);
        if (!$course || !$this->canManageCourse($request, $course)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validator = Validator::make($request->all(), [
            'requirement' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 422, 'errors' => $validator->errors()], 422);
        }

        $requirement->text = $request->requirement;
        $requirement->save();

        return response()->json([
            'status' => 200,
            'data' => $requirement,
            'message' => 'Requirement has been updated successfully.'
        ], 200);
    }

    // delete requirement (only owner/admin)
    public function destroy($id, Request $request)
    {
        $requirement = Requirement::find($id);
        if (!$requirement) {
            return response()->json(['status' => 404, 'message' => 'Requirement not found.'], 404);
        }

        $course = Course::find($requirement->course_id);
        if (!$course || !$this->canManageCourse($request, $course)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $requirement->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Requirement has been deleted successfully.'
        ], 200);
    }

    // sort requirements (only owner/admin)
    public function sortRequirements(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'requirements' => 'required|array|min:1',
            'requirements.*.id' => 'required|integer',
            'requirements.*.course_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 422, 'errors' => $validator->errors()], 422);
        }

        $courseId = $request->requirements[0]['course_id'];

        foreach ($request->requirements as $r) {
            if ((int)$r['course_id'] !== (int)$courseId) {
                return response()->json(['status' => 422, 'message' => 'All requirements must belong to the same course.'], 422);
            }
        }

        $course = Course::find($courseId);
        if (!$course) {
            return response()->json(['status' => 404, 'message' => 'Course not found.'], 404);
        }

        if (!$this->canManageCourse($request, $course)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        foreach ($request->requirements as $key => $requirement) {
            Requirement::where('id', $requirement['id'])
                ->where('course_id', $courseId)
                ->update(['sort_order' => $key]);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Order updated successfully.'
        ], 200);
    }
}