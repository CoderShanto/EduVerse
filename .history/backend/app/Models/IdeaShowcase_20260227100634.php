<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IdeaShowcase extends Model
{
    protected $fillable = [
        'idea_id',
        'summary',
        'tech_stack',
        'repo_url',
        'demo_url',
        'report_url',
        'cover_image',
        'score',
    ];

    public function idea()
    {
        return $this->belongsTo(ProblemIdea::class, 'idea_id');
    }
}