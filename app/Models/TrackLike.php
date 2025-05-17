<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrackLike extends Model
{
    use HasFactory;

    protected $fillable = [
        'music_id',
        'user_id',
    ];

    /**
     * Get the music track that was liked.
     */
    public function music()
    {
        return $this->belongsTo(Music::class);
    }

    /**
     * Get the user that liked the track.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include likes from a specific period.
     */
    public function scopeFromPeriod($query, $days)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }
}
