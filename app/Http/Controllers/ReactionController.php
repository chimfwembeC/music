<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Blog;
use App\Models\Reaction;
use App\Enums\ReactionType;
use Illuminate\Support\Facades\Auth;


class ReactionController extends Controller
{
  
    public function react(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);
    
        // Check if the user is authenticated
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    
        // Validate the reaction type
        $request->validate([
            'type' => 'required|in:like,love,haha,wow,sad,angry',
        ]);
    
        // Remove the previous reaction by the current user
        $blog->reactions()->where('user_id', Auth::id())->delete();
    
        // Add the new reaction by the current user
        $blog->reactions()->create([
            'user_id' => Auth::id(),
            'type' => $request->input('type'),
        ]);
    
        // Get the updated count of reactions for each type
        $counts = $blog->reactions()
            ->selectRaw('type, COUNT(*) as count')
            ->groupBy('type')
            ->pluck('count', 'type');
    
        // Get the current user's reaction (for displaying the user's reaction)
        $userReaction = $request->input('type');
    
        return response()->json([
            'message' => 'Reacted!',
            'reactions' => $counts,       // Reaction counts for each type
            'userReaction' => $userReaction, // The current user's reaction
        ]);
    }
    
}
