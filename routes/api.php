<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/get-blogs', [\App\Http\Controllers\ApiController::class, 'getLatestBlogs'])
    ->name('api.blogs.index');
    // ->middleware('auth:sanctum');

  