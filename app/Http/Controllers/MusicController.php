<?php

namespace App\Http\Controllers;

use App\Models\Music;
use App\Models\Artist; // Assuming you have an Artist model
use App\Models\Genre; // Assuming you have a Genre model
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class MusicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $musics = Music::with(['artist', 'genre'])->get(); // Fetch music with related artist and genre
        return Inertia::render('Music/Index', [
            'musics' => $musics
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $artists = Artist::all(); // Assuming you have artists
        $genres = Genre::all(); // Assuming you have genres
        return Inertia::render('Music/Create', [
            'artists' => $artists,
            'genres' => $genres,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate incoming data
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'artist_id' => 'required|exists:artists,id',
            'genre_id' => 'required|exists:genres,id',
            'file_url' => 'required|file|mimes:mp3,wav,ogg|max:10240', // 10MB limit for music files
            'image_url' => 'nullable|image|max:2048', // 2MB limit for image files
            'duration' => 'required|integer',
        ]);

        // Handle file uploads
        $file = $request->file('file_url');
        $file_url = $file->store('public/music');  // Store the file in the public/music directory
        $original_filename = $file->getClientOriginalName(); // Get the original filename
        $image_url = $request->hasFile('image_url') ? $request->file('image_url')->store('public/images') : null;

        // Store music record, including the original filename
        Music::create([
            'title' => $validated['title'],
            'artist_id' => $validated['artist_id'],
            'genre_id' => $validated['genre_id'],
            'file_url' => $file_url,
            'original_filename' => $original_filename,  // Store the original filename here
            'image_url' => $image_url,
            'duration' => $validated['duration'],
        ]);

        return redirect()->route('music.index')->with('success', 'Music created successfully.');
    }

    // Track Downloads
    public function trackDownload($id)
    {
        $music = Music::findOrFail($id);
        $music->increment('download_counts');

        return response()->json(['message' => 'Download count updated', 'downloads' => $music->download_counts]);
    }

    // Track Shares
    public function trackShare($id)
    {
        $music = Music::findOrFail($id);
        $music->increment('share_count');

        return response()->json(['message' => 'Share count updated', 'shares' => $music->share_count]);
    }
    /**
     * Display the specified resource.
     */
    public function show($slug)
    {

        $music = Music::where('slug', $slug)->first();

        return Inertia::render('Music/Show', [
            'music' => $music->load(['artist', 'genre', 'album']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Music $music)
    {
        $artists = Artist::all();
        $genres = Genre::all();
        return Inertia::render('Music/Edit', [
            'music' => $music,
            'artists' => $artists,
            'genres' => $genres,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Music $music)
    {
        // Validate incoming data
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'artist_id' => 'required|exists:artists,id',
            'genre_id' => 'required|exists:genres,id',
            'file_url' => 'nullable|file|mimes:mp3,wav,ogg|max:10240',
            'image_url' => 'nullable|image|max:2048',
            'duration' => 'required|integer',
        ]);

        // Handle file uploads if provided
        if ($request->hasFile('file_url')) {
            // Delete old file if a new one is uploaded
            Storage::delete($music->file_url);
            $file = $request->file('file_url');
            $file_url = $file->store('public/music');
            $original_filename = $file->getClientOriginalName(); // Get the original filename
        } else {
            $file_url = $music->file_url;
            $original_filename = $music->original_filename; // Retain the original filename if no new file is uploaded
        }

        if ($request->hasFile('image_url')) {
            // Delete old image if a new one is uploaded
            Storage::delete($music->image_url);
            $image_url = $request->file('image_url')->store('public/images');
        } else {
            $image_url = $music->image_url;
        }

        // Update the music record
        $music->update([
            'title' => $validated['title'],
            'artist_id' => $validated['artist_id'],
            'genre_id' => $validated['genre_id'],
            'file_url' => $file_url,
            'original_filename' => $original_filename, // Store the original filename
            'image_url' => $image_url,
            'duration' => $validated['duration'],
        ]);

        return redirect()->route('music.index')->with('success', 'Music updated successfully.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Music $music)
    {
        // Delete files
        Storage::delete($music->file_url);
        Storage::delete($music->image_url);

        // Delete music record
        $music->delete();

        return redirect()->route('music.index')->with('success', 'Music deleted successfully.');
    }
}
