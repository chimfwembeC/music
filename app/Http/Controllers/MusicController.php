<?php

namespace App\Http\Controllers;

use App\Models\Music;
use App\Models\Artist; // Assuming you have an Artist model
use App\Models\Genre; // Assuming you have a Genre model
use App\Models\Album; // Assuming you have an Album model
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
        $albums = Album::all(); // Assuming you have albums

        return Inertia::render('Music/Create', [
            'artists' => $artists,
            'albums' => $albums,
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
            'is_published' => 'sometimes|boolean',
            'is_featured' => 'sometimes|boolean',
        ]);

        // Handle file uploads
        $file = $request->file('file_url');
        $file_url = $file->store('music','public');  // Store the file in the public/music directory
        $original_filename = $file->getClientOriginalName(); // Get the original filename

        $image_url = null;
if ($request->hasFile('image_url')) {
    $image_url = $request->file('image_url')->store('images','public'); // Save image
}
        // $image_url = $request->hasFile('image_url') ? $request->file('image_url')->store('public/images') : null;

         // Or use $request->boolean() to be extra safe with checkbox inputs
         $isPublished = $request->boolean('is_published');
         $isFeatured = $request->boolean('is_featured');
        // Store music record, including the original filename
        Music::create([
            'title' => $validated['title'],
            'artist_id' => $validated['artist_id'],
            'genre_id' => $validated['genre_id'],
            'file_url' => $file_url,
            'is_published' => $isPublished,
            'is_featured' => $isFeatured,
            'original_filename' => $original_filename,  // Store the original filename here
            'image_url' => $image_url,
            'duration' => $validated['duration'],
        ]);

        return redirect()->route('tracks.index')->with('success', 'Music created successfully.');
    }

    // Track Downloads
    public function trackDownload($id)
    {
        $music = Music::findOrFail($id);
        $music->increment('download_counts');

        return response()->json(['message' => 'Download count updated', 'downloads' => $music->download_counts]);
    }


    public function togglePublish(Request $request, $id)
{
    $request->validate([
        'is_published' => 'required|boolean',
    ]);

    $music = Music::findOrFail($id);
    $music->is_published = $request->boolean('is_published');
    $music->save();

    return back()->with('message', 'Track publish status updated.');
}

public function toggleFeatured(Request $request, $id)
{
    $request->validate([
        'is_featured' => 'required|boolean',
    ]);

    $music = Music::findOrFail($id);
    $music->is_featured = $request->boolean('is_featured');
    $music->save();

    return back()->with('message', 'Track featured status updated.');
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
    public function edit($slug)
    {
        $music = Music::where('slug', $slug)->first();
        $artists = Artist::all();
        $genres = Genre::all();
        $albums = Album::all(); // Assuming you have albums

        return Inertia::render('Music/Edit', [
            'music' => $music,
            'artists' => $artists,
            'genres' => $genres,
            'albums' => $albums,
        ]);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {

        $music = Music::findOrFail($id);
        // Check if the music exists
        if (!$music) {
            return redirect()->route('tracks.index')->with('error', 'Music not found.');
        }
        // Validate incoming data
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'artist_id' => 'required|exists:artists,id',
            'genre_id' => 'required|exists:genres,id',
            'file_url' => 'nullable|file|mimes:mp3,wav,ogg|max:10240',
            'image_url' => 'nullable|image|max:2048',
            'duration' => 'required|integer',
            'is_published' => 'sometimes|boolean',
            'is_featured' => 'sometimes|boolean',
        ]);

        // Or use $request->boolean() to be extra safe with checkbox inputs
        $isPublished = $request->boolean('is_published');
        $isFeatured = $request->boolean('is_featured');

        // Handle file uploads if provided
        if ($request->hasFile('file_url')) {
            // Delete old file if a new one is uploaded
            // Storage::delete($music->file_url);
            $file = $request->file('file_url');
            $file_url = $file->store('music','public');
            $original_filename = $file->getClientOriginalName(); // Get the original filename
        } else {
            $file_url = $music->file_url;
            $original_filename = $music->original_filename; // Retain the original filename if no new file is uploaded
        }

        if ($request->hasFile('image_url')) {
            // Delete old image if a new one is uploaded
            // Storage::delete($music->image_url);
            $image_url = $request->file('image_url')->store('images','public');
        } else {
            $image_url = $music->image_url;
        }

        // return response($music);
        // Update the music record
        $music->update([
            'title' => $validated['title'],
            'artist_id' => $validated['artist_id'],
            'genre_id' => $validated['genre_id'],
            'is_published' => $isPublished,
            'is_featured' => $isFeatured,
            'file_url' => $file_url,
            'original_filename' => $original_filename, // Store the original filename
            'image_url' => $image_url,
            'duration' => $validated['duration'],
        ]);

        return redirect()->route('tracks.index')->with('success', 'Music updated successfully.');
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
