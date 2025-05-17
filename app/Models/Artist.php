<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Artist extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'bio',
        'image_url',
        'followers_count',
        'total_plays',
        'popularity_score',
        'is_verified',
        'social_links',
        'website',
        'country',
        'city'
    ];

    protected $casts = [
        'followers_count' => 'integer',
        'total_plays' => 'integer',
        'popularity_score' => 'integer',
        'is_verified' => 'boolean',
        'social_links' => 'array',
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

    /**
     * Get all of the artist's favorites.
     */
    public function favorites()
    {
        return $this->morphMany(Favorite::class, 'favorable');
    }

    /**
     * Get all of the artist's activities.
     */
    public function activities()
    {
        return $this->morphMany(UserActivity::class, 'activity');
    }

    /**
     * Get all followers of this artist.
     */
    public function followers()
    {
        return $this->hasMany(ArtistFollower::class);
    }

    /**
     * Check if a user is following this artist.
     */
    public function isFollowedBy(User $user)
    {
        return $this->followers()->where('user_id', $user->id)->exists();
    }

    /**
     * Increment the followers count.
     */
    public function incrementFollowersCount()
    {
        $this->increment('followers_count');
        return $this->followers_count;
    }

    /**
     * Decrement the followers count.
     */
    public function decrementFollowersCount()
    {
        $this->decrement('followers_count');
        return $this->followers_count;
    }

    /**
     * Get the user that owns the artist profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Increment the total plays count.
     */
    public function incrementTotalPlays()
    {
        $this->increment('total_plays');
        return $this->total_plays;
    }

    /**
     * Calculate and update the popularity score.
     * This is a simple algorithm that considers followers, plays, and recency.
     */
    public function updatePopularityScore()
    {
        // Get counts
        $followersWeight = 2;
        $playsWeight = 1;
        $tracksCount = $this->music()->count();

        if ($tracksCount === 0) {
            $this->popularity_score = 0;
            $this->save();
            return 0;
        }

        // Calculate base score (0-100)
        $followersScore = min(100, ($this->followers_count / 1000) * 100);
        $playsScore = min(100, ($this->total_plays / ($tracksCount * 1000)) * 100);

        // Weighted average
        $score = (($followersScore * $followersWeight) + ($playsScore * $playsWeight)) /
                 ($followersWeight + $playsWeight);

        // Round to integer
        $score = round($score);

        // Update and save
        $this->popularity_score = $score;
        $this->save();

        return $score;
    }
}
