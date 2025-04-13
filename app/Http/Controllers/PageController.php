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
            ->withCount('comments') // Automatically adds 'comments_count' to each blog
            ->get()
            ->map(function ($blog) {
                // Calculate reaction counts for each blog
                $reactionCounts = $blog->reactions->groupBy('type')->map(function ($reactions) {
                    return $reactions->count();
                });
    
                // Add the reaction counts to the blog object
                $blog->reaction_counts = $reactionCounts;
    
                // Optionally, you can manipulate the comment count here if you want
                $blog->comment_count = $blog->comments_count;
    
                return $blog;
            });
    
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
