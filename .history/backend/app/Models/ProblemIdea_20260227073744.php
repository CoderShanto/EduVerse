<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProblemIdea extends Model
{
    protected $table = 'problem_ideas';

    protected $fillable = [
        'problem_id',
        'user_id',
        'title',
        'description',
        'votes_count',
        'is_selected',
    ];

    public function problem()
    {
        return $this->belongsTo(Problem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function votes()
    {
        return $this->hasMany(IdeaVote::class, 'idea_id');
    }
    public function members()
{
    return $this->hasMany(\App\Models\IdeaMember::class, 'idea_id');
}

public function membersUsers()
{
    return $this->belongsToMany(\App\Models\User::class, 'idea_members', 'idea_id', 'user_id')
        ->withPivot('role')
        ->withTimestamps();
}
}