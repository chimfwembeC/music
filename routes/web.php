<?php

use App\Http\Controllers\AlbumController;
use App\Http\Controllers\ArtistController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\MusicController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\SearchController;
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
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
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