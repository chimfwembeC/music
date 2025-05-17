<?php

namespace App\Http\Controllers\Api;

use App\Models\Album;
use App\Models\Favorite;
use App\Models\UserActivity;
use App\Enums\ActivityType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use ZipArchive;
use Illuminate\Support\Facades\File;

class AlbumController extends ApiController
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = Album::with(['artist', 'genre']);

        // Filter by published status
        if ($request->has('published')) {
            $query->where('is_published', $request->boolean('published'));
        } else {
            $query->where('is_published', true);
        }

        // Filter by artist
        if ($request->has('artist_id')) {
            $query->where('artist_id', $request->artist_id);
        }

        // Filter by genre
        if ($request->has('genre_id')) {
            $query->where('genre_id', $request->genre_id);
        }

        // Search by title
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Sort by field
        $sortField = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Paginate the results
        $perPage = $request->input('per_page', 15);
        $albums = $query->paginate($perPage);

        return $this->success($albums);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'artist_id' => 'required|exists:artists,id',
            'genre_id' => 'required|exists:genres,id',
            'image' => 'nullable|image|max:2048',
            'is_published' => 'boolean',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation error', 422, $validator->errors());
        }

        // Handle image upload
        $image_url = null;
        if ($request->hasFile('image')) {
            $image_url = $request->file('image')->store('album_images', 'public');
        }

        $album = Album::create([
            'title' => $request->title,
            'artist_id' => $request->artist_id,
            'genre_id' => $request->genre_id,
            'image_url' => $image_url,
            'is_published' => $request->boolean('is_published', false),
            'download_counts' => 0,
        ]);

        return $this->success($album, 'Album created successfully', 201);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $album = Album::with(['artist', 'genre', 'tracks'])->findOrFail($id);
        return $this->success($album);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $album = Album::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'artist_id' => 'sometimes|exists:artists,id',
            'genre_id' => 'sometimes|exists:genres,id',
            'image' => 'nullable|image|max:2048',
            'is_published' => 'boolean',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation error', 422, $validator->errors());
        }

        // Handle image upload if provided
        if ($request->hasFile('image')) {
            // Delete old image if it exists
            if ($album->image_url) {
                Storage::disk('public')->delete($album->image_url);
            }

            $image_url = $request->file('image')->store('album_images', 'public');
            $album->image_url = $image_url;
        }

        // Update other fields if provided
        if ($request->has('title')) $album->title = $request->title;
        if ($request->has('artist_id')) $album->artist_id = $request->artist_id;
        if ($request->has('genre_id')) $album->genre_id = $request->genre_id;
        if ($request->has('is_published')) $album->is_published = $request->boolean('is_published');

        $album->save();

        return $this->success($album, 'Album updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $album = Album::findOrFail($id);

        // Delete associated image
        if ($album->image_url) {
            Storage::disk('public')->delete($album->image_url);
        }

        $album->delete();

        return $this->success(null, 'Album deleted successfully');
    }

    /**
     * Toggle the published status of the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function togglePublish($id)
    {
        $album = Album::findOrFail($id);
        $album->is_published = !$album->is_published;
        $album->save();

        return $this->success($album, 'Published status toggled successfully');
    }

    /**
     * Download all tracks in the album as a zip file.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function download(Request $request, $id)
    {
        $album = Album::with('tracks')->findOrFail($id);

        // Increment download count
        $album->download_counts += 1;
        $album->save();

        // Log the download activity if user is authenticated
        if ($request->user()) {
            UserActivity::create([
                'user_id' => $request->user()->id,
                'activity_name' => ActivityType::DOWNLOAD->value,
                'activity_id' => $album->id,
                'activity_type' => Album::class,
            ]);
        }

        // Create a temporary zip file
        $zipFileName = 'album_' . $album->id . '_' . time() . '.zip';
        $zipFilePath = storage_path('app/public/temp/' . $zipFileName);

        // Ensure the temp directory exists
        if (!File::exists(storage_path('app/public/temp'))) {
            File::makeDirectory(storage_path('app/public/temp'), 0755, true);
        }

        $zip = new ZipArchive();
        if ($zip->open($zipFilePath, ZipArchive::CREATE) === TRUE) {
            foreach ($album->tracks as $track) {
                $filePath = storage_path('app/public/' . $track->file_url);
                if (File::exists($filePath)) {
                    $zip->addFile($filePath, $track->original_filename ?? basename($track->file_url));
                }
            }
            $zip->close();
        } else {
            return $this->error('Could not create zip file', 500);
        }

        // Return the download URL
        $downloadUrl = url('storage/temp/' . $zipFileName);

        return $this->success([
            'download_url' => $downloadUrl,
            'download_counts' => $album->download_counts,
        ], 'Download count incremented successfully');
    }

    /**
     * Add or remove the specified resource from the user's favorites.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleFavorite(Request $request, $id)
    {
        $album = Album::findOrFail($id);
        $user = $request->user();

        $favorite = Favorite::where([
            'user_id' => $user->id,
            'favorable_id' => $album->id,
            'favorable_type' => Album::class,
        ])->first();

        if ($favorite) {
            $favorite->delete();
            $message = 'Album removed from favorites';
            $isFavorite = false;
        } else {
            Favorite::create([
                'user_id' => $user->id,
                'favorable_id' => $album->id,
                'favorable_type' => Album::class,
            ]);

            // Log the favorite activity
            UserActivity::create([
                'user_id' => $user->id,
                'activity_name' => ActivityType::FAVORITE->value,
                'activity_id' => $album->id,
                'activity_type' => Album::class,
            ]);

            $message = 'Album added to favorites';
            $isFavorite = true;
        }

        return $this->success([
            'is_favorite' => $isFavorite,
        ], $message);
    }
}
