<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Outcome;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OutcomeController extends Controller
{
    private function canManageCourse(Request $request, Course $course): bool
    {
        $user = $request->user();
        if (!$user) return false;
        if ($user->role === 'admin') return true;
        return $user->role === 'instructor' && (int)$course->user_id === (int)$user->id;
    }

    // list outcomes (only owner/admin)
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

        $outcomes = Outcome::where('course_id', $course->id)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'status' => 200,
            'message' => 'Outcomes retrieved successfully',
            'data' => $outcomes
        ], 200);
    }

    // create outcome (only owner/admin)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'outcome' => 'required|string',
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

        $outcome = new Outcome();
        $outcome->course_id = $course->id;
        $outcome->text = $request->outcome;
        $outcome->sort_order = 1000;
        $outcome->save();

        return response()->json([
            'status' => 200,
            'data' => $outcome,
            'message' => 'Outcome has been created successfully.'
        ], 200);
    }

    // update outcome (only owner/admin)
    public function update($id, Request $request)
    {
        $outcome = Outcome::find($id);
        if (!$outcome) {
            return response()->json(['status' => 404, 'message' => 'Outcome not found.'], 404);
        }

        $course = Course::find($outcome->course_id);
        if (!$course || !$this->canManageCourse($request, $course)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validator = Validator::make($request->all(), [
            'outcome' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 422, 'errors' => $validator->errors()], 422);
        }

        $outcome->text = $request->outcome;
        $outcome->save();

        return response()->json([
            'status' => 200,
            'data' => $outcome,
            'message' => 'Outcome has been updated successfully.'
        ], 200);
    }

    // delete outcome (only owner/admin)
    public function destroy($id, Request $request)
    {
        $outcome = Outcome::find($id);
        if (!$outcome) {
            return response()->json(['status' => 404, 'message' => 'Outcome not found.'], 404);
        }

        $course = Course::find($outcome->course_id);
        if (!$course || !$this->canManageCourse($request, $course)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $outcome->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Outcome has been deleted successfully.'
        ], 200);
    }

    // sort outcomes (only owner/admin)
    public function sortOutcomes(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'outcomes' => 'required|array|min:1',
            'outcomes.*.id' => 'required|integer',
            'outcomes.*.course_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 422, 'errors' => $validator->errors()], 422);
        }

        $courseId = $request->outcomes[0]['course_id'];

        foreach ($request->outcomes as $o) {
            if ((int)$o['course_id'] !== (int)$courseId) {
                return response()->json(['status' => 422, 'message' => 'All outcomes must belong to the same course.'], 422);
            }
        }

        $course = Course::find($courseId);
        if (!$course) {
            return response()->json(['status' => 404, 'message' => 'Course not found.'], 404);
        }

        if (!$this->canManageCourse($request, $course)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        foreach ($request->outcomes as $key => $outcome) {
            Outcome::where('id', $outcome['id'])
                ->where('course_id', $courseId)
                ->update(['sort_order' => $key]);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Order updated successfully.'
        ], 200);
    }
}