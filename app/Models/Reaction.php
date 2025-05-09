<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Enums\ReactionType;
class Reaction extends Model
{
    protected $fillable = ['blog_id', 'user_id', 'type'];

    protected $casts = [
        'type' => ReactionType::class,
    ];

    public function blog()
    {
        return $this->belongsTo(Blog::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
