<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    public function album()
    {
        return $this->belongsTo(Album::class);
    }
}
