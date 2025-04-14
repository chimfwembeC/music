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
    $blogs = Blog::with([
            'author',
            'reactions',
            'comments' => fn($q) => $q->with(['user', 'replies.user'])->orderBy('created_at'),
        ])
        ->withCount('comments')
        ->get()
        ->map(function ($blog) {
            $reactionCounts = $blog->reactions->groupBy('type')->map(fn($r) => $r->count());
            $blog->reaction_counts = $reactionCounts;

            $blog->user_reaction = auth()->check()
                ? optional($blog->reactions->firstWhere('user_id', auth()->id()))->type
                : null;

            $blog->comment_count = $blog->comments_count;

            $recentReactors = $blog->reactions->take(5)->map(function ($reaction) {
                $user = $reaction->user;
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'avatar' => $user->profile_photo_url,
                    'reaction' => $reaction->type,
                ];
            });

            $blog->recent_reactors = $recentReactors;

            // 🧠 Include threaded comments (top-level with replies)
            $blog->threaded_comments = $blog->comments
                ->whereNull('parent_comment_id')
                ->map(function ($comment) {
                    $comment->replies = $comment->replies;
                    return $comment;
                });

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
