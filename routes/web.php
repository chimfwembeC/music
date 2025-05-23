<?php

use App\Http\Controllers\AlbumController;
use App\Http\Controllers\ArtistController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\MusicController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\PlaylistController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    // Main dashboard route - handles all roles
    Route::get('/dashboard', App\Http\Controllers\DashboardController::class)->name('dashboard');

    // Role-specific dashboard routes - all handled by the same controller
    Route::get('/listener-dashboard', App\Http\Controllers\DashboardController::class)
        ->name('listener.dashboard')
        ->middleware('role:listener');

    // Listener Dashboard specific endpoints
    Route::prefix('listener')->middleware(['auth:sanctum', 'role:listener'])->group(function () {
        Route::get('/recently-played', [App\Http\Controllers\Api\ListenerDashboardController::class, 'getRecentlyPlayedApi'])->name('listener.recently-played');
        Route::post('/recently-played', [App\Http\Controllers\Api\ListenerDashboardController::class, 'updateRecentlyPlayed'])->name('listener.update-recently-played');
        Route::get('/most-played', [App\Http\Controllers\Api\ListenerDashboardController::class, 'getMostPlayedApi'])->name('listener.most-played');
        Route::get('/favorites', [App\Http\Controllers\Api\ListenerDashboardController::class, 'getFavoriteTracksApi'])->name('listener.favorites');
        Route::get('/followed-artists', [App\Http\Controllers\Api\ListenerDashboardController::class, 'getFollowedArtistsApi'])->name('listener.followed-artists');
        Route::get('/playlists', [App\Http\Controllers\Api\ListenerDashboardController::class, 'getUserPlaylistsApi'])->name('listener.playlists');
        Route::get('/activity', [App\Http\Controllers\Api\ListenerDashboardController::class, 'getListeningActivityApi'])->name('listener.activity');
        Route::get('/recommendations', [App\Http\Controllers\Api\ListenerDashboardController::class, 'getRecommendedTracksApi'])->name('listener.recommendations');
        Route::get('/stats', [App\Http\Controllers\Api\ListenerDashboardController::class, 'getListeningStatsApi'])->name('listener.stats');

        // Add fallback route to handle any API errors
        Route::fallback(function () {
            return response()->json([
                'success' => false,
                'message' => 'API endpoint not found',
                'data' => []
            ], 404);
        });
    });

    Route::get('/artist-dashboard', App\Http\Controllers\DashboardController::class)
        ->name('artist.dashboard')
        ->middleware('role:artist');

    Route::get('/admin-dashboard', App\Http\Controllers\DashboardController::class)
        ->name('admin.dashboard')
        ->middleware('role:admin');


    // African Theme Demo Page
    Route::get('/african-theme-demo', function () {
        return Inertia::render('AfricanThemeDemo');
    })->name('african-theme-demo');

    // Pattern Customizer Demo Page
    Route::get('/pattern-customizer-demo', function () {
        return Inertia::render('PatternCustomizerDemo');
    })->name('pattern-customizer-demo');

    // Advanced Pattern Customizer Page
    Route::get('/pattern-customizer', function () {
        return Inertia::render('PatternCustomizer');
    })->name('pattern-customizer');
});

// Resource routes for ArtistController
Route::resource('artists', ArtistController::class);

// Resource routes for AlbumController
Route::resource('albums', AlbumController::class);
Route::patch('/albums/{id}/toggle-publish', [AlbumController::class, 'togglePublish'])->name('albums.toggle-publish');
Route::patch('/albums/{id}/toggle-featured', [AlbumController::class, 'toggleFeatured'])->name('albums.toggle-featured');

// Resource routes for GenreController
Route::resource('genres', GenreController::class);

// Resource routes for BlogController
Route::resource('blogs', BlogController::class);
Route::patch('/blogs/{id}/toggle-publish', [BlogController::class, 'togglePublish'])->name('blogs.toggle-publish');

// Resource routes for MusicController
Route::resource('tracks', MusicController::class);
Route::patch('/tracks/{id}/toggle-publish', [MusicController::class, 'togglePublish'])->name('tracks.toggle-publish');
Route::patch('/tracks/{id}/toggle-featured', [MusicController::class, 'toggleFeatured'])->name('tracks.toggle-featured');

// Resource routes for PlaylistController
Route::resource('playlists', PlaylistController::class);
Route::patch('/playlists/{id}/toggle-public', [PlaylistController::class, 'togglePublic'])->name('playlists.toggle-public');

// Resource routes for UserController (admin only)
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::resource('users', UserController::class);
    Route::patch('/users/{id}/toggle-active', [UserController::class, 'toggleActive'])->name('users.toggle-active');
});


Route::get('/music', [PageController::class, 'music'])->name('music');
Route::get('/gists', [PageController::class, 'blogs'])->name('gists');
// Route::get('/artists', [PageController::class, 'artists'])->name('artists');
Route::get('/contact', [PageController::class, 'contact'])->name('contact');
Route::get('/about', [PageController::class, 'about'])->name('about');


Route::get('/search', [SearchController::class, 'search'])->name('search');
// Route::get('/search/{type}/{id}', [SearchController::class, 'searchType'])->name('searchType');
Route::get('/search/suggestions', [SearchController::class, 'suggestions'])->name('search.suggestions');
Route::get('/search/recent', [SearchController::class, 'getRecentSearches'])->name('search.recent');


// download links
Route::post('/music/{id}/download', [MusicController::class, 'trackDownload']);
Route::post('/music/{id}/share', [MusicController::class, 'trackShare']);
Route::get('/albums/{id}/download', [AlbumController::class, 'downloadAlbum']);

// Track interactions for web
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/tracks/{id}/view', [App\Http\Controllers\Api\TrackInteractionController::class, 'recordView'])->name('tracks.view');
    Route::put('/tracks/{id}/view-duration', [App\Http\Controllers\Api\TrackInteractionController::class, 'updateViewDuration'])->name('tracks.view-duration');
    Route::post('/tracks/{id}/like', [App\Http\Controllers\Api\TrackInteractionController::class, 'toggleLike'])->name('tracks.like');
    Route::get('/tracks/{id}/like', [App\Http\Controllers\Api\TrackInteractionController::class, 'checkLike'])->name('tracks.check-like');
    Route::get('/tracks/{id}/stats', [App\Http\Controllers\Api\TrackInteractionController::class, 'getStats'])->name('tracks.stats');
    Route::post('/tracks/{id}/favorite', [MusicController::class, 'toggleFavorite'])->name('tracks.favorite');
});



Route::post('/blogs/{id}/react', [\App\Http\Controllers\ReactionController::class, 'react'])
->name('blogs.react');


Route::middleware('auth:sanctum')->group(function () {
    // Create comment or reply
    Route::post('/blogs/{blog}/comments', [CommentController::class, 'store']);

    // Edit or delete a comment or reply
    Route::put('/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);
});

Route::get('/get_blogs', [BlogController::class, 'getBlogs']);
// Public routes
Route::get('/blogs/{blog}/comments', [CommentController::class, 'index']); // Top-level comments
Route::get('/comments/{comment}/replies', [CommentController::class, 'replies']); // Replies to a comment
Route::post('/comments/{comment}/reply', [CommentController::class, 'reply']);

// Authenticated routes for users to perform actions on replies
Route::middleware('auth:sanctum')->group(function () {
    // Route to store a new reply to a comment
    Route::post('/comments/{id}/reply', [CommentController::class, 'store']);

    // Route to update an existing reply
    Route::put('/replies/{reply}', [CommentController::class, 'update']);

    // Route to delete a reply
    Route::delete('/replies/{reply}', [CommentController::class, 'destroy']);
});
