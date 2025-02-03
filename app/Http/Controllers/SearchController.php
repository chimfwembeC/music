<?php

namespace App\Http\Controllers;

use App\Models\Album;
use App\Models\Music;
use App\Models\Artist;
use App\Models\Genre;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class SearchController extends Controller
{
    /**
     * Perform a search across multiple models.
     */
    public function search(Request $request)
    {
        // Validate the incoming search query
        $request->validate([
            'query' => 'required|string|min:3',
        ]);

        $query = $request->input('query');

        // Store in recent searches
        $this->updateRecentSearches($query);

        // Perform the search on each model
        $results = [
            'musics' => Music::with(['artist', 'genre'])->where('title', 'like', "%$query%")->get(),
            'artists' => Artist::latest()->get(),
            'genres' => Genre::latest()->get(),
            'blogs' => Blog::latest()->get(),
            'albums' => Album::latest()->get(),
            // 'artists' => Artist::where('name', 'like', "%$query%")->get(),
            // 'genres' => Genre::where('name', 'like', "%$query%")->get(),
            // 'blogs' => Blog::where('title', 'like', "%$query%")->get(),
        ];

        return Inertia::render("Searches/Index", [
            'query' => $query,
            'results' => $results,
        ]);
    }

    public function searchType($type, $id)
    {
        $data = null;

        if ($type === 'song') {
            $data = Music::with('artist')->find($id);
        } elseif ($type === 'artist') {
            $data = Artist::find($id);
        } elseif ($type === 'genre') {
            $data = Genre::find($id);
        }

        return Inertia::render("Searches/SearchType", [
            'type' => $type, // Passing type as a prop
            'prop' => $data
        ]);
    }

    public function suggestions(Request $request)
    {
        try {
            $query = $request->input('query');

            if (strlen($query) < 2) {
                return response()->json([]);
            }

            // Get song suggestions with eager loading of artist
            $songs = Music::where('title', 'like', "%{$query}%")
                ->with(['artist'])
                ->select('id', 'title', 'image_url')
                ->limit(5)
                ->get()
                ->map(function ($song) {
                    return [
                        'id' => (string) $song->id,
                        'type' => 'song',
                        'title' => $song->title,
                        'subtitle' => $song->artist->name ?? 'Unknown Artist',
                        'imageUrl' => $song->image_url ?? 'https://via.placeholder.com/150',
                    ];
                });

            // Get artist suggestions
            $artists = Artist::where('name', 'like', "%{$query}%")
                ->select('id', 'name', 'image_url')
                ->limit(3)
                ->get()
                ->map(function ($artist) {
                    return [
                        'id' => (string) $artist->id,
                        'type' => 'artist',
                        'title' => $artist->name,
                        'subtitle' => 'Artist',
                        'imageUrl' => $artist->image_url ?? 'https://via.placeholder.com/150',
                    ];
                });

            // Get genre suggestions
            $genres = Genre::where('name', 'like', "%{$query}%")
                ->select('id', 'name', 'description')
                ->limit(2)
                ->get()
                ->map(function ($genre) {
                    return [
                        'id' => (string) $genre->id,
                        'type' => 'genre',
                        'title' => $genre->name,
                        'subtitle' => $genre->description ?? 'Genre',
                        'imageUrl' => 'https://via.placeholder.com/150',
                    ];
                });

            // Merge all suggestions
            $suggestions = $songs->concat($artists)->concat($genres);

            return response()->json($suggestions);
        } catch (\Exception $e) {
            \Log::error('Search suggestion error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch suggestions'], 500);
        }
    }







    /**
     * Get recent searches from the session.
     */
    public function getRecentSearches()
    {
        return response()->json(Session::get('recent_searches', []));
    }

    /**
     * Update the recent searches stored in the session.
     */
    private function updateRecentSearches($query)
    {
        $recentSearches = Session::get('recent_searches', []);

        if (!in_array($query, $recentSearches)) {
            array_unshift($recentSearches, $query);
            $recentSearches = array_slice($recentSearches, 0, 5);
            Session::put('recent_searches', $recentSearches);
        }
    }
}
