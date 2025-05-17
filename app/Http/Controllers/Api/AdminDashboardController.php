<?php

namespace App\Http\Controllers\Api;

use App\Models\Music;
use App\Models\Album;
use App\Models\Artist;
use App\Models\User;
use App\Models\Genre;
use App\Models\TrackView;
use App\Models\TrackLike;
use App\Models\Playlist;
use App\Models\Blog;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminDashboardController extends ApiController
{
    /**
     * Get the admin dashboard data.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Get platform statistics
        $platformStats = $this->getPlatformStats();
        
        // Get user growth
        $userGrowth = $this->getUserGrowth();
        
        // Get content growth
        $contentGrowth = $this->getContentGrowth();
        
        // Get engagement metrics
        $engagementMetrics = $this->getEngagementMetrics();
        
        // Get top content
        $topContent = $this->getTopContent();
        
        // Get recent activity
        $recentActivity = $this->getRecentActivity();
        
        // Get system health
        $systemHealth = $this->getSystemHealth();
        
        return $this->success([
            'platform_stats' => $platformStats,
            'user_growth' => $userGrowth,
            'content_growth' => $contentGrowth,
            'engagement_metrics' => $engagementMetrics,
            'top_content' => $topContent,
            'recent_activity' => $recentActivity,
            'system_health' => $systemHealth,
        ]);
    }
    
    /**
     * Get platform statistics.
     *
     * @return array
     */
    private function getPlatformStats()
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
        $totalComments = Comment::count();
        
        // New users today
        $newUsersToday = User::whereDate('created_at', Carbon::today())->count();
        
        // New content today
        $newTracksToday = Music::whereDate('created_at', Carbon::today())->count();
        
        return [
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
    }
    
    /**
     * Get user growth over time.
     *
     * @return array
     */
    private function getUserGrowth()
    {
        $startDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now();
        
        // Get daily new users
        $dailyUsers = User::where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');
        
        // Get daily new listeners
        $dailyListeners = User::where('role', 'listener')
            ->where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');
        
        // Get daily new artists
        $dailyArtists = User::where('role', 'artist')
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
                'total' => $dailyUsers->has($dateString) ? $dailyUsers[$dateString]->count : 0,
                'listeners' => $dailyListeners->has($dateString) ? $dailyListeners[$dateString]->count : 0,
                'artists' => $dailyArtists->has($dateString) ? $dailyArtists[$dateString]->count : 0,
            ];
        }
        
        return $result;
    }
    
    /**
     * Get content growth over time.
     *
     * @return array
     */
    private function getContentGrowth()
    {
        $startDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now();
        
        // Get daily new tracks
        $dailyTracks = Music::where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');
        
        // Get daily new albums
        $dailyAlbums = Album::where('created_at', '>=', $startDate)
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
                'tracks' => $dailyTracks->has($dateString) ? $dailyTracks[$dateString]->count : 0,
                'albums' => $dailyAlbums->has($dateString) ? $dailyAlbums[$dateString]->count : 0,
            ];
        }
        
        return $result;
    }
    
    /**
     * Get engagement metrics over time.
     *
     * @return array
     */
    private function getEngagementMetrics()
    {
        $startDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now();
        
        // Get daily plays
        $dailyPlays = TrackView::where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');
        
        // Get daily likes
        $dailyLikes = TrackLike::where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');
        
        // Get daily comments
        $dailyComments = Comment::where('created_at', '>=', $startDate)
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
                'plays' => $dailyPlays->has($dateString) ? $dailyPlays[$dateString]->count : 0,
                'likes' => $dailyLikes->has($dateString) ? $dailyLikes[$dateString]->count : 0,
                'comments' => $dailyComments->has($dateString) ? $dailyComments[$dateString]->count : 0,
            ];
        }
        
        return $result;
    }
    
    /**
     * Get top content.
     *
     * @return array
     */
    private function getTopContent()
    {
        // Top tracks
        $topTracks = Music::orderBy('view_count', 'desc')
            ->with(['artist', 'genre'])
            ->limit(5)
            ->get();
        
        // Top albums
        $topAlbums = Album::orderBy('download_counts', 'desc')
            ->with(['artist', 'genre'])
            ->limit(5)
            ->get();
        
        // Top artists
        $topArtists = Artist::orderBy('popularity_score', 'desc')
            ->limit(5)
            ->get();
        
        // Top genres
        $topGenres = Genre::withCount('music')
            ->orderBy('music_count', 'desc')
            ->limit(5)
            ->get();
        
        return [
            'top_tracks' => $topTracks,
            'top_albums' => $topAlbums,
            'top_artists' => $topArtists,
            'top_genres' => $topGenres,
        ];
    }
    
    /**
     * Get recent activity.
     *
     * @return array
     */
    private function getRecentActivity()
    {
        // Recent users
        $recentUsers = User::orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        
        // Recent tracks
        $recentTracks = Music::orderBy('created_at', 'desc')
            ->with(['artist', 'genre'])
            ->limit(5)
            ->get();
        
        // Recent albums
        $recentAlbums = Album::orderBy('created_at', 'desc')
            ->with(['artist', 'genre'])
            ->limit(5)
            ->get();
        
        // Recent blogs
        $recentBlogs = Blog::orderBy('created_at', 'desc')
            ->with('user')
            ->limit(5)
            ->get();
        
        return [
            'recent_users' => $recentUsers,
            'recent_tracks' => $recentTracks,
            'recent_albums' => $recentAlbums,
            'recent_blogs' => $recentBlogs,
        ];
    }
    
    /**
     * Get system health.
     *
     * @return array
     */
    private function getSystemHealth()
    {
        // This is a placeholder. In a real app, you would check actual system metrics
        return [
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
    }
}
