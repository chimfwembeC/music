<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Blog;
use App\Models\Reaction;
use App\Enums\ReactionType;
use Illuminate\Support\Facades\Auth;


class ReactionController extends Controller
{
    public function react(Request $request, Blog $blog)
    {
        $request->validate([
            'type' => 'required|in:like,love,haha,wow,sad,angry',
        ]);
    
        // Remove existing reaction by user
        $blog->reactions()->where('user_id', auth()->id())->delete();
    
        // Add new reaction
        $blog->reactions()->create([
            'user_id' => auth()->id(),
            'type' => $request->input('type'),
        ]);
    
        return response()->json([
            'message' => 'Reacted!',
            'reactions' => $blog->reactions()->countBy('type'),
        ]);
    }
}
