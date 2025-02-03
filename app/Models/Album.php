<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Album extends Model
{
    public $fillable = [
        'title',
        'artist_id',
        'genre_id',
        'original_filename',
        'file_url',
        'image_url',
        'tracks',
        'is_published',
        'download_counts'
    ];

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
