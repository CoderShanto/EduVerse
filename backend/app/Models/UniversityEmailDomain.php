<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UniversityEmailDomain extends Model
{
    protected $fillable = ['university_id','domain','is_active'];

    public function university()
    {
        return $this->belongsTo(University::class);
    }
}