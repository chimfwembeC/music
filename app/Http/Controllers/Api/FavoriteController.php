<?php

namespace App\Http\Controllers\Api;

use App\Models\Favorite;
use App\Models\Music;
use App\Models\Album;
use App\Models\Artist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FavoriteController extends ApiController
{
    /**
     * Display a listing of the user's favorites.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get favorites by type
        $type = $request->input('type', 'all');
        
        switch ($type) {
            case 'tracks':
                $favorites = $user->favorites()
                    ->where('favorable_type', Music::class)
                    ->with('favorable.artist', 'favorable.genre')
                    ->paginate(15);
                break;
                
            case 'albums':
                $favorites = $user->favorites()
                    ->where('favorable_type', Album::class)
                    ->with('favorable.artist', 'favorable.genre')
                    ->paginate(15);
                break;
                
            case 'artists':
                $favorites = $user->favorites()
                    ->where('favorable_type', Artist::class)
                    ->with('favorable')
                    ->paginate(15);
                break;
                
            default:
                $favorites = $user->favorites()
                    ->with(['favorable' => function($query) {
                        $query->with('artist', 'genre');
                    }])
                    ->paginate(15);
                break;
        }
        
        return $this->success($favorites);
    }
    
    /**
     * Add an item to favorites.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'favorable_id' => 'required|integer',
            'favorable_type' => 'required|in:music,album,artist',
        ]);
        
        if ($validator->fails()) {
            return $this->error('Validation error', 422, $validator->errors());
        }
        
        $user = $request->user();
        $favorableId = $request->favorable_id;
        $favorableType = null;
        
        // Map the favorable_type to the correct model class
        switch ($request->favorable_type) {
            case 'music':
                $favorableType = Music::class;
                $item = Music::findOrFail($favorableId);
                break;
                
            case 'album':
                $favorableType = Album::class;
                $item = Album::findOrFail($favorableId);
                break;
                
            case 'artist':
                $favorableType = Artist::class;
                $item = Artist::findOrFail($favorableId);
                break;
                
            default:
                return $this->error('Invalid favorable_type', 422);
        }
        
        // Check if already favorited
        $existingFavorite = Favorite::where([
            'user_id' => $user->id,
            'favorable_id' => $favorableId,
            'favorable_type' => $favorableType,
        ])->first();
        
        if ($existingFavorite) {
            return $this->error('Item is already in favorites', 422);
        }
        
        // Create the favorite
        $favorite = Favorite::create([
            'user_id' => $user->id,
            'favorable_id' => $favorableId,
            'favorable_type' => $favorableType,
        ]);
        
        return $this->success($favorite, 'Item added to favorites successfully', 201);
    }
    
    /**
     * Remove an item from favorites.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'favorable_id' => 'required|integer',
            'favorable_type' => 'required|in:music,album,artist',
        ]);
        
        if ($validator->fails()) {
            return $this->error('Validation error', 422, $validator->errors());
        }
        
        $user = $request->user();
        $favorableId = $request->favorable_id;
        $favorableType = null;
        
        // Map the favorable_type to the correct model class
        switch ($request->favorable_type) {
            case 'music':
                $favorableType = Music::class;
                break;
                
            case 'album':
                $favorableType = Album::class;
                break;
                
            case 'artist':
                $favorableType = Artist::class;
                break;
                
            default:
                return $this->error('Invalid favorable_type', 422);
        }
        
        // Find and delete the favorite
        $favorite = Favorite::where([
            'user_id' => $user->id,
            'favorable_id' => $favorableId,
            'favorable_type' => $favorableType,
        ])->first();
        
        if (!$favorite) {
            return $this->error('Item is not in favorites', 404);
        }
        
        $favorite->delete();
        
        return $this->success(null, 'Item removed from favorites successfully');
    }
    
    /**
     * Check if an item is in the user's favorites.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function check(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'favorable_id' => 'required|integer',
            'favorable_type' => 'required|in:music,album,artist',
        ]);
        
        if ($validator->fails()) {
            return $this->error('Validation error', 422, $validator->errors());
        }
        
        $user = $request->user();
        $favorableId = $request->favorable_id;
        $favorableType = null;
        
        // Map the favorable_type to the correct model class
        switch ($request->favorable_type) {
            case 'music':
                $favorableType = Music::class;
                break;
                
            case 'album':
                $favorableType = Album::class;
                break;
                
            case 'artist':
                $favorableType = Artist::class;
                break;
                
            default:
                return $this->error('Invalid favorable_type', 422);
        }
        
        // Check if the item is in favorites
        $isFavorite = Favorite::where([
            'user_id' => $user->id,
            'favorable_id' => $favorableId,
            'favorable_type' => $favorableType,
        ])->exists();
        
        return $this->success([
            'is_favorite' => $isFavorite,
        ]);
    }
}
