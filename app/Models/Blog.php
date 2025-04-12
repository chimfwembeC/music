<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    use HasFactory;

    protected $table = 'blogs';

    // Define the fillable properties for mass assignment
    protected $fillable = [
        'title',
        'content',
        'is_published',
        'author_id',
        'image_url'
    ];

    /**
     * Get the author that owns the blog.
     */
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
