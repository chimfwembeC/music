<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MusicController;
use App\Http\Controllers\Api\ArtistController;
use App\Http\Controllers\Api\AlbumController;
use App\Http\Controllers\Api\PlaylistController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\ApiController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Legacy route - keeping for backward compatibility
Route::get('/get-blogs', [ApiController::class, 'getLatestBlogs'])
    ->name('api.blogs.index');

// Public routes
Route::prefix('v1')->group(function () {
    // Authentication
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Public music endpoints
    Route::get('/tracks', [MusicController::class, 'index']);
    Route::get('/tracks/{id}', [MusicController::class, 'show']);

    // Public artist endpoints
    Route::get('/artists', [ArtistController::class, 'index']);
    Route::get('/artists/{id}', [ArtistController::class, 'show']);
    Route::get('/artists/{id}/music', [ArtistController::class, 'music']);
    Route::get('/artists/{id}/albums', [ArtistController::class, 'albums']);

    // Public album endpoints
    Route::get('/albums', [AlbumController::class, 'index']);
    Route::get('/albums/{id}', [AlbumController::class, 'show']);

    // Public user profiles
    Route::get('/users/{id}', [UserController::class, 'show']);
});

// Protected routes
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    // User authentication
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // User profile
    Route::get('/profile', [UserController::class, 'profile']);
    Route::put('/profile', [UserController::class, 'updateProfile']);
    Route::put('/password', [UserController::class, 'updatePassword']);
    Route::get('/profile/playlists', [UserController::class, 'playlists']);
    Route::get('/profile/favorites', [UserController::class, 'favorites']);
    Route::get('/profile/activities', [UserController::class, 'activities']);

    // Role-specific Dashboards
    Route::get('/listener-dashboard', [App\Http\Controllers\Api\ListenerDashboardController::class, 'index'])
        ->middleware('role:listener');

    Route::get('/artist-dashboard', [App\Http\Controllers\Api\ArtistDashboardController::class, 'index'])
        ->middleware('role:artist');

    Route::get('/admin-dashboard', [App\Http\Controllers\Api\AdminDashboardController::class, 'index'])
        ->middleware('role:admin');

    // Music endpoints
    Route::post('/tracks', [MusicController::class, 'store']);
    Route::put('/tracks/{id}', [MusicController::class, 'update']);
    Route::delete('/tracks/{id}', [MusicController::class, 'destroy']);
    Route::patch('/tracks/{id}/publish', [MusicController::class, 'togglePublish']);
    Route::patch('/tracks/{id}/feature', [MusicController::class, 'toggleFeatured']);
    Route::post('/tracks/{id}/download', [MusicController::class, 'download']);
    Route::post('/tracks/{id}/share', [MusicController::class, 'share']);
    Route::post('/tracks/{id}/favorite', [MusicController::class, 'toggleFavorite']);

    // Track interactions
    Route::post('/tracks/{id}/view', [App\Http\Controllers\Api\TrackInteractionController::class, 'recordView']);
    Route::put('/tracks/{id}/view-duration', [App\Http\Controllers\Api\TrackInteractionController::class, 'updateViewDuration']);
    Route::post('/tracks/{id}/like', [App\Http\Controllers\Api\TrackInteractionController::class, 'toggleLike']);
    Route::get('/tracks/{id}/like', [App\Http\Controllers\Api\TrackInteractionController::class, 'checkLike']);
    Route::get('/tracks/{id}/stats', [App\Http\Controllers\Api\TrackInteractionController::class, 'getStats']);

    // Artist endpoints
    Route::post('/artists', [ArtistController::class, 'store']);
    Route::put('/artists/{id}', [ArtistController::class, 'update']);
    Route::delete('/artists/{id}', [ArtistController::class, 'destroy']);
    Route::post('/artists/{id}/favorite', [ArtistController::class, 'toggleFavorite']);

    // Artist followers
    Route::post('/artists/{id}/follow', [App\Http\Controllers\Api\ArtistFollowerController::class, 'toggleFollow']);
    Route::get('/artists/{id}/follow', [App\Http\Controllers\Api\ArtistFollowerController::class, 'checkFollow']);
    Route::post('/artists/{id}/notifications', [App\Http\Controllers\Api\ArtistFollowerController::class, 'toggleNotifications']);
    Route::get('/artists/{id}/followers', [App\Http\Controllers\Api\ArtistFollowerController::class, 'getFollowers']);
    Route::get('/followed-artists', [App\Http\Controllers\Api\ArtistFollowerController::class, 'getFollowedArtists']);

    // Album endpoints
    Route::post('/albums', [AlbumController::class, 'store']);
    Route::put('/albums/{id}', [AlbumController::class, 'update']);
    Route::delete('/albums/{id}', [AlbumController::class, 'destroy']);
    Route::patch('/albums/{id}/publish', [AlbumController::class, 'togglePublish']);
    Route::post('/albums/{id}/download', [AlbumController::class, 'download']);
    Route::post('/albums/{id}/favorite', [AlbumController::class, 'toggleFavorite']);

    // Playlist endpoints
    Route::get('/playlists', [PlaylistController::class, 'index']);
    Route::post('/playlists', [PlaylistController::class, 'store']);
    Route::get('/playlists/{id}', [PlaylistController::class, 'show']);
    Route::put('/playlists/{id}', [PlaylistController::class, 'update']);
    Route::delete('/playlists/{id}', [PlaylistController::class, 'destroy']);
    Route::post('/playlists/{id}/tracks', [PlaylistController::class, 'addTrack']);
    Route::delete('/playlists/{id}/tracks/{trackId}', [PlaylistController::class, 'removeTrack']);
    Route::put('/playlists/{id}/tracks/reorder', [PlaylistController::class, 'reorderTracks']);
    Route::get('/playlists/{id}/download', [PlaylistController::class, 'download']);

    // Favorites endpoints
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites', [FavoriteController::class, 'destroy']);
    Route::get('/favorites/check', [FavoriteController::class, 'check']);
});
