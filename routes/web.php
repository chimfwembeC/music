<?php

use App\Http\Controllers\AlbumController;
use App\Http\Controllers\ArtistController;
use App\Http\Controllers\BlogController;
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

// Resource routes for GenreController
Route::resource('genres', GenreController::class);

// Resource routes for BlogController
Route::resource('blogs', BlogController::class);

// Resource routes for MusicController
Route::resource('music', MusicController::class);
// Route::get('/music/{slug}/show', [MusicController::class, 'show']);


Route::get('/music', [PageController::class, 'music'])->name('music');
Route::get('/blogs', [PageController::class, 'blogs'])->name('blogs');
Route::get('/artists', [PageController::class, 'artists'])->name('artists');
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
