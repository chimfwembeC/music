<?php

namespace App\Http\Controllers;

use App\Models\Album;
use App\Models\Artist;
use App\Models\Genre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use ZipArchive;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Str;

class AlbumController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $albums = Album::with(['artist', 'genre'])->get(); // Fetch album with related artist and genre
        return Inertia::render('Album/Index', [
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
        return Inertia::render('Album/Create', [
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
            // 'file_url' => 'required|file|mimes:mp3,wav,ogg|max:10240', // 10MB limit for music files
            'image_url' => 'nullable|image|max:2048', // 2MB limit for image files    
            'is_published' => 'sometimes|boolean',
            'is_featured' => 'sometimes|boolean',
        ]);

        // Handle file uploads
        $file = $request->file('file_url');
        // $file_url = $file->store('public/album');  // Store the file in the public/album directory
        // $original_filename = $file->getClientOriginalName(); // Get the original filename
        $image_url = $request->hasFile('image_url') ? $request->file('image_url')->store('images','public') : null;
        $isPublished = $request->boolean('is_published');
        $isFeatured = $request->boolean('is_featured');
        // Store album record, including the original filename
        Album::create([
            'title' => $validated['title'],
            'artist_id' => $validated['artist_id'],
            'genre_id' => $validated['genre_id'],
            // 'file_url' => $file_url,
            // 'original_filename' => $original_filename,  // Store the original filename here
            'image_url' => $image_url,
            'is_published' => $isPublished,
            'is_featured' => $isFeatured,            
        ]);

        return redirect()->route('albums.index')->with('success', 'Album created successfully.');
    }


    public function togglePublish(Request $request, $id)
    {
        $request->validate([
            'is_published' => 'required|boolean',
        ]);
    
        $album = Album::findOrFail($id);
        $album->is_published = $request->boolean('is_published');
        $album->save();
    
        return back()->with('message', 'Track publish status updated.');
    }
    
    public function toggleFeatured(Request $request, $id)
    {
        $request->validate([
            'is_featured' => 'required|boolean',
        ]);
    
        $album = Album::findOrFail($id);
        $album->is_featured = $request->boolean('is_featured');
        $album->save();
    
        return back()->with('message', 'Track featured status updated.');
    }
    /**
     * Display the specified resource.
     */
    public function show(Album $album)
    {
        return Inertia::render('Album/Show', [
            'album' => $album->load(['artist', 'genre', 'music']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($slug)
    {
        $album = Album::where('slug', $slug)->firstOrFail();
        $artists = Artist::all();
        $genres = Genre::all();
        return Inertia::render('Album/Edit', [
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
            // 'file_url' => 'nullable|file|mimes:mp3,wav,ogg|max:10240',
            'image_url' => 'nullable|image|max:2048',            
            'is_published' => 'sometimes|boolean',
            'is_featured' => 'sometimes|boolean',
        ]);

        // Handle file uploads if provided
        // if ($request->hasFile('file_url')) {
        //     // Delete old file if a new one is uploaded
        //     // Storage::delete($album->file_url);
        //     // $file = $request->file('file_url');
        //     // $file_url = $file->store('public/album');
        //     // $original_filename = $file->getClientOriginalName(); // Get the original filename
        // } else {
        //     // $file_url = $album->file_url;
        //     // $original_filename = $album->original_filename; // Retain the original filename if no new file is uploaded
        // }

        if ($request->hasFile('image_url')) {
            // Delete old image if a new one is uploaded
            Storage::delete($album->image_url);
            $image_url = $request->file('image_url')->store('images','public');
        } else {
            $image_url = $album->image_url;
        }
        $isPublished = $request->boolean('is_published');
        $isFeatured = $request->boolean('is_featured');

        // Update the album record
        $album->update([
            'title' => $validated['title'],
            'artist_id' => $validated['artist_id'],
            'genre_id' => $validated['genre_id'],
            'is_published' => $isPublished,
            'is_featured' => $isFeatured,
            // 'file_url' => $file_url,
            // 'original_filename' => $original_filename, // Store the original filename
            'image_url' => $image_url,            
        ]);

        return redirect()->route('albums.index')->with('success', 'Album updated successfully.');
    }

    public function downloadAlbum($id)
    {
        try {
            // Load the album and its associated music files.
            $album = Album::with('music')->findOrFail($id);

            // Generate a clean slug from the album title (or use the stored slug if available).
            $albumSlug = $album->slug ?? \Illuminate\Support\Str::slug($album->title);

            // Correct the album folder path to match the actual storage location.
            $albumFolder = public_path("storage/uploads/albums/{$album->slug}");

            // Debugging step: Check if the folder exists.
            if (!is_dir($albumFolder)) {
                return response()->json([
                    'message' => 'Album folder does not exist.',
                    'folder_path' => $albumFolder
                ], 404);
            }

            // Define the temporary ZIP filename.
            $zipFileName = storage_path("app/{$albumSlug}.zip");

            // Create a new ZipArchive instance.
            $zip = new \ZipArchive;
            if ($zip->open($zipFileName, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) === true) {
                // Use RecursiveDirectoryIterator to iterate over the folder.
                $files = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($albumFolder));

                foreach ($files as $file) {
                    // Skip directories.
                    if (!$file->isDir()) {
                        $filePath = $file->getRealPath();

                        // Get relative file path from the album folder to use inside the ZIP.
                        $relativePath = $albumSlug . '/' . substr($filePath, strlen($albumFolder) + 1);

                        // Add file to the zip archive.
                        $zip->addFile($filePath, $relativePath);
                    }
                }

                // Close the zip archive.
                $zip->close();
            } else {
                return response()->json(['message' => 'Failed to create ZIP archive'], 500);
            }

            // Return the ZIP file as a download response.
            return response()->download($zipFileName)->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred: ' . $e->getMessage()], 500);
        }
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
