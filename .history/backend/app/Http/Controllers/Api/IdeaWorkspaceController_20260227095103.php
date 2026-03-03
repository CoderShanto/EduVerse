<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\IdeaFeedback;
use App\Models\IdeaMember;
use App\Models\IdeaUpdate;
use App\Models\ProblemIdea;
use Illuminate\Http\Request;

class IdeaWorkspaceController extends Controller
{
    // GET /api/ideas/{id}
    public function show(Request $request, $id)
    {
        $user = $request->user();

        $idea = ProblemIdea::with([
            'problem:id,title,status,category',
            'membersUsers:id,name',
            'updates.user:id,name',
            'updates.feedback.mentor:id,name',
        ])->find($id);

        if (!$idea) {
            return response()->json(['status' => 404, 'message' => 'Idea not found'], 404);
        }

        $allowed = (int)$idea->is_selected === 1 || ($idea->problem && $idea->problem->status === 'building');
        if (!$allowed) {
            return response()->json(['status' => 403, 'message' => 'Workspace not available yet'], 403);
        }

        $isMember = IdeaMember::where('idea_id', $id)->where('user_id', $user->id)->exists();
        $myRole = IdeaMember::where('idea_id', $id)->where('user_id', $user->id)->value('role');

        return response()->json([
            'status' => 200,
            'data' => [
                'idea' => $idea,
                'is_member' => $isMember,
                'my_role' => $myRole,
            ],
        ], 200);
    }

    // POST /api/ideas/{id}/updates
    public function addUpdate(Request $request, $id)
    {
        $user = $request->user();

        $request->validate([
            'content' => 'required|string',
            'proof_type' => 'nullable|in:github,demo,pdf,image,link',
            'proof_url' => 'nullable|string',
        ]);

        $isMember = IdeaMember::where('idea_id', $id)->where('user_id', $user->id)->exists();
        if (!$isMember) {
            return response()->json(['status' => 403, 'message' => 'Only team members can post updates'], 403);
        }

        $update = IdeaUpdate::create([
            'idea_id' => $id,
            'user_id' => $user->id,
            'content' => $request->content,
            'proof_type' => $request->proof_type,
            'proof_url' => $request->proof_url,
        ]);

        return response()->json(['status' => 200, 'message' => 'Update posted', 'data' => $update], 200);
    }

    // POST /api/updates/{id}/feedback (admin/instructor only)
   public function addUpdate(Request $request, $id)
{
    $user = $request->user();

    $isMember = \App\Models\IdeaMember::where('idea_id', $id)
        ->where('user_id', $user->id)
        ->exists();

    if (!$isMember) {
        return response()->json(['status' => 403, 'message' => 'Only team members can post updates'], 403);
    }

    $request->validate([
        'content' => 'required|string',
        'proof_type' => 'nullable|in:github,demo,pdf,image,link',
        'proof_url' => 'nullable|string',
        'proof_file' => 'nullable|file|max:10240|mimes:pdf,jpg,jpeg,png,webp',
    ]);

    $proofType = $request->input('proof_type');
    $proofUrl  = $request->input('proof_url');

    // ✅ If pdf/image -> file required
    if (in_array($proofType, ['pdf', 'image'])) {

        if (!$request->hasFile('proof_file')) {
            return response()->json([
                'status' => 422,
                'message' => 'For PDF/Image, please upload a file.'
            ], 422);
        }

        $file = $request->file('proof_file');

        $path = $file->store('innovation_proofs', 'public');
        $proofUrl = asset('storage/' . $path);
    }

    // ✅ Save update (proofUrl may be null only if user selected no proof_type and no url)
    $update = \App\Models\IdeaUpdate::create([
        'idea_id' => $id,
        'user_id' => $user->id,
        'content' => $request->content,
        'proof_type' => $proofType,
        'proof_url' => $proofUrl,
    ]);

    return response()->json([
        'status' => 200,
        'message' => 'Update posted',
        'data' => $update
    ], 200);
}
}