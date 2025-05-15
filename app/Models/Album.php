<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Album extends Model
{
    public $fillable = [
        'title',
        'artist_id',
        'genre_id',
        'image_url',
        'is_published',
        'download_counts',
        'slug',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'download_counts' => 'integer',
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($album) {
            $album->slug = Str::slug($album->title);
        });

        static::updating(function ($album) {
            $album->slug = Str::slug($album->title);
        });
    }

    protected static function generateUniqueSlug($title)
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $count = 1;

        while (static::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        return $slug;
    }

    public function artist()
    {
        return $this->belongsTo(Artist::class);
    }

    public function genre()
    {
        return $this->belongsTo(Genre::class);
    }

    public function music()
    {
        return $this->hasMany(Music::class);
    }
}
