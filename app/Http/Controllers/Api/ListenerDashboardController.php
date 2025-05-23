<?php

namespace App\Http\Controllers\Api;

use App\Models\Music;
use App\Models\Artist;
use App\Models\Album;
use App\Models\Playlist;
use App\Models\TrackView;
use App\Models\TrackLike;
use App\Models\UserActivity;
use App\Models\ArtistFollower;
use App\Models\Favorite;
use App\Enums\ActivityType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ListenerDashboardController extends ApiController
{
    /**
     * Get the listener's dashboard data.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();

            // Get recently played tracks
            $recentlyPlayed = $this->getRecentlyPlayed($user);

            // Get most played tracks
            $mostPlayed = $this->getMostPlayed($user);

            // Get favorite tracks
            $favoriteTracks = $this->getFavoriteTracks($user);

            // Get followed artists
            $followedArtists = $this->getFollowedArtists($user);

            // Get user playlists
            $playlists = $this->getUserPlaylists($user);

            // Get listening activity over time
            $listeningActivity = $this->getListeningActivity($user);

            // Get recommended tracks based on listening history
            $recommendedTracks = $this->getRecommendedTracks($user);

            // Get listening stats
            $listeningStats = $this->getListeningStats($user);

            return $this->success([
                'recently_played' => $recentlyPlayed,
                'most_played' => $mostPlayed,
                'favorite_tracks' => $favoriteTracks,
                'followed_artists' => $followedArtists,
                'playlists' => $playlists,
                'listening_activity' => $listeningActivity,
                'recommended_tracks' => $recommendedTracks,
                'listening_stats' => $listeningStats,
            ]);
        } catch (\Exception $e) {
            \Log::error('API error getting listener dashboard data: ' . $e->getMessage());
            return $this->error('Failed to get listener dashboard data', 500);
        }
    }

    /**
     * Get recently played tracks.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function getRecentlyPlayed($user)
    {
        try {
            return TrackView::where('track_views.user_id', $user->id)
                ->with(['music.artist', 'music.genre'])
                ->orderBy('track_views.created_at', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($view) {
                    if (!$view->music) {
                        return null;
                    }
                    $music = $view->music;
                    $music->last_played_at = $view->created_at;
                    $music->view_duration = $view->view_duration;
                    return $music;
                })
                ->filter() // Remove null values
                ->unique('id');
        } catch (\Exception $e) {
            \Log::error('Error getting recently played tracks: ' . $e->getMessage());
            return collect([]);
        }
    }

    /**
     * Get most played tracks.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function getMostPlayed($user)
    {
        try {
            return TrackView::where('track_views.user_id', $user->id)
                ->select('track_views.music_id', DB::raw('COUNT(*) as play_count'))
                ->groupBy('track_views.music_id')
                ->orderBy('play_count', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($view) {
                    $music = Music::with(['artist', 'genre'])->find($view->music_id);
                    if ($music) {
                        $music->play_count = $view->play_count;
                    }
                    return $music;
                })
                ->filter();
        } catch (\Exception $e) {
            \Log::error('Error getting most played tracks: ' . $e->getMessage());
            return collect([]);
        }
    }

    /**
     * Get favorite tracks.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function getFavoriteTracks($user)
    {
        try {
            // Get tracks from TrackLikes
            $likedTracks = TrackLike::where('track_likes.user_id', $user->id)
                ->with(['music.artist', 'music.genre'])
                ->orderBy('track_likes.created_at', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($like) {
                    return $like->music ?? null;
                })
                ->filter(); // Remove null values

            // Get tracks from Favorites
            $favoriteTracks = Favorite::where('favorites.user_id', $user->id)
                ->where('favorites.favorable_type', Music::class)
                ->with(['favorable.artist', 'favorable.genre'])
                ->orderBy('favorites.created_at', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($favorite) {
                    return $favorite->favorable ?? null;
                })
                ->filter(); // Remove null values

            // Merge and remove duplicates
            return $likedTracks->merge($favoriteTracks)
                ->unique('id')
                ->take(10);
        } catch (\Exception $e) {
            \Log::error('Error getting favorite tracks: ' . $e->getMessage());
            return collect([]);
        }
    }

    /**
     * Get followed artists.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function getFollowedArtists($user)
    {
        try {
            return ArtistFollower::where('artist_followers.user_id', $user->id)
                ->with('artist')
                ->orderBy('artist_followers.created_at', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($follower) {
                    return $follower->artist ?? null;
                })
                ->filter(); // Remove null values
        } catch (\Exception $e) {
            \Log::error('Error getting followed artists: ' . $e->getMessage());
            return collect([]);
        }
    }

    /**
     * Get user playlists.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function getUserPlaylists($user)
    {
        try {
            return Playlist::where('playlists.user_id', $user->id)
                ->withCount('tracks')
                ->orderBy('playlists.created_at', 'desc')
                ->limit(5)
                ->get();
        } catch (\Exception $e) {
            \Log::error('Error getting user playlists: ' . $e->getMessage());
            return collect([]);
        }
    }

    /**
     * Get listening activity over time.
     *
     * @param \App\Models\User $user
     * @return array
     */
    private function getListeningActivity($user)
    {
        try {
            $startDate = Carbon::now()->subDays(30);
            $endDate = Carbon::now();

            $dailyActivity = TrackView::where('track_views.user_id', $user->id)
                ->where('track_views.created_at', '>=', $startDate)
                ->where('track_views.created_at', '<=', $endDate)
                ->select(DB::raw('DATE(track_views.created_at) as date'), DB::raw('COUNT(*) as count'))
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->keyBy('date');

            $result = [];
            for ($date = $startDate->copy(); $date <= $endDate; $date->addDay()) {
                $dateString = $date->format('Y-m-d');
                $result[] = [
                    'date' => $dateString,
                    'count' => $dailyActivity->has($dateString) ? $dailyActivity[$dateString]->count : 0,
                ];
            }

            return $result;
        } catch (\Exception $e) {
            \Log::error('Error getting listening activity: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Get recommended tracks based on listening history.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function getRecommendedTracks($user)
    {
        try {
            // Get genres the user listens to most
            $favoriteGenres = TrackView::where('track_views.user_id', $user->id)
                ->join('music', 'track_views.music_id', '=', 'music.id')
                ->select('music.genre_id', DB::raw('COUNT(*) as listen_count'))
                ->groupBy('music.genre_id')
                ->orderBy('listen_count', 'desc')
                ->limit(3)
                ->pluck('genre_id');

            // If no favorite genres found, get some random genres
            if ($favoriteGenres->isEmpty()) {
                $favoriteGenres = \App\Models\Genre::inRandomOrder()->limit(3)->pluck('id');
            }

            // Get artists the user listens to most
            $favoriteArtists = TrackView::where('track_views.user_id', $user->id)
                ->join('music', 'track_views.music_id', '=', 'music.id')
                ->select('music.artist_id', DB::raw('COUNT(*) as listen_count'))
                ->groupBy('music.artist_id')
                ->orderBy('listen_count', 'desc')
                ->limit(3)
                ->pluck('artist_id');

            // Get tracks the user has already listened to
            $listenedTrackIds = TrackView::where('track_views.user_id', $user->id)
                ->pluck('music_id');

            // Find tracks in the same genres or by the same artists that the user hasn't listened to yet
            $recommendations = Music::where(function ($query) use ($favoriteGenres, $favoriteArtists) {
                    $query->whereIn('genre_id', $favoriteGenres)
                        ->orWhereIn('artist_id', $favoriteArtists);
                })
                ->whereNotIn('id', $listenedTrackIds)
                ->with(['artist', 'genre'])
                ->inRandomOrder()
                ->limit(10)
                ->get();

            // If no recommendations found, just get some random tracks
            if ($recommendations->isEmpty()) {
                $recommendations = Music::with(['artist', 'genre'])
                    ->inRandomOrder()
                    ->limit(10)
                    ->get();
            }

            return $recommendations;
        } catch (\Exception $e) {
            \Log::error('Error getting recommended tracks: ' . $e->getMessage());
            return collect([]);
        }
    }

    /**
     * Get listening stats.
     *
     * @param \App\Models\User $user
     * @return array
     */
    private function getListeningStats($user)
    {
        try {
            // Total tracks played
            $totalPlays = TrackView::where('track_views.user_id', $user->id)->count();

            // Total unique tracks played
            $uniqueTracks = TrackView::where('track_views.user_id', $user->id)
                ->distinct('music_id')
                ->count('music_id');

            // Total listening time (in seconds)
            $totalListeningTime = TrackView::where('track_views.user_id', $user->id)
                ->sum('view_duration');

            // Most listened genre
            $mostListenedGenre = TrackView::where('track_views.user_id', $user->id)
                ->join('music', 'track_views.music_id', '=', 'music.id')
                ->join('genres', 'music.genre_id', '=', 'genres.id')
                ->select('genres.id', 'genres.name', DB::raw('COUNT(*) as listen_count'))
                ->groupBy('genres.id', 'genres.name')
                ->orderBy('listen_count', 'desc')
                ->first();

            // Most listened artist
            $mostListenedArtist = TrackView::where('track_views.user_id', $user->id)
                ->join('music', 'track_views.music_id', '=', 'music.id')
                ->join('artists', 'music.artist_id', '=', 'artists.id')
                ->select('artists.id', 'artists.name', DB::raw('COUNT(*) as listen_count'))
                ->groupBy('artists.id', 'artists.name')
                ->orderBy('listen_count', 'desc')
                ->first();

            return [
                'total_plays' => $totalPlays,
                'unique_tracks' => $uniqueTracks,
                'total_listening_time' => $totalListeningTime,
                'total_listening_time_formatted' => $this->formatListeningTime($totalListeningTime),
                'most_listened_genre' => $mostListenedGenre,
                'most_listened_artist' => $mostListenedArtist,
            ];
        } catch (\Exception $e) {
            \Log::error('Error getting listening stats: ' . $e->getMessage());
            return [
                'total_plays' => 0,
                'unique_tracks' => 0,
                'total_listening_time' => 0,
                'total_listening_time_formatted' => '0 seconds',
                'most_listened_genre' => null,
                'most_listened_artist' => null,
            ];
        }
    }

    /**
     * Format listening time from seconds to hours, minutes, seconds.
     *
     * @param int $seconds
     * @return string
     */
    private function formatListeningTime($seconds)
    {
        $hours = floor($seconds / 3600);
        $minutes = floor(($seconds % 3600) / 60);
        $seconds = $seconds % 60;

        $result = '';
        if ($hours > 0) {
            $result .= $hours . ' hour' . ($hours != 1 ? 's' : '') . ' ';
        }
        if ($minutes > 0) {
            $result .= $minutes . ' minute' . ($minutes != 1 ? 's' : '') . ' ';
        }
        if ($seconds > 0 || $result === '') {
            $result .= $seconds . ' second' . ($seconds != 1 ? 's' : '');
        }

        return trim($result);
    }

    /**
     * API endpoint for getting recently played tracks.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRecentlyPlayedApi(Request $request)
    {
        try {
            $user = $request->user();
            $recentlyPlayed = $this->getRecentlyPlayed($user);

            return $this->success($recentlyPlayed);
        } catch (\Exception $e) {
            \Log::error('API error getting recently played tracks: ' . $e->getMessage());
            return $this->error('Failed to get recently played tracks', 500);
        }
    }

    /**
     * API endpoint for updating recently played tracks.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateRecentlyPlayed(Request $request)
    {
        try {
            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'track_id' => 'required|exists:music,id',
            ]);

            if ($validator->fails()) {
                return $this->error('Validation error', 422, $validator->errors());
            }

            $user = $request->user();
            $trackId = $request->track_id;

            // Record a view for this track
            $music = Music::findOrFail($trackId);

            // Create a track view
            $view = TrackView::create([
                'music_id' => $trackId,
                'user_id' => $user->id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'session_id' => \Illuminate\Support\Str::uuid()->toString(),
                'view_duration' => 0, // Will be updated later
                'is_unique' => true,
            ]);

            // Log the activity
            UserActivity::create([
                'user_id' => $user->id,
                'activity_name' => ActivityType::PLAY->value,
                'activity_id' => $trackId,
                'activity_type' => Music::class,
            ]);

            return $this->success([
                'message' => 'Track added to recently played',
                'view_id' => $view->id,
            ]);
        } catch (\Exception $e) {
            \Log::error('API error updating recently played: ' . $e->getMessage());
            return $this->error('Failed to update recently played', 500);
        }
    }

    /**
     * API endpoint for getting most played tracks.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMostPlayedApi(Request $request)
    {
        try {
            $user = $request->user();
            $mostPlayed = $this->getMostPlayed($user);

            return $this->success($mostPlayed);
        } catch (\Exception $e) {
            \Log::error('API error getting most played tracks: ' . $e->getMessage());
            return $this->error('Failed to get most played tracks', 500);
        }
    }

    /**
     * API endpoint for getting favorite tracks.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFavoriteTracksApi(Request $request)
    {
        try {
            $user = $request->user();
            $favoriteTracks = $this->getFavoriteTracks($user);

            return $this->success($favoriteTracks);
        } catch (\Exception $e) {
            \Log::error('API error getting favorite tracks: ' . $e->getMessage());
            return $this->error('Failed to get favorite tracks', 500);
        }
    }

    /**
     * API endpoint for getting followed artists.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFollowedArtistsApi(Request $request)
    {
        try {
            $user = $request->user();
            $followedArtists = $this->getFollowedArtists($user);

            return $this->success($followedArtists);
        } catch (\Exception $e) {
            \Log::error('API error getting followed artists: ' . $e->getMessage());
            return $this->error('Failed to get followed artists', 500);
        }
    }

    /**
     * API endpoint for getting user playlists.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserPlaylistsApi(Request $request)
    {
        try {
            $user = $request->user();
            $playlists = $this->getUserPlaylists($user);

            return $this->success($playlists);
        } catch (\Exception $e) {
            \Log::error('API error getting user playlists: ' . $e->getMessage());
            return $this->error('Failed to get user playlists', 500);
        }
    }

    /**
     * API endpoint for getting listening activity.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getListeningActivityApi(Request $request)
    {
        try {
            $user = $request->user();
            $listeningActivity = $this->getListeningActivity($user);

            return $this->success($listeningActivity);
        } catch (\Exception $e) {
            \Log::error('API error getting listening activity: ' . $e->getMessage());
            return $this->error('Failed to get listening activity', 500);
        }
    }

    /**
     * API endpoint for getting recommended tracks.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRecommendedTracksApi(Request $request)
    {
        try {
            $user = $request->user();
            $recommendedTracks = $this->getRecommendedTracks($user);

            return $this->success($recommendedTracks);
        } catch (\Exception $e) {
            \Log::error('API error getting recommended tracks: ' . $e->getMessage());
            return $this->error('Failed to get recommended tracks', 500);
        }
    }

    /**
     * API endpoint for getting listening stats.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getListeningStatsApi(Request $request)
    {
        try {
            $user = $request->user();
            $listeningStats = $this->getListeningStats($user);

            return $this->success($listeningStats);
        } catch (\Exception $e) {
            \Log::error('API error getting listening stats: ' . $e->getMessage());
            return $this->error('Failed to get listening stats', 500);
        }
    }
}
