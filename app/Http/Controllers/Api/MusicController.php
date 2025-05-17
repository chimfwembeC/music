<?php

namespace App\Http\Controllers\Api;

use App\Models\Music;
use App\Models\Favorite;
use App\Models\UserActivity;
use App\Enums\ActivityType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class MusicController extends ApiController
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = Music::with(['artist', 'genre', 'album']);

        // Filter by published status
        if ($request->has('published')) {
            $query->where('is_published', $request->boolean('published'));
        } else {
            $query->where('is_published', true);
        }

        // Filter by featured status
        if ($request->has('featured')) {
            $query->where('is_featured', $request->boolean('featured'));
        }

        // Filter by artist
        if ($request->has('artist_id')) {
            $query->where('artist_id', $request->artist_id);
        }

        // Filter by genre
        if ($request->has('genre_id')) {
            $query->where('genre_id', $request->genre_id);
        }

        // Filter by album
        if ($request->has('album_id')) {
            $query->where('album_id', $request->album_id);
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
        $music = $query->paginate($perPage);

        return $this->success($music);
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
            'album_id' => 'nullable|exists:albums,id',
            'file' => 'required|file|mimes:mp3,wav,ogg|max:20000',
            'image' => 'nullable|image|max:2048',
            'duration' => 'required|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation error', 422, $validator->errors());
        }

        // Handle file uploads
        $file_url = $request->file('file')->store('music_files', 'public');
        $original_filename = $request->file('file')->getClientOriginalName();

        $image_url = null;
        if ($request->hasFile('image')) {
            $image_url = $request->file('image')->store('music_images', 'public');
        }

        $music = Music::create([
            'title' => $request->title,
            'artist_id' => $request->artist_id,
            'genre_id' => $request->genre_id,
            'album_id' => $request->album_id,
            'file_url' => $file_url,
            'image_url' => $image_url,
            'duration' => $request->duration,
            'original_filename' => $original_filename,
            'is_published' => $request->boolean('is_published', false),
            'is_featured' => $request->boolean('is_featured', false),
            'download_counts' => 0,
            'share_count' => 0,
        ]);

        return $this->success($music, 'Music track created successfully', 201);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $music = Music::with(['artist', 'genre', 'album'])->findOrFail($id);
        return $this->success($music);
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
        $music = Music::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'artist_id' => 'sometimes|exists:artists,id',
            'genre_id' => 'sometimes|exists:genres,id',
            'album_id' => 'nullable|exists:albums,id',
            'file' => 'nullable|file|mimes:mp3,wav,ogg|max:20000',
            'image' => 'nullable|image|max:2048',
            'duration' => 'sometimes|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation error', 422, $validator->errors());
        }

        // Handle file uploads if provided
        if ($request->hasFile('file')) {
            // Delete old file if it exists
            if ($music->file_url) {
                Storage::disk('public')->delete($music->file_url);
            }

            $file_url = $request->file('file')->store('music_files', 'public');
            $original_filename = $request->file('file')->getClientOriginalName();

            $music->file_url = $file_url;
            $music->original_filename = $original_filename;
        }

        if ($request->hasFile('image')) {
            // Delete old image if it exists
            if ($music->image_url) {
                Storage::disk('public')->delete($music->image_url);
            }

            $image_url = $request->file('image')->store('music_images', 'public');
            $music->image_url = $image_url;
        }

        // Update other fields if provided
        if ($request->has('title')) $music->title = $request->title;
        if ($request->has('artist_id')) $music->artist_id = $request->artist_id;
        if ($request->has('genre_id')) $music->genre_id = $request->genre_id;
        if ($request->has('album_id')) $music->album_id = $request->album_id;
        if ($request->has('duration')) $music->duration = $request->duration;
        if ($request->has('is_published')) $music->is_published = $request->boolean('is_published');
        if ($request->has('is_featured')) $music->is_featured = $request->boolean('is_featured');

        $music->save();

        return $this->success($music, 'Music track updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $music = Music::findOrFail($id);

        // Delete associated files
        if ($music->file_url) {
            Storage::disk('public')->delete($music->file_url);
        }

        if ($music->image_url) {
            Storage::disk('public')->delete($music->image_url);
        }

        $music->delete();

        return $this->success(null, 'Music track deleted successfully');
    }

    /**
     * Toggle the published status of the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function togglePublish($id)
    {
        $music = Music::findOrFail($id);
        $music->is_published = !$music->is_published;
        $music->save();

        return $this->success($music, 'Published status toggled successfully');
    }

    /**
     * Toggle the featured status of the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleFeatured($id)
    {
        $music = Music::findOrFail($id);
        $music->is_featured = !$music->is_featured;
        $music->save();

        return $this->success($music, 'Featured status toggled successfully');
    }

    /**
     * Increment the download count for the specified resource.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function download(Request $request, $id)
    {
        $music = Music::findOrFail($id);
        $music->download_counts += 1;
        $music->save();

        // Log the download activity if user is authenticated
        if ($request->user()) {
            UserActivity::create([
                'user_id' => $request->user()->id,
                'activity_name' => ActivityType::DOWNLOAD->value,
                'activity_id' => $music->id,
                'activity_type' => Music::class,
            ]);
        }

        return $this->success([
            'download_url' => Storage::disk('public')->url($music->file_url),
            'download_counts' => $music->download_counts,
        ], 'Download count incremented successfully');
    }

    /**
     * Increment the share count for the specified resource.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function share(Request $request, $id)
    {
        $music = Music::findOrFail($id);
        $music->share_count += 1;
        $music->save();

        // Log the share activity if user is authenticated
        if ($request->user()) {
            UserActivity::create([
                'user_id' => $request->user()->id,
                'activity_name' => ActivityType::SHARE->value,
                'activity_id' => $music->id,
                'activity_type' => Music::class,
            ]);
        }

        return $this->success([
            'share_count' => $music->share_count,
        ], 'Share count incremented successfully');
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
        $music = Music::findOrFail($id);
        $user = $request->user();

        $favorite = Favorite::where([
            'user_id' => $user->id,
            'favorable_id' => $music->id,
            'favorable_type' => Music::class,
        ])->first();

        if ($favorite) {
            $favorite->delete();
            $message = 'Music removed from favorites';
            $isFavorite = false;
        } else {
            Favorite::create([
                'user_id' => $user->id,
                'favorable_id' => $music->id,
                'favorable_type' => Music::class,
            ]);

            // Log the favorite activity
            UserActivity::create([
                'user_id' => $user->id,
                'activity_name' => ActivityType::FAVORITE->value,
                'activity_id' => $music->id,
                'activity_type' => Music::class,
            ]);

            $message = 'Music added to favorites';
            $isFavorite = true;
        }

        return $this->success([
            'is_favorite' => $isFavorite,
        ], $message);
    }
}
