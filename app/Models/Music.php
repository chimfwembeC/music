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
        'slug',
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
        'is_featured',
        'view_count',
        'like_count',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'download_counts' => 'integer',
        'share_count' => 'integer',
        'view_count' => 'integer',
        'like_count' => 'integer',
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

    /**
     * Get the artist that owns the music.
     */
    public function artist()
    {
        return $this->belongsTo(Artist::class);
    }

    /**
     * Get the genre that owns the music.
     */
    public function genre()
    {
        return $this->belongsTo(Genre::class);
    }

    /**
     * Get the album that owns the music.
     */
    public function album()
    {
        return $this->belongsTo(Album::class);
    }

    /**
     * Get the playlists that contain this music.
     */
    public function playlists()
    {
        return $this->belongsToMany(Playlist::class, 'playlist_music', 'music_id', 'playlist_id')
            ->withTimestamps();
    }

    /**
     * Get all of the music's favorites.
     */
    public function favorites()
    {
        return $this->morphMany(Favorite::class, 'favorable');
    }

    /**
     * Get all of the music's activities.
     */
    public function activities()
    {
        return $this->morphMany(UserActivity::class, 'activity');
    }

    /**
     * Scope a query to only include published music.
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    /**
     * Scope a query to only include featured music.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Get all views for this track.
     */
    public function views()
    {
        return $this->hasMany(TrackView::class);
    }

    /**
     * Get all likes for this track.
     */
    public function likes()
    {
        return $this->hasMany(TrackLike::class);
    }

    /**
     * Check if a user has liked this track.
     */
    public function isLikedBy(User $user)
    {
        return $this->likes()->where('user_id', $user->id)->exists();
    }

    /**
     * Get unique views count for a specific period.
     */
    public function getUniqueViewsCount($days = null)
    {
        $query = $this->views()->unique();

        if ($days) {
            $query->fromPeriod($days);
        }

        return $query->count();
    }

    /**
     * Increment the view count.
     */
    public function incrementViewCount()
    {
        $this->increment('view_count');
        return $this->view_count;
    }

    /**
     * Increment the like count.
     */
    public function incrementLikeCount()
    {
        $this->increment('like_count');
        return $this->like_count;
    }

    /**
     * Decrement the like count.
     */
    public function decrementLikeCount()
    {
        $this->decrement('like_count');
        return $this->like_count;
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
}
