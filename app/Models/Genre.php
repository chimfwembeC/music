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

    /**
     * Get the music tracks that belong to this genre.
     */
    public function tracks()
    {
        return $this->hasMany(Music::class);
    }

    /**
     * Get the music tracks that belong to this genre (alias for tracks).
     */
    public function music()
    {
        return $this->hasMany(Music::class);
    }

    /**
     * Get the albums that belong to this genre.
     */
    public function albums()
    {
        return $this->hasMany(Album::class);
    }
}
