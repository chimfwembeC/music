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

    public function replies($commentId)
    {
        $comment = Comment::findOrFail($commentId);

        return $comment->replies()->with('user:id,name')->get();
    }

    public function reply(Request $request, Comment $comment)
{
    if (!auth()->check()) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $request->validate([
        'content' => 'required|string|max:1000',
    ]);

    $reply = $comment->replies()->create([
        'user_id' => auth()->id(),
        'content' => $request->content,
        'blog_id' => $comment->blog_id, // Inherit from parent comment
    ]);

    return response()->json([
        'id' => $reply->id,
        'content' => $reply->content,
        'created_at' => $reply->created_at,
        'parent_comment_id' => $comment->id,
        'user' => [
            'id' => $reply->user->id,
            'name' => $reply->user->name,
        ],
    ]);
}

    public function store(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);
    
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    
        $request->validate([
            'content' => 'required|string|max:1000',
            'parent_comment_id' => 'nullable|exists:comments,id',
        ]);
    
        $comment = $blog->comments()->create([
            'user_id' => auth()->id(),
            'content' => $request->content,
            'parent_comment_id' => $request->input('parent_comment_id'), // ✅ add this
        ]);
    
        return response()->json([
            'id' => $comment->id,
            'content' => $comment->content,
            'blog_id' => $comment->blog_id,
            'created_at' => $comment->created_at,
            'parent_comment_id' => $comment->parent_comment_id,
            'user' => [
                'id' => $comment->user->id,
                'name' => $comment->user->name,
            ],
        ]);
    }
    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);
    
        if ($comment->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    
        $comment->delete();
    
        return response()->json(['message' => 'Comment deleted successfully']);
    }
    public function update(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);
    
        if ($comment->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);
    
        $comment->update([
            'content' => $request->content,
        ]);
    
        return response()->json(['message' => 'Comment updated successfully']);
    }    
}
