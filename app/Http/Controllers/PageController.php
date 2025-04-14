<?php

namespace App\Http\Controllers;

use App\Models\Album;
use App\Models\Artist;
use App\Models\Blog;
use App\Models\Music;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    // help create methods for music,artists and blogs use inertia torender the views
    public function music()
    {
        return Inertia::render('Pages/Music', [
            'musics' => Music::with(['artist', 'genre'])->get(),
        ]);
    }

    public function artists()
    {
        return Inertia::render('Pages/Artists', [
            'artists' => Artist::all(),
            'music' => Music::latest()->limit(6)->get(),
            'albums' => Album::with(['genre', 'artist'])->latest()->limit(6)->get(),
            // 'albums' => Album::with(['genre', 'artist'])->where('download_counts' >=  50)->latest()->limit(6)->get(),
        ]);
    }
   
    public function blogs()
    {
        $blogs = Blog::with(['author', 'reactions']) // Ensure reactions are included
            ->withCount('comments')
            ->get()
            ->map(function ($blog) {
                // Calculate reaction counts by grouping by 'type' and counting occurrences
                $reactionCounts = $blog->reactions->groupBy('type')->map(fn($r) => $r->count());
        
                // Attach reaction counts to the blog
                $blog->reaction_counts = $reactionCounts;
        
                // Get the logged-in user's reaction (if authenticated)
                $blog->user_reaction = auth()->check()
                    ? optional($blog->reactions->firstWhere('user_id', auth()->id()))->type
                    : null;
        
                // Optional: If you want a flat comment count field
                $blog->comment_count = $blog->comments_count;
        
                // Get recent reactors for the timeline (limit to the last 5)
                $recentReactors = $blog->reactions->take(5)->map(function ($reaction) {
                    $user = $reaction->user;
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'avatar' => $user->avatar_url, // assuming you have an avatar_url attribute
                        'reaction' => $reaction->type,
                    ];
                });
        
                // Attach recent reactors to the blog
                $blog->recent_reactors = $recentReactors;
        
                return $blog;
            });
        
        // Pass the blogs data to the Inertia view
        return Inertia::render('Pages/Blogs', [
            'blogs' => $blogs,
        ]);
    }
        
    

    public function contact()
    {
        return Inertia::render('Pages/Contact');
    }

    public function about()
    {
        return Inertia::render('Pages/About');
    }
}
