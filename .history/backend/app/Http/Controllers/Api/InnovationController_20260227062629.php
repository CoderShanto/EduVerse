<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\IdeaVote;
use App\Models\Problem;
use App\Models\ProblemIdea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class InnovationController extends Controller
{
    // GET /api/problems/{id}
    public function problemDetails(Request $request, $id)
    {
        $user = $request->user();

        $problem = Problem::with([
            'user:id,name',
            'ideas.user:id,name',
        ])->find($id);

        if (!$problem) {
            return response()->json(['status' => 404, 'message' => 'Problem not found'], 404);
        }

        // mark which ideas user has voted
        $myVotes = [];
        if ($user) {
            $myVotes = IdeaVote::where('user_id', $user->id)
                ->whereIn('idea_id', $problem->ideas->pluck('id'))
                ->pluck('idea_id')
                ->toArray();
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'problem' => $problem,
                'my_voted_idea_ids' => $myVotes,
            ]
        ], 200);
    }

    // POST /api/problems/{id}/ideas
    public function addIdea(Request $request, $problemId)
    {
        $user = $request->user();
        if (!$user) return response()->json(['status' => 401, 'message' => 'Unauthenticated'], 401);

        $problem = Problem::find($problemId);
        if (!$problem) return response()->json(['status' => 404, 'message' => 'Problem not found'], 404);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string|min:10'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 422, 'errors' => $validator->errors()], 422);
        }

        $idea = ProblemIdea::create([
            'problem_id' => $problemId,
            'user_id' => $user->id,
            'title' => $request->title,
            'description' => $request->description,
            'votes_count' => 0,
            'is_selected' => 0,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Idea added',
            'data' => $idea
        ], 200);
    }

    // POST /api/ideas/{id}/vote  (toggle)
    public function toggleVote(Request $request, $ideaId)
    {
        $user = $request->user();
        if (!$user) return response()->json(['status' => 401, 'message' => 'Unauthenticated'], 401);

        $idea = ProblemIdea::find($ideaId);
        if (!$idea) return response()->json(['status' => 404, 'message' => 'Idea not found'], 404);

        return DB::transaction(function () use ($user, $idea) {
            $existing = IdeaVote::where('idea_id', $idea->id)->where('user_id', $user->id)->first();

            if ($existing) {
                $existing->delete();
                $idea->decrement('votes_count');
                $voted = false;
            } else {
                IdeaVote::create(['idea_id' => $idea->id, 'user_id' => $user->id]);
                $idea->increment('votes_count');
                $voted = true;
            }

            return response()->json([
                'status' => 200,
                'message' => $voted ? 'Voted' : 'Vote removed',
                'data' => [
                    'idea_id' => $idea->id,
                    'votes_count' => (int) $idea->fresh()->votes_count,
                    'voted' => $voted,
                ]
            ], 200);
        });
    }

    // POST /api/ideas/{id}/select  (mentor/admin/instructor only)
    public function selectIdea(Request $request, $ideaId)
    {
        $user = $request->user();
        if (!$user) return response()->json(['status' => 401, 'message' => 'Unauthenticated'], 401);

        $role = strtolower(trim((string)($user->role ?? '')));
        if (!in_array($role, ['admin', 'instructor', 'mentor'])) {
            return response()->json(['status' => 403, 'message' => 'Forbidden'], 403);
        }

        $idea = ProblemIdea::with('problem')->find($ideaId);
        if (!$idea) return response()->json(['status' => 404, 'message' => 'Idea not found'], 404);

        return DB::transaction(function () use ($idea) {

            // unselect others under same problem
            ProblemIdea::where('problem_id', $idea->problem_id)->update(['is_selected' => 0]);

            // select this
            $idea->update(['is_selected' => 1]);

            // update problem status
            $idea->problem->update(['status' => 'building']);

            return response()->json([
                'status' => 200,
                'message' => 'Idea selected for building',
                'data' => $idea->fresh()
            ], 200);
        });
    }
}