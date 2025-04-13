<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index($id)
    {
        $blog = Blog::findOrFail($id);
        return $blog->comments()->with('user:id,name')->get();
    }

    public function store(Request $request, $id)
    {

        $blog = Blog::findOrFail($id);
        // Check if the user is authenticated
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        // Validate the request
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment = $blog->comments()->create([
            'user_id' => auth()->id(),
            'content' => $request->content,
        ]);

        return response()->json([
            'id' => $comment->id,
            'content' => $comment->content,
            'blog_id' => $comment->blog_id,
            'created_at' => $comment->created_at,
            'user' => [
                'name' => $comment->user->name,
            ],
        ]);
        
    }
}
