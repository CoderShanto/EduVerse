<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IdeaVote extends Model
{
    protected $fillable = ['idea_id', 'user_id'];

    public function idea()
    {
        return $this->belongsTo(ProblemIdea::class, 'idea_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}