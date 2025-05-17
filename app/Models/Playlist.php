<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Playlist extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'user_id',
        'is_public',
        'image_url',
        'slug',
    ];

    protected $casts = [
        'is_public' => 'boolean',
    ];

    /**
     * The tracks that belong to the playlist.
     */
    public function tracks()
    {
        return $this->belongsToMany(Music::class, 'playlist_music', 'playlist_id', 'music_id')
            ->withTimestamps();
    }

    /**
     * Get the user that owns the playlist.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Boot the model.
     */
    public static function boot()
    {
        parent::boot();

        static::creating(function ($playlist) {
            $playlist->slug = Str::slug($playlist->name);
        });

        static::updating(function ($playlist) {
            $playlist->slug = Str::slug($playlist->name);
        });
    }
}
