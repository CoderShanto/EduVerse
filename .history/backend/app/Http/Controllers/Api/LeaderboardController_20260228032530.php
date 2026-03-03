<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\IdeaMember;
use App\Models\IdeaShowcase;
use App\Models\IdeaUpdate;
use App\Models\ProblemIdea;
use App\Models\User;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    public function index(Request $request)
    {
        // ✅ Students only (you can include others if you want)
        $students = User::where('role', 'student')
            ->select('id', 'name')
            ->get();

        // ✅ Selected ideas
        $selectedIdeaIds = ProblemIdea::where('is_selected', 1)->pluck('id')->toArray();

        // ✅ Updates count per user
        $updatesByUser = IdeaUpdate::selectRaw('user_id, COUNT(*) as cnt')
            ->groupBy('user_id')
            ->pluck('cnt', 'user_id');

        // ✅ Showcases = completed ideas (score inside showcase)
        $showcases = IdeaShowcase::select('idea_id', 'score')
            ->get()
            ->keyBy('idea_id');

        // ✅ Get all idea IDs we care about (selected + showcased)
        $ideaIds = array_unique(array_merge($selectedIdeaIds, $showcases->keys()->toArray()));

        // ✅ Member mapping: who is in which idea
        $members = IdeaMember::select('idea_id', 'user_id')
            ->whereIn('idea_id', $ideaIds)
            ->get();

        $selectedIdeasByUser = [];
        $completedIdeasByUser = [];
        $qualityBonusByUser = [];

        foreach ($members as $m) {
            // Selected idea count
            if (in_array($m->idea_id, $selectedIdeaIds)) {
                $selectedIdeasByUser[$m->user_id] = ($selectedIdeasByUser[$m->user_id] ?? 0) + 1;
            }

            // Completed (showcased) idea count
            if ($showcases->has($m->idea_id)) {
                $completedIdeasByUser[$m->user_id] = ($completedIdeasByUser[$m->user_id] ?? 0) + 1;

                $score = (int) ($showcases[$m->idea_id]->score ?? 0);
                if ($score >= 8) {
                    $qualityBonusByUser[$m->user_id] = ($qualityBonusByUser[$m->user_id] ?? 0) + 5;
                }
            }
        }

        // ✅ Optional: include completed course points if you want
        // If you have Activity/Enrollment completion logic, we can add later.

        $rows = $students->map(function ($u) use ($updatesByUser, $selectedIdeasByUser, $completedIdeasByUser, $qualityBonusByUser) {
            $updates      = (int) ($updatesByUser[$u->id] ?? 0);
            $selected     = (int) ($selectedIdeasByUser[$u->id] ?? 0);
            $completed    = (int) ($completedIdeasByUser[$u->id] ?? 0);
            $qualityBonus = (int) ($qualityBonusByUser[$u->id] ?? 0);

            // ✅ SCORING
            $score =
                ($updates * 5) +
                ($selected * 25) +
                ($completed * 50) +
                $qualityBonus;

            return [
                'user_id' => $u->id,
                'name' => $u->name,
                'score' => $score,
                'updates' => $updates,
                'selected_ideas' => $selected,
                'completed_ideas' => $completed,
                'quality_bonus' => $qualityBonus,
            ];
        })
        ->sortByDesc('score')
        ->values();

        return response()->json([
            'status' => 200,
            'data' => $rows,
        ], 200);
    }
}