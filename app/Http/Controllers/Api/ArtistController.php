<?php

namespace App\Http\Controllers\Api;

use App\Models\Artist;
use App\Models\Favorite;
use App\Models\UserActivity;
use App\Enums\ActivityType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ArtistController extends ApiController
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = Artist::query();

        // Search by name
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Sort by field
        $sortField = $request->input('sort_by', 'name');
        $sortDirection = $request->input('sort_direction', 'asc');
        $query->orderBy($sortField, $sortDirection);

        // Paginate the results
        $perPage = $request->input('per_page', 15);
        $artists = $query->paginate($perPage);

        return $this->success($artists);
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
            'bio' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation error', 422, $validator->errors());
        }

        // Handle image upload
        $image_url = null;
        if ($request->hasFile('image')) {
            $image_url = $request->file('image')->store('artist_images', 'public');
        }

        $artist = Artist::create([
            'name' => $request->name,
            'bio' => $request->bio,
            'image_url' => $image_url,
        ]);

        return $this->success($artist, 'Artist created successfully', 201);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $artist = Artist::with(['music', 'albums'])->findOrFail($id);
        return $this->success($artist);
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
        $artist = Artist::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'bio' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation error', 422, $validator->errors());
        }

        // Handle image upload if provided
        if ($request->hasFile('image')) {
            // Delete old image if it exists
            if ($artist->image_url) {
                Storage::disk('public')->delete($artist->image_url);
            }

            $image_url = $request->file('image')->store('artist_images', 'public');
            $artist->image_url = $image_url;
        }

        // Update other fields if provided
        if ($request->has('name')) $artist->name = $request->name;
        if ($request->has('bio')) $artist->bio = $request->bio;

        $artist->save();

        return $this->success($artist, 'Artist updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $artist = Artist::findOrFail($id);

        // Delete associated image
        if ($artist->image_url) {
            Storage::disk('public')->delete($artist->image_url);
        }

        $artist->delete();

        return $this->success(null, 'Artist deleted successfully');
    }

    /**
     * Get all music tracks by the specified artist.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function music($id)
    {
        $artist = Artist::findOrFail($id);
        $music = $artist->music()->with(['genre', 'album'])->where('is_published', true)->get();

        return $this->success($music);
    }

    /**
     * Get all albums by the specified artist.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function albums($id)
    {
        $artist = Artist::findOrFail($id);
        $albums = $artist->albums()->with('genre')->where('is_published', true)->get();

        return $this->success($albums);
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
        $artist = Artist::findOrFail($id);
        $user = $request->user();

        $favorite = Favorite::where([
            'user_id' => $user->id,
            'favorable_id' => $artist->id,
            'favorable_type' => Artist::class,
        ])->first();

        if ($favorite) {
            $favorite->delete();
            $message = 'Artist removed from favorites';
            $isFavorite = false;
        } else {
            Favorite::create([
                'user_id' => $user->id,
                'favorable_id' => $artist->id,
                'favorable_type' => Artist::class,
            ]);

            // Log the favorite activity
            UserActivity::create([
                'user_id' => $user->id,
                'activity_name' => ActivityType::FAVORITE->value,
                'activity_id' => $artist->id,
                'activity_type' => Artist::class,
            ]);

            $message = 'Artist added to favorites';
            $isFavorite = true;
        }

        return $this->success([
            'is_favorite' => $isFavorite,
        ], $message);
    }
}
