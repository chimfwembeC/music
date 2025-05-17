<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArtistFollower extends Model
{
    use HasFactory;

    protected $fillable = [
        'artist_id',
        'user_id',
        'notifications_enabled',
    ];

    protected $casts = [
        'notifications_enabled' => 'boolean',
    ];

    /**
     * Get the artist being followed.
     */
    public function artist()
    {
        return $this->belongsTo(Artist::class);
    }

    /**
     * Get the user following the artist.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
