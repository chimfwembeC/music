<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Blog $blog)
    {
        return $blog->comments()->with('user:id,name')->get();
    }

    public function store(Request $request, Blog $blog)
    {
        $request->validate([
            'body' => 'required|string|max:1000',
        ]);

        $comment = $blog->comments()->create([
            'user_id' => auth()->id(),
            'body' => $request->body,
        ]);

        return $comment->load('user:id,name');
    }
}
