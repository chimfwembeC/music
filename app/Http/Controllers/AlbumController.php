<?php

namespace App\Http\Controllers;

use App\Models\Album;
use App\Models\Artist;
use App\Models\Genre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AlbumController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $albums = Album::with(['artist', 'genre'])->get(); // Fetch album with related artist and genre
        return Inertia::render('Albums/Index', [
            'albums' => $albums
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $artists = Artist::all(); // Assuming you have artists
        $genres = Genre::all(); // Assuming you have genres
        return Inertia::render('Albums/Create', [
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
        $file_url = $file->store('public/album');  // Store the file in the public/album directory
        $original_filename = $file->getClientOriginalName(); // Get the original filename
        $image_url = $request->hasFile('image_url') ? $request->file('image_url')->store('public/images') : null;

        // Store album record, including the original filename
        Album::create([
            'title' => $validated['title'],
            'artist_id' => $validated['artist_id'],
            'genre_id' => $validated['genre_id'],
            'file_url' => $file_url,
            'original_filename' => $original_filename,  // Store the original filename here
            'image_url' => $image_url,
            'duration' => $validated['duration'],
        ]);

        return redirect()->route('albums.index')->with('success', 'Album created successfully.');
    }


    /**
     * Display the specified resource.
     */
    public function show(Album $album)
    {
        return Inertia::render('Albums/Show', [
            'album' => $album->load(['artist', 'genre']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Album $album)
    {
        $artists = Artist::all();
        $genres = Genre::all();
        return Inertia::render('Albums/Edit', [
            'album' => $album,
            'artists' => $artists,
            'genres' => $genres,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Album $album)
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
            Storage::delete($album->file_url);
            $file = $request->file('file_url');
            $file_url = $file->store('public/album');
            $original_filename = $file->getClientOriginalName(); // Get the original filename
        } else {
            $file_url = $album->file_url;
            $original_filename = $album->original_filename; // Retain the original filename if no new file is uploaded
        }

        if ($request->hasFile('image_url')) {
            // Delete old image if a new one is uploaded
            Storage::delete($album->image_url);
            $image_url = $request->file('image_url')->store('public/images');
        } else {
            $image_url = $album->image_url;
        }

        // Update the album record
        $album->update([
            'title' => $validated['title'],
            'artist_id' => $validated['artist_id'],
            'genre_id' => $validated['genre_id'],
            'file_url' => $file_url,
            'original_filename' => $original_filename, // Store the original filename
            'image_url' => $image_url,
            'duration' => $validated['duration'],
        ]);

        return redirect()->route('albums.index')->with('success', 'Album updated successfully.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Album $album)
    {
        // Delete files
        Storage::delete($album->file_url);
        Storage::delete($album->image_url);

        // Delete album record
        $album->delete();

        return redirect()->route('albums.index')->with('success', 'Album deleted successfully.');
    }
}
