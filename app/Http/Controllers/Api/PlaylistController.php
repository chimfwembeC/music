<?php

namespace App\Http\Controllers\Api;

use App\Models\Playlist;
use App\Models\Music;
use App\Models\UserActivity;
use App\Enums\ActivityType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use ZipArchive;
use Illuminate\Support\Facades\File;

class PlaylistController extends ApiController
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Playlist::with('user');

        // If not admin, only show public playlists or user's own playlists
        if (!$user->isAdmin()) {
            $query->where(function($q) use ($user) {
                $q->where('is_public', true)
                  ->orWhere('user_id', $user->id);
            });
        }

        // Search by name
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Filter by user
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Sort by field
        $sortField = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Paginate the results
        $perPage = $request->input('per_page', 15);
        $playlists = $query->paginate($perPage);

        return $this->success($playlists);
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
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_public' => 'boolean',
            'image' => 'nullable|image|max:2048',
            'tracks' => 'nullable|array',
            'tracks.*' => 'exists:music,id',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation error', 422, $validator->errors());
        }

        // Handle image upload
        $image_url = null;
        if ($request->hasFile('image')) {
            $image_url = $request->file('image')->store('playlist_images', 'public');
        }

        $playlist = Playlist::create([
            'name' => $request->name,
            'description' => $request->description,
            'user_id' => $request->user()->id,
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

        // Log the playlist creation activity
        UserActivity::create([
            'user_id' => $request->user()->id,
            'activity_name' => ActivityType::PLAYLIST_CREATE->value,
            'activity_id' => $playlist->id,
            'activity_type' => Playlist::class,
        ]);

        return $this->success($playlist, 'Playlist created successfully', 201);
    }

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, $id)
    {
        $playlist = Playlist::with(['user', 'tracks.artist', 'tracks.genre'])->findOrFail($id);

        // Check if user has permission to view this playlist
        if (!$playlist->is_public && $playlist->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return $this->error('You do not have permission to view this playlist', 403);
        }

        return $this->success($playlist);
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
        $playlist = Playlist::findOrFail($id);

        // Check if user has permission to update this playlist
        if ($playlist->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return $this->error('You do not have permission to update this playlist', 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'is_public' => 'boolean',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation error', 422, $validator->errors());
        }

        // Handle image upload if provided
        if ($request->hasFile('image')) {
            // Delete old image if it exists
            if ($playlist->image_url) {
                Storage::disk('public')->delete($playlist->image_url);
            }

            $image_url = $request->file('image')->store('playlist_images', 'public');
            $playlist->image_url = $image_url;
        }

        // Update other fields if provided
        if ($request->has('name')) $playlist->name = $request->name;
        if ($request->has('description')) $playlist->description = $request->description;
        if ($request->has('is_public')) $playlist->is_public = $request->boolean('is_public');

        $playlist->save();

        return $this->success($playlist, 'Playlist updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, $id)
    {
        $playlist = Playlist::findOrFail($id);

        // Check if user has permission to delete this playlist
        if ($playlist->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return $this->error('You do not have permission to delete this playlist', 403);
        }

        // Delete associated image
        if ($playlist->image_url) {
            Storage::disk('public')->delete($playlist->image_url);
        }

        $playlist->delete();

        return $this->success(null, 'Playlist deleted successfully');
    }

    /**
     * Add a track to the playlist.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function addTrack(Request $request, $id)
    {
        $playlist = Playlist::findOrFail($id);

        // Check if user has permission to update this playlist
        if ($playlist->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return $this->error('You do not have permission to update this playlist', 403);
        }

        $validator = Validator::make($request->all(), [
            'track_id' => 'required|exists:music,id',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation error', 422, $validator->errors());
        }

        // Check if track is already in playlist
        if ($playlist->tracks()->where('music_id', $request->track_id)->exists()) {
            return $this->error('Track is already in playlist', 422);
        }

        // Get the highest position
        $maxPosition = $playlist->tracks()->max('position') ?? -1;

        // Add track to playlist
        $playlist->tracks()->attach($request->track_id, ['position' => $maxPosition + 1]);

        // Log the activity
        UserActivity::create([
            'user_id' => $request->user()->id,
            'activity_name' => ActivityType::PLAYLIST_ADD->value,
            'activity_id' => $playlist->id,
            'activity_type' => Playlist::class,
            'metadata' => ['track_id' => $request->track_id],
        ]);

        return $this->success(null, 'Track added to playlist successfully');
    }

    /**
     * Remove a track from the playlist.
     *
     * @param Request $request
     * @param int $id
     * @param int $trackId
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeTrack(Request $request, $id, $trackId)
    {
        $playlist = Playlist::findOrFail($id);

        // Check if user has permission to update this playlist
        if ($playlist->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return $this->error('You do not have permission to update this playlist', 403);
        }

        // Remove track from playlist
        $playlist->tracks()->detach($trackId);

        // Reorder positions
        $tracks = $playlist->tracks()->orderBy('position')->get();
        foreach ($tracks as $index => $track) {
            $playlist->tracks()->updateExistingPivot($track->id, ['position' => $index]);
        }

        return $this->success(null, 'Track removed from playlist successfully');
    }

    /**
     * Reorder tracks in the playlist.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function reorderTracks(Request $request, $id)
    {
        $playlist = Playlist::findOrFail($id);

        // Check if user has permission to update this playlist
        if ($playlist->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return $this->error('You do not have permission to update this playlist', 403);
        }

        $validator = Validator::make($request->all(), [
            'tracks' => 'required|array',
            'tracks.*' => 'exists:music,id',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation error', 422, $validator->errors());
        }

        // Detach all tracks
        $playlist->tracks()->detach();

        // Attach tracks with new positions
        foreach ($request->tracks as $index => $trackId) {
            $playlist->tracks()->attach($trackId, ['position' => $index]);
        }

        return $this->success(null, 'Playlist tracks reordered successfully');
    }

    /**
     * Download all tracks in the playlist as a zip file.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function download(Request $request, $id)
    {
        $playlist = Playlist::with('tracks')->findOrFail($id);

        // Check if user has permission to download this playlist
        if (!$playlist->is_public && $playlist->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return $this->error('You do not have permission to download this playlist', 403);
        }

        // Create a temporary zip file
        $zipFileName = 'playlist_' . $playlist->id . '_' . time() . '.zip';
        $zipFilePath = storage_path('app/public/temp/' . $zipFileName);

        // Ensure the temp directory exists
        if (!File::exists(storage_path('app/public/temp'))) {
            File::makeDirectory(storage_path('app/public/temp'), 0755, true);
        }

        $zip = new ZipArchive();
        if ($zip->open($zipFilePath, ZipArchive::CREATE) === TRUE) {
            foreach ($playlist->tracks as $track) {
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
        ], 'Playlist download URL generated successfully');
    }
}
