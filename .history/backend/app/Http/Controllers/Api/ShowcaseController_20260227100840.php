<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\IdeaShowcase;
use App\Models\ProblemIdea;
use Illuminate\Http\Request;

class ShowcaseController extends Controller
{
    // ✅ Public list (auth users)
    public function index(Request $request)
    {
        $items = IdeaShowcase::with([
                'idea.problem',
                'idea.user',
            ])
            ->latest()
            ->paginate(12);

        return response()->json([
            'status' => 200,
            'data' => $items
        ]);
    }

    // ✅ Details
    public function show($id)
    {
        $item = IdeaShowcase::with([
                'idea.problem',
                'idea.user',
                'idea.membersUsers',   // if you have this relation
                'idea.updates',
            ])->find($id);

        if (!$item) {
            return response()->json(['status' => 404, 'message' => 'Showcase not found'], 404);
        }

        return response()->json(['status' => 200, 'data' => $item], 200);
    }

    // ✅ Admin/Instructor creates or updates a showcase from selected idea
    public function publish(Request $request, $ideaId)
    {
        $role = strtolower($request->user()->role ?? '');
        if (!in_array($role, ['admin', 'instructor'])) {
            return response()->json(['status' => 403, 'message' => 'Forbidden'], 403);
        }

        $idea = ProblemIdea::with('problem')->find($ideaId);
        if (!$idea) {
            return response()->json(['status' => 404, 'message' => 'Idea not found'], 404);
        }

        if ((int)$idea->is_selected !== 1) {
            return response()->json(['status' => 422, 'message' => 'Only selected ideas can be showcased'], 422);
        }

        $request->validate([
            'summary' => 'nullable|string',
            'tech_stack' => 'nullable|string',
            'repo_url' => 'nullable|string',
            'demo_url' => 'nullable|string',
            'report_url' => 'nullable|string',
            'cover_image' => 'nullable|string',
            'score' => 'nullable|integer|min:1|max:10',
        ]);

        $showcase = IdeaShowcase::updateOrCreate(
            ['idea_id' => $idea->id],
            [
                'summary' => $request->summary,
                'tech_stack' => $request->tech_stack,
                'repo_url' => $request->repo_url,
                'demo_url' => $request->demo_url,
                'report_url' => $request->report_url,
                'cover_image' => $request->cover_image,
                'score' => $request->score,
            ]
        );

        // mark as completed if you added status
        if (isset($idea->status)) {
            $idea->status = 'completed';
            $idea->save();
        }

        // also close the problem if you want:
        // $idea->problem->status = 'closed'; $idea->problem->save();

        return response()->json([
            'status' => 200,
            'message' => 'Showcase published',
            'data' => $showcase
        ]);
    }
}