<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IdeaFeedback extends Model
{
    protected $fillable = ['update_id','mentor_id','comment','score'];

    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }
}