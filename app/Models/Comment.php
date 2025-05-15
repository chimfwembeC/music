<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['blog_id', 'user_id', 'content','parent_comment_id'];

    public function blog()
    {
        return $this->belongsTo(Blog::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

      // 👇 Relationship for parent comment
      public function parent()
      {
          return $this->belongsTo(Comment::class, 'parent_comment_id');
      }
  
      // 👇 Relationship for replies
      public function replies()
      {
          return $this->hasMany(Comment::class, 'parent_comment_id');
      }
}
