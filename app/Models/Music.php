<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Music extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'artist_id',
        'genre_id',
        'album_id',
        'file_url',
        'image_url',
        'duration',
        'original_filename',
        'is_published',
        'download_counts',
        'share_count',
        'slug',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'download_counts' => 'integer',
    ];


    public static function boot()
    {
        parent::boot();

        static::creating(function ($music) {
            $music->slug = Str::slug($music->title);
        });

        static::updating(function ($music) {
            $music->slug = Str::slug($music->title);
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

    public function album()
    {
        return $this->belongsTo(Album::class);
    }
}
