<?php

namespace App\Http\Controllers;

use App\Models\Artist;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ArtistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch all artists
        $artists = Artist::all();
        return Inertia::render('Artist/Index', [
            'artists' => $artists,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Show form for creating a new artist
        return Inertia::render('Artist/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'image_url' => 'nullable|image|max:2048', // Handle the image upload (optional)
        ]);

        // Handle the image upload if an image is provided
        $image_url = $request->hasFile('image_url') ? $request->file('image_url')->store('artist_images','public') : null;

        // Create a new artist
        Artist::create([
            'name' => $validated['name'],
            'bio' => $validated['bio'],
            'image_url' => $image_url,
        ]);

        return redirect()->route('artists.index')->with('success', 'Artist created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Artist $artist)
    {
        // Display the artist details, including the related music
        return Inertia::render('Artist/Show', [
            'artist' => $artist->load(['music', 'albums']), // Eager load music related to the artist
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($slug)
    {
        $artist = Artist::where('slug',$slug)->first();
        // Show form for editing an existing artist
        return Inertia::render('Artist/Edit', [
            'artist' => $artist,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Artist $artist)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'image_url' => 'nullable|image|max:2048',
        ]);

        // Handle the image upload if a new image is provided
        if ($request->hasFile('image_url')) {
            // Delete the old image if a new one is uploaded
            if ($artist->image_url) {
                Storage::delete($artist->image_url);
            }
            // Store the new image
            $image_url = $request->file('image_url')->store('artist_images','public');
        } else {
            // Keep the old image URL if no new image is uploaded
            $image_url = $artist->image_url;
        }

        // Update the artist record
        $artist->update([
            'name' => $validated['name'],
            'bio' => $validated['bio'],
            'image_url' => $image_url,
        ]);

        return redirect()->route('artists.index')->with('success', 'Artist updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Artist $artist)
    {
        // Delete the artist's image if it exists
        if ($artist->image_url) {
            Storage::delete($artist->image_url);
        }

        // Delete the artist record
        $artist->delete();

        return redirect()->route('artists.index')->with('success', 'Artist deleted successfully.');
    }
}
