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
        return Inertia::render('Pages/Blogs', [
            'blogs' => Blog::latest()->get()
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
