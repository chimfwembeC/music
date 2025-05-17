<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrackView extends Model
{
    use HasFactory;

    protected $fillable = [
        'music_id',
        'user_id',
        'ip_address',
        'user_agent',
        'session_id',
        'view_duration',
        'is_unique',
    ];

    protected $casts = [
        'is_unique' => 'boolean',
        'view_duration' => 'integer',
    ];

    /**
     * Get the music track that was viewed.
     */
    public function music()
    {
        return $this->belongsTo(Music::class);
    }

    /**
     * Get the user that viewed the track (if authenticated).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include unique views.
     */
    public function scopeUnique($query)
    {
        return $query->where('is_unique', true);
    }

    /**
     * Scope a query to only include views from a specific period.
     */
    public function scopeFromPeriod($query, $days)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }
}
