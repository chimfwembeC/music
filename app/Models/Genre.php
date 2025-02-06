<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Genre extends Model
{
    protected $fillable = [
        'name',
        'description',
        'slug',
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($genre) {
            $genre->slug = Str::slug($genre->name);
        });

        static::updating(function ($genre) {
            $genre->slug = Str::slug($genre->name);
        });
    }

    protected static function generateUniqueSlug($name)
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $count = 1;

        while (static::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        return $slug;
    }
}
