<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\IdeaMember;
use App\Models\Problem;
use App\Models\ProblemIdea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InnovationUserController extends Controller
{
    // GET /api/innovation/my-ideas
    public function myIdeas(Request $request)
    {
        $user = $request->user();

        $ideas = ProblemIdea::query()
            ->where('user_id', $user->id)
            ->with([
                'problem:id,title,status,category',
            ])
            ->orderBy('id', 'desc')
            ->paginate(10);

        return response()->json([
            'status' => 200,
            'data' => $ideas
        ], 200);
    }

    // GET /api/innovation/my-teams
    public function myTeams(Request $request)
    {
        $user = $request->user();

        // ideas where user is a member (idea_members)
        $ideaIds = IdeaMember::where('user_id', $user->id)->pluck('idea_id')->toArray();

        $ideas = ProblemIdea::query()
            ->whereIn('id', $ideaIds)
            ->with([
                'problem:id,title,status,category',
                'membersUsers:id,name'
            ])
            ->orderBy('id', 'desc')
            ->paginate(10);

        return response()->json([
            'status' => 200,
            'data' => $ideas
        ], 200);
    }

    // POST /api/ideas/{id}/join
    // Rule: only allow join if idea is selected OR problem is building
    public function joinIdea(Request $request, $ideaId)
    {
        $user = $request->user();

        $idea = ProblemIdea::with('problem')->find($ideaId);
        if (!$idea) {
            return response()->json(['status' => 404, 'message' => 'Idea not found'], 404);
        }

        // Must be selected or in building stage
        $isAllowed = (int)$idea->is_selected === 1 || ($idea->problem && $idea->problem->status === 'building');
        if (!$isAllowed) {
            return response()->json([
                'status' => 403,
                'message' => 'You can only join after an idea is selected for building.'
            ], 403);
        }

        // create membership if not exists
        $exists = IdeaMember::where('idea_id', $ideaId)->where('user_id', $user->id)->exists();
        if ($exists) {
            return response()->json(['status' => 200, 'message' => 'Already joined'], 200);
        }

        // owner = idea creator, member = others
        $role = ($idea->user_id == $user->id) ? 'owner' : 'member';

        IdeaMember::create([
            'idea_id' => $ideaId,
            'user_id' => $user->id,
            'role' => $role,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Joined team successfully'
        ], 200);
    }
}