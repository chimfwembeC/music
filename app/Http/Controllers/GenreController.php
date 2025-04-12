<?php

namespace App\Http\Controllers;

use App\Models\Genre;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GenreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Retrieve all genres, passing them to the view.
        $genres = Genre::all(); // You can add pagination if needed
        return Inertia::render('Genre/Index', [
            'genres' => $genres,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Show form to create a new genre.
        return Inertia::render('Genre/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the incoming request.
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:genres,name',
            'description' => 'nullable|string',
        ]);

        // Create a new genre record.
        Genre::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
        ]);

        return redirect()->route('genres.index')->with('success', 'Genre created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Genre $genre)
    {
        // Show a single genre with its details.
        return Inertia::render('Genre/Show', [
            'genre' => $genre,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($slug)
    {
        $genre = Genre::where('slug', $slug)->first();
        // Show the form to edit an existing genre.
        return Inertia::render('Genre/Edit', [
            'genre' => $genre,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Genre $genre)
    {
        // Validate the incoming request.
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:genres,name,' . $genre->id,
            'description' => 'nullable|string',
        ]);

        // Update the genre record.
        $genre->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
        ]);

        return redirect()->route('genres.index')->with('success', 'Genre updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Genre $genre)
    {
        // Delete the genre record.
        $genre->delete();

        return redirect()->route('genres.index')->with('success', 'Genre deleted successfully.');
    }
}
