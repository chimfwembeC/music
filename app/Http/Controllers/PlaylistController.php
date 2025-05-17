<?php

namespace App\Http\Controllers;

use App\Models\Playlist;
use App\Models\Music;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PlaylistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        
        // If admin, show all playlists
        if ($user->role === 'admin') {
            $playlists = Playlist::with('user')
                ->withCount('tracks')
                ->get();
        } else {
            // Otherwise, show only public playlists and user's own playlists
            $playlists = Playlist::where('is_public', true)
                ->orWhere('user_id', $user->id)
                ->with('user')
                ->withCount('tracks')
                ->get();
        }
        
        return Inertia::render('Playlist/Index', [
            'playlists' => $playlists
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $tracks = Music::with(['artist', 'genre'])
            ->where('is_published', true)
            ->get();
            
        return Inertia::render('Playlist/Create', [
            'tracks' => $tracks
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_public' => 'boolean',
            'image_url' => 'nullable|image|max:2048',
            'tracks' => 'nullable|array',
            'tracks.*' => 'exists:music,id',
        ]);

        // Handle image upload
        $image_url = null;
        if ($request->hasFile('image_url')) {
            $image_url = $request->file('image_url')->store('playlist_images', 'public');
        }

        // Create the playlist
        $playlist = Playlist::create([
            'name' => $request->name,
            'description' => $request->description,
            'user_id' => Auth::id(),
            'is_public' => $request->boolean('is_public', true),
            'image_url' => $image_url,
        ]);

        // Add tracks to playlist if provided
        if ($request->has('tracks') && is_array($request->tracks)) {
            $position = 0;
            foreach ($request->tracks as $trackId) {
                $playlist->tracks()->attach($trackId, ['position' => $position]);
                $position++;
            }
        }

        return redirect()->route('playlists.index')->with('success', 'Playlist created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = Auth::user();
        $playlist = Playlist::with(['user', 'tracks.artist', 'tracks.genre', 'tracks.album'])
            ->findOrFail($id);
            
        // Check if user has permission to view this playlist
        if (!$playlist->is_public && $playlist->user_id !== $user->id && $user->role !== 'admin') {
            abort(403, 'You do not have permission to view this playlist.');
        }
        
        // Check if the current user is the owner
        $isOwner = $playlist->user_id === $user->id;
        
        return Inertia::render('Playlist/Show', [
            'playlist' => $playlist,
            'isOwner' => $isOwner,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = Auth::user();
        $playlist = Playlist::with(['tracks'])->findOrFail($id);
        
        // Check if user has permission to edit this playlist
        if ($playlist->user_id !== $user->id && $user->role !== 'admin') {
            abort(403, 'You do not have permission to edit this playlist.');
        }
        
        $tracks = Music::with(['artist', 'genre'])
            ->where('is_published', true)
            ->get();
            
        return Inertia::render('Playlist/Edit', [
            'playlist' => $playlist,
            'tracks' => $tracks,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $playlist = Playlist::findOrFail($id);
        
        // Check if user has permission to update this playlist
        if ($playlist->user_id !== Auth::id() && Auth::user()->role !== 'admin') {
            abort(403, 'You do not have permission to update this playlist.');
        }
        
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_public' => 'boolean',
            'image_url' => 'nullable|image|max:2048',
            'tracks' => 'nullable|array',
            'tracks.*' => 'exists:music,id',
        ]);
        
        // Handle image upload
        if ($request->hasFile('image_url')) {
            // Delete old image if it exists
            if ($playlist->image_url) {
                Storage::disk('public')->delete($playlist->image_url);
            }
            
            $image_url = $request->file('image_url')->store('playlist_images', 'public');
            $playlist->image_url = $image_url;
        }
        
        // Update playlist details
        $playlist->name = $request->name;
        $playlist->description = $request->description;
        $playlist->is_public = $request->boolean('is_public', true);
        $playlist->save();
        
        // Update tracks
        if ($request->has('tracks')) {
            // Detach all existing tracks
            $playlist->tracks()->detach();
            
            // Attach new tracks with positions
            $position = 0;
            foreach ($request->tracks as $trackId) {
                $playlist->tracks()->attach($trackId, ['position' => $position]);
                $position++;
            }
        }
        
        return redirect()->route('playlists.show', $playlist->id)->with('success', 'Playlist updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $playlist = Playlist::findOrFail($id);
        
        // Check if user has permission to delete this playlist
        if ($playlist->user_id !== Auth::id() && Auth::user()->role !== 'admin') {
            abort(403, 'You do not have permission to delete this playlist.');
        }
        
        // Delete the playlist image if it exists
        if ($playlist->image_url) {
            Storage::disk('public')->delete($playlist->image_url);
        }
        
        // Delete the playlist
        $playlist->delete();
        
        return redirect()->route('playlists.index')->with('success', 'Playlist deleted successfully.');
    }
    
    /**
     * Toggle the public status of the playlist.
     */
    public function togglePublic(Request $request, string $id)
    {
        $request->validate([
            'is_public' => 'required|boolean',
        ]);
    
        $playlist = Playlist::findOrFail($id);
        
        // Check if user has permission to update this playlist
        if ($playlist->user_id !== Auth::id() && Auth::user()->role !== 'admin') {
            abort(403, 'You do not have permission to update this playlist.');
        }
        
        $playlist->is_public = $request->boolean('is_public');
        $playlist->save();
    
        return back()->with('message', 'Playlist visibility updated.');
    }
}
