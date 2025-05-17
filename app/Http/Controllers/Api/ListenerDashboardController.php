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
    }
    
    /**
     * Get recently played tracks.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function getRecentlyPlayed($user)
    {
        return TrackView::where('user_id', $user->id)
            ->with(['music.artist', 'music.genre'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($view) {
                $music = $view->music;
                $music->last_played_at = $view->created_at;
                $music->view_duration = $view->view_duration;
                return $music;
            })
            ->unique('id');
    }
    
    /**
     * Get most played tracks.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function getMostPlayed($user)
    {
        return TrackView::where('user_id', $user->id)
            ->select('music_id', DB::raw('COUNT(*) as play_count'))
            ->groupBy('music_id')
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
    }
    
    /**
     * Get favorite tracks.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function getFavoriteTracks($user)
    {
        // Get tracks from TrackLikes
        $likedTracks = TrackLike::where('user_id', $user->id)
            ->with(['music.artist', 'music.genre'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($like) {
                return $like->music;
            });
        
        // Get tracks from Favorites
        $favoriteTracks = Favorite::where('user_id', $user->id)
            ->where('favorable_type', Music::class)
            ->with(['favorable.artist', 'favorable.genre'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($favorite) {
                return $favorite->favorable;
            });
        
        // Merge and remove duplicates
        return $likedTracks->merge($favoriteTracks)
            ->unique('id')
            ->take(10);
    }
    
    /**
     * Get followed artists.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function getFollowedArtists($user)
    {
        return ArtistFollower::where('user_id', $user->id)
            ->with('artist')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($follower) {
                return $follower->artist;
            });
    }
    
    /**
     * Get user playlists.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function getUserPlaylists($user)
    {
        return Playlist::where('user_id', $user->id)
            ->withCount('tracks')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
    }
    
    /**
     * Get listening activity over time.
     *
     * @param \App\Models\User $user
     * @return array
     */
    private function getListeningActivity($user)
    {
        $startDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now();
        
        $dailyActivity = TrackView::where('user_id', $user->id)
            ->where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
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
    }
    
    /**
     * Get recommended tracks based on listening history.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function getRecommendedTracks($user)
    {
        // Get genres the user listens to most
        $favoriteGenres = TrackView::where('user_id', $user->id)
            ->join('music', 'track_views.music_id', '=', 'music.id')
            ->select('music.genre_id', DB::raw('COUNT(*) as listen_count'))
            ->groupBy('music.genre_id')
            ->orderBy('listen_count', 'desc')
            ->limit(3)
            ->pluck('genre_id');
        
        // Get artists the user listens to most
        $favoriteArtists = TrackView::where('user_id', $user->id)
            ->join('music', 'track_views.music_id', '=', 'music.id')
            ->select('music.artist_id', DB::raw('COUNT(*) as listen_count'))
            ->groupBy('music.artist_id')
            ->orderBy('listen_count', 'desc')
            ->limit(3)
            ->pluck('artist_id');
        
        // Get tracks the user has already listened to
        $listenedTrackIds = TrackView::where('user_id', $user->id)
            ->pluck('music_id');
        
        // Find tracks in the same genres or by the same artists that the user hasn't listened to yet
        return Music::whereIn('genre_id', $favoriteGenres)
            ->orWhereIn('artist_id', $favoriteArtists)
            ->whereNotIn('id', $listenedTrackIds)
            ->with(['artist', 'genre'])
            ->inRandomOrder()
            ->limit(10)
            ->get();
    }
    
    /**
     * Get listening stats.
     *
     * @param \App\Models\User $user
     * @return array
     */
    private function getListeningStats($user)
    {
        // Total tracks played
        $totalPlays = TrackView::where('user_id', $user->id)->count();
        
        // Total unique tracks played
        $uniqueTracks = TrackView::where('user_id', $user->id)
            ->distinct('music_id')
            ->count('music_id');
        
        // Total listening time (in seconds)
        $totalListeningTime = TrackView::where('user_id', $user->id)
            ->sum('view_duration');
        
        // Most listened genre
        $mostListenedGenre = TrackView::where('user_id', $user->id)
            ->join('music', 'track_views.music_id', '=', 'music.id')
            ->join('genres', 'music.genre_id', '=', 'genres.id')
            ->select('genres.id', 'genres.name', DB::raw('COUNT(*) as listen_count'))
            ->groupBy('genres.id', 'genres.name')
            ->orderBy('listen_count', 'desc')
            ->first();
        
        // Most listened artist
        $mostListenedArtist = TrackView::where('user_id', $user->id)
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
}
