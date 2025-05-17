<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Music;
use App\Models\Album;
use App\Models\Artist;
use App\Models\User;
use App\Models\Genre;
use App\Models\TrackView;
use App\Models\TrackLike;
use App\Models\Playlist;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        // Get the authenticated user
        $user = $request->user();

        // If no user is authenticated, redirect to login
        if (!$user) {
            return redirect()->route('login');
        }

        // Get data based on user role
        $dashboardData = $this->getDashboardData($user);

        // Render the dashboard with the appropriate data
        return Inertia::render('Dashboard', array_merge(
            ['userRole' => $user->role ?? 'unknown'],
            $dashboardData
        ));
    }

    /**
     * Get dashboard data based on user role.
     *
     * @param  \App\Models\User  $user
     * @return array
     */
    private function getDashboardData($user)
    {
        switch ($user->role) {
            case 'listener':
                return $this->getListenerDashboardData($user);

            case 'artist':
                return $this->getArtistDashboardData($user);

            case 'admin':
                return $this->getAdminDashboardData();

            default:
                return [];
        }
    }

    /**
     * Get data for listener dashboard.
     *
     * @param  \App\Models\User  $user
     * @return array
     */
    private function getListenerDashboardData($user)
    {
        // Recently played tracks
        $recentlyPlayed = Music::whereHas('views', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->with(['artist', 'genre'])
        ->orderByDesc(
            TrackView::select('created_at')
                ->whereColumn('music_id', 'music.id')
                ->where('user_id', $user->id)
                ->latest()
                ->limit(1)
        )
        ->limit(8)
        ->get();

        // Most played tracks
        $mostPlayed = Music::withCount(['views' => function ($query) use ($user) {
            $query->where('user_id', $user->id);
        }])
        ->with(['artist', 'genre'])
        ->orderByDesc('views_count')
        ->limit(8)
        ->get();

        // Favorite tracks
        $favoriteTracks = Music::whereHas('likes', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->with(['artist', 'genre'])
        ->limit(8)
        ->get();

        // Followed artists
        $followedArtists = Artist::whereHas('followers', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->limit(8)
        ->get();

        // User playlists
        $playlists = Playlist::where('user_id', $user->id)
            ->withCount('tracks')
            ->limit(8)
            ->get();

        // Recommended tracks (simple recommendation based on genre preferences)
        $favoriteGenreIds = Music::whereHas('likes', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->pluck('genre_id')
        ->unique()
        ->toArray();

        // If user has no favorite genres, get some random genres
        if (empty($favoriteGenreIds)) {
            $favoriteGenreIds = Genre::inRandomOrder()->limit(3)->pluck('id')->toArray();
        }

        $recommendedTracks = Music::whereIn('genre_id', $favoriteGenreIds)
            ->whereDoesntHave('views', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with(['artist', 'genre'])
            ->inRandomOrder()
            ->limit(8)
            ->get();

        // If still no recommendations, just get some random tracks
        if ($recommendedTracks->isEmpty()) {
            $recommendedTracks = Music::with(['artist', 'genre'])
                ->inRandomOrder()
                ->limit(8)
                ->get();
        }

        // Listening stats
        $totalPlays = TrackView::where('user_id', $user->id)->count();
        $uniqueTracks = TrackView::where('user_id', $user->id)->distinct('music_id')->count();

        // Calculate total listening time (assuming average track length of 3.5 minutes)
        $totalListeningTimeMinutes = $totalPlays * 3.5;
        $totalListeningTimeFormatted = $this->formatListeningTime($totalListeningTimeMinutes);

        // Most listened genre
        $mostListenedGenre = Genre::select('genres.id', 'genres.name')
            ->join('music', 'genres.id', '=', 'music.genre_id')
            ->join('track_views', 'music.id', '=', 'track_views.music_id')
            ->where('track_views.user_id', $user->id)
            ->groupBy('genres.id', 'genres.name')
            ->orderByRaw('COUNT(*) DESC')
            ->first();

        if ($mostListenedGenre) {
            $mostListenedGenre->listen_count = TrackView::join('music', 'track_views.music_id', '=', 'music.id')
                ->where('track_views.user_id', $user->id)
                ->where('music.genre_id', $mostListenedGenre->id)
                ->count();
        }

        // Most listened artist
        $mostListenedArtist = Artist::select('artists.id', 'artists.name')
            ->join('music', 'artists.id', '=', 'music.artist_id')
            ->join('track_views', 'music.id', '=', 'track_views.music_id')
            ->where('track_views.user_id', $user->id)
            ->groupBy('artists.id', 'artists.name')
            ->orderByRaw('COUNT(*) DESC')
            ->first();

        if ($mostListenedArtist) {
            $mostListenedArtist->listen_count = TrackView::join('music', 'track_views.music_id', '=', 'music.id')
                ->where('track_views.user_id', $user->id)
                ->where('music.artist_id', $mostListenedArtist->id)
                ->count();
        }

        $listeningStats = [
            'total_plays' => $totalPlays,
            'unique_tracks' => $uniqueTracks,
            'total_listening_time' => $totalListeningTimeMinutes,
            'total_listening_time_formatted' => $totalListeningTimeFormatted,
            'most_listened_genre' => $mostListenedGenre,
            'most_listened_artist' => $mostListenedArtist,
        ];

        // Listening activity over time (last 30 days)
        $startDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now();

        // Get listening activity over time (last 30 days)
        $listeningActivity = [];

        // Create an array of dates for the last 30 days
        for ($date = $startDate->copy(); $date <= $endDate; $date->addDay()) {
            $dateString = $date->format('Y-m-d');

            // Get play count for this date
            $count = TrackView::where('user_id', $user->id)
                ->whereDate('created_at', $dateString)
                ->count();

            $listeningActivity[] = [
                'date' => $dateString,
                'count' => $count,
            ];
        }

        return [
            'recentlyPlayed' => $recentlyPlayed,
            'mostPlayed' => $mostPlayed,
            'favoriteTracks' => $favoriteTracks,
            'followedArtists' => $followedArtists,
            'playlists' => $playlists,
            'recommendedTracks' => $recommendedTracks,
            'listeningStats' => $listeningStats,
            'listeningActivity' => $listeningActivity,
        ];
    }

    /**
     * Get data for artist dashboard.
     *
     * @param  \App\Models\User  $user
     * @return array
     */
    private function getArtistDashboardData($user)
    {
        // Get the artist profile
        $artist = Artist::where('user_id', $user->id)->first();

        if (!$artist) {
            // Create a placeholder artist profile if none exists
            return [
                'artist' => null,
                'tracks' => [],
                'albums' => [],
                'trackPerformance' => [],
                'demographics' => [],
                'followersGrowth' => [],
                'topTracks' => [],
                'revenue' => [],
                'stats' => [
                    'total_tracks' => 0,
                    'total_albums' => 0,
                    'total_plays' => 0,
                    'total_likes' => 0,
                    'total_followers' => 0,
                    'average_plays' => 0,
                    'popularity_score' => 0,
                ],
            ];
        }

        // Get artist's tracks
        $tracks = Music::where('artist_id', $artist->id)
            ->with(['genre'])
            ->orderBy('created_at', 'desc')
            ->limit(8)
            ->get();

        // Get artist's albums
        $albums = Album::where('artist_id', $artist->id)
            ->with(['genre'])
            ->orderBy('created_at', 'desc')
            ->limit(8)
            ->get();

        // Get track performance over time (last 30 days)
        $startDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now();

        $trackPerformance = [];
        for ($date = $startDate->copy(); $date <= $endDate; $date->addDay()) {
            $dateString = $date->format('Y-m-d');

            // Get plays for this date
            $plays = TrackView::join('music', 'track_views.music_id', '=', 'music.id')
                ->where('music.artist_id', $artist->id)
                ->whereDate('track_views.created_at', $dateString)
                ->count();

            // Get likes for this date
            $likes = TrackLike::join('music', 'track_likes.music_id', '=', 'music.id')
                ->where('music.artist_id', $artist->id)
                ->whereDate('track_likes.created_at', $dateString)
                ->count();

            $trackPerformance[] = [
                'date' => $dateString,
                'plays' => $plays,
                'likes' => $likes,
            ];
        }

        // Get audience demographics (simplified)
        $demographics = [
            'locations' => [
                ['location' => 'United States', 'count' => rand(100, 1000)],
                ['location' => 'United Kingdom', 'count' => rand(50, 500)],
                ['location' => 'Canada', 'count' => rand(30, 300)],
                ['location' => 'Australia', 'count' => rand(20, 200)],
                ['location' => 'Germany', 'count' => rand(10, 100)],
            ],
        ];

        // Get followers growth over time (last 30 days)
        $followersGrowth = [];
        $totalFollowers = 0;

        for ($date = $startDate->copy(); $date <= $endDate; $date->addDay()) {
            $dateString = $date->format('Y-m-d');

            // Simulate new followers (in a real app, this would come from the database)
            $newFollowers = rand(0, 10);
            $totalFollowers += $newFollowers;

            $followersGrowth[] = [
                'date' => $dateString,
                'new_followers' => $newFollowers,
                'total_followers' => $totalFollowers,
            ];
        }

        // Get top tracks
        $topTracks = Music::where('artist_id', $artist->id)
            ->orderBy('view_count', 'desc')
            ->with(['genre'])
            ->limit(5)
            ->get();

        // Get revenue stats (simplified)
        $revenue = [
            'total_revenue' => rand(1000, 10000),
            'revenue_this_month' => rand(100, 1000),
            'revenue_last_month' => rand(100, 1000),
            'revenue_growth' => rand(-20, 50),
        ];

        // Get artist stats
        $stats = [
            'total_tracks' => Music::where('artist_id', $artist->id)->count(),
            'total_albums' => Album::where('artist_id', $artist->id)->count(),
            'total_plays' => TrackView::join('music', 'track_views.music_id', '=', 'music.id')
                ->where('music.artist_id', $artist->id)
                ->count(),
            'total_likes' => TrackLike::join('music', 'track_likes.music_id', '=', 'music.id')
                ->where('music.artist_id', $artist->id)
                ->count(),
            'total_followers' => $artist->followers()->count(),
            'average_plays' => Music::where('artist_id', $artist->id)->avg('view_count') ?: 0,
            'popularity_score' => $artist->popularity_score ?: 0,
        ];

        return [
            'artist' => $artist,
            'tracks' => $tracks,
            'albums' => $albums,
            'trackPerformance' => $trackPerformance,
            'demographics' => $demographics,
            'followersGrowth' => $followersGrowth,
            'topTracks' => $topTracks,
            'revenue' => $revenue,
            'stats' => $stats,
        ];
    }

    /**
     * Get data for admin dashboard.
     *
     * @return array
     */
    private function getAdminDashboardData()
    {
        // Total users
        $totalUsers = User::count();
        $listenerCount = User::where('role', 'listener')->count();
        $artistCount = User::where('role', 'artist')->count();

        // Total content
        $totalTracks = Music::count();
        $totalAlbums = Album::count();
        $totalArtists = Artist::count();
        $totalGenres = Genre::count();

        // Total engagement
        $totalPlays = TrackView::count();
        $totalLikes = TrackLike::count();
        $totalPlaylists = Playlist::count();
        $totalComments = 0; // Placeholder, replace with actual count

        // New users today
        $newUsersToday = User::whereDate('created_at', Carbon::today())->count();

        // New content today
        $newTracksToday = Music::whereDate('created_at', Carbon::today())->count();

        $platformStats = [
            'total_users' => $totalUsers,
            'listener_count' => $listenerCount,
            'artist_count' => $artistCount,
            'total_tracks' => $totalTracks,
            'total_albums' => $totalAlbums,
            'total_artists' => $totalArtists,
            'total_genres' => $totalGenres,
            'total_plays' => $totalPlays,
            'total_likes' => $totalLikes,
            'total_playlists' => $totalPlaylists,
            'total_comments' => $totalComments,
            'new_users_today' => $newUsersToday,
            'new_tracks_today' => $newTracksToday,
        ];

        // Get user growth over time (last 30 days)
        $startDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now();

        $userGrowth = [];
        for ($date = $startDate->copy(); $date <= $endDate; $date->addDay()) {
            $dateString = $date->format('Y-m-d');

            $userGrowth[] = [
                'date' => $dateString,
                'total' => User::whereDate('created_at', '<=', $dateString)->count(),
                'listeners' => User::where('role', 'listener')->whereDate('created_at', '<=', $dateString)->count(),
                'artists' => User::where('role', 'artist')->whereDate('created_at', '<=', $dateString)->count(),
            ];
        }

        // Get content growth over time (last 30 days)
        $contentGrowth = [];
        for ($date = $startDate->copy(); $date <= $endDate; $date->addDay()) {
            $dateString = $date->format('Y-m-d');

            $contentGrowth[] = [
                'date' => $dateString,
                'tracks' => Music::whereDate('created_at', $dateString)->count(),
                'albums' => Album::whereDate('created_at', $dateString)->count(),
            ];
        }

        // Get engagement metrics over time (last 30 days)
        $engagementMetrics = [];
        for ($date = $startDate->copy(); $date <= $endDate; $date->addDay()) {
            $dateString = $date->format('Y-m-d');

            $engagementMetrics[] = [
                'date' => $dateString,
                'plays' => TrackView::whereDate('created_at', $dateString)->count(),
                'likes' => TrackLike::whereDate('created_at', $dateString)->count(),
                'comments' => 0, // Placeholder, replace with actual count
            ];
        }

        // Get top content
        $topTracks = Music::orderBy('view_count', 'desc')
            ->with(['artist', 'genre'])
            ->limit(5)
            ->get();

        $topAlbums = Album::orderBy('download_counts', 'desc')
            ->with(['artist', 'genre'])
            ->limit(5)
            ->get();

        $topArtists = Artist::orderBy('popularity_score', 'desc')
            ->limit(5)
            ->get();

        // Get top genres by track count
        $topGenres = Genre::withCount('tracks')
            ->orderBy('tracks_count', 'desc')
            ->limit(5)
            ->get();

        $topContent = [
            'top_tracks' => $topTracks,
            'top_albums' => $topAlbums,
            'top_artists' => $topArtists,
            'top_genres' => $topGenres,
        ];

        // Get recent activity
        $recentUsers = User::orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $recentTracks = Music::orderBy('created_at', 'desc')
            ->with(['artist', 'genre'])
            ->limit(5)
            ->get();

        $recentAlbums = Album::orderBy('created_at', 'desc')
            ->with(['artist', 'genre'])
            ->limit(5)
            ->get();

        $recentActivity = [
            'recent_users' => $recentUsers,
            'recent_tracks' => $recentTracks,
            'recent_albums' => $recentAlbums,
            'recent_blogs' => [], // Placeholder, replace with actual data
        ];

        // System health (placeholder)
        $systemHealth = [
            'disk_usage' => [
                'used' => 0,
                'total' => 0,
                'percentage' => 0,
            ],
            'memory_usage' => [
                'used' => 0,
                'total' => 0,
                'percentage' => 0,
            ],
            'cpu_usage' => 0,
            'queue_status' => 'operational',
            'last_backup' => null,
        ];

        return [
            'platformStats' => $platformStats,
            'userGrowth' => $userGrowth,
            'contentGrowth' => $contentGrowth,
            'engagementMetrics' => $engagementMetrics,
            'topContent' => $topContent,
            'recentActivity' => $recentActivity,
            'systemHealth' => $systemHealth,
        ];
    }

    /**
     * Format listening time in minutes to a human-readable string.
     *
     * @param  float  $minutes
     * @return string
     */
    private function formatListeningTime($minutes)
    {
        if ($minutes < 60) {
            return round($minutes) . ' minutes';
        }

        $hours = floor($minutes / 60);
        $remainingMinutes = round($minutes % 60);

        if ($hours < 24) {
            return $hours . ' hours' . ($remainingMinutes > 0 ? ' ' . $remainingMinutes . ' minutes' : '');
        }

        $days = floor($hours / 24);
        $remainingHours = $hours % 24;

        return $days . ' days' . ($remainingHours > 0 ? ' ' . $remainingHours . ' hours' : '');
    }
}
