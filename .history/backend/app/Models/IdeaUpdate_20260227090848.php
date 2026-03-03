<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IdeaUpdate extends Model
{
    protected $fillable = ['idea_id','user_id','content','proof_type','proof_url'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function feedback()
    {
        return $this->hasMany(IdeaFeedback::class, 'update_id')->latest();
    }
}