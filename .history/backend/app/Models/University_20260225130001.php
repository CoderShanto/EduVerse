<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class University extends Model
{
    protected $fillable = ['name','short_name','is_active'];

    public function emailDomains()
    {
        return $this->hasMany(UniversityEmailDomain::class);
    }
}
