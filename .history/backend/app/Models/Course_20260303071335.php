<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Course extends Model
{
    protected $appends = ['course_small_image'];

    public function getCourseSmallImageAttribute()
    {
        if (empty($this->image)) {
            return "";
        }

        return asset('uploads/course/small/' . $this->image);
    }

    public function chapters()
    {
        return $this->hasMany(Chapter::class)->orderBy('sort_order', 'ASC');
    }

    // ✅ Lets DashboardController count lessons properly
    public function lessons(): HasManyThrough
    {
        return $this->hasManyThrough(
            Lesson::class,
            Chapter::class,
            'course_id',   // FK on chapters
            'chapter_id',  // FK on lessons
            'id',          // PK on courses
            'id'           // PK on chapters
        );
    }

    public function outcomes()
    {
        return $this->hasMany(Outcome::class)->orderBy('sort_order', 'ASC');
    }

    public function requirements()
    {
        return $this->hasMany(Requirement::class)->orderBy('sort_order', 'ASC');
    }

    public function level()
    {
        return $this->belongsTo(Level::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function language()
    {
        return $this->belongsTo(Language::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    // ✅ FIX: relationship used by AdminCourseController::with('user')
    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }
}