<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Artist extends Model
{

    protected $fillable = [
        'name',
        'slug',
        'bio',
        'image_url'
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($artist) {
            $artist->slug = Str::slug($artist->name);
        });

        static::updating(function ($artist) {
            $artist->slug = Str::slug($artist->name);
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

    public function music()
    {
        return $this->hasMany(Music::class);
    }

    public function albums()
    {
        return $this->hasMany(Album::class);
    }
}
