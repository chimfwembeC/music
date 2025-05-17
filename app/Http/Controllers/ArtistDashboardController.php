<?php

namespace App\Http\Controllers;

use App\Models\Music;
use App\Models\Album;
use App\Models\Artist;
use App\Models\TrackView;
use App\Models\TrackLike;
use App\Models\ArtistFollower;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class ArtistDashboardController extends Controller
{
    /**
     * Display the artist dashboard.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Get the artist profile associated with this user
        $artist = Artist::where('user_id', $user->id)->first();

        if (!$artist) {
            // If no artist profile exists, create a basic one
            $artist = Artist::create([
                'name' => $user->name,
                'slug' => \Illuminate\Support\Str::slug($user->name),
                'user_id' => $user->id,
                'bio' => '',
                'followers_count' => 0,
                'total_plays' => 0,
                'popularity_score' => 0,
                'is_verified' => false,
            ]);
        }

        // Get artist's tracks
        $tracks = $this->getArtistTracks($artist);

        // Get artist's albums
        $albums = $this->getArtistAlbums($artist);

        // Get recent track performance
        $trackPerformance = $this->getTrackPerformance($artist);

        // Get audience demographics
        $demographics = $this->getAudienceDemographics($artist);

        // Get followers growth
        $followersGrowth = $this->getFollowersGrowth($artist);

        // Get top performing tracks
        $topTracks = $this->getTopTracks($artist);

        // Get revenue statistics (if applicable)
        $revenue = $this->getRevenueStats($artist);

        // Get artist statistics
        $stats = $this->getArtistStats($artist);

        return Inertia::render('Dashboards/ArtistDashboardPage', [
            'artist' => $artist,
            'tracks' => $tracks,
            'albums' => $albums,
            'trackPerformance' => $trackPerformance,
            'demographics' => $demographics,
            'followersGrowth' => $followersGrowth,
            'topTracks' => $topTracks,
            'revenue' => $revenue,
            'stats' => $stats,
        ]);
    }

    /**
     * Get artist's tracks.
     *
     * @param \App\Models\Artist $artist
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function getArtistTracks($artist)
    {
        return Music::where('artist_id', $artist->id)
            ->with('genre')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get artist's albums.
     *
     * @param \App\Models\Artist $artist
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function getArtistAlbums($artist)
    {
        return Album::where('artist_id', $artist->id)
            ->with('genre')
            ->withCount('tracks')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get track performance over time.
     *
     * @param \App\Models\Artist $artist
     * @return array
     */
    private function getTrackPerformance($artist)
    {
        $startDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now();

        // Get daily plays for all tracks by this artist
        $dailyPlays = TrackView::whereHas('music', function ($query) use ($artist) {
                $query->where('artist_id', $artist->id);
            })
            ->where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        // Get daily likes for all tracks by this artist
        $dailyLikes = TrackLike::whereHas('music', function ($query) use ($artist) {
                $query->where('artist_id', $artist->id);
            })
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
                'plays' => $dailyPlays->has($dateString) ? $dailyPlays[$dateString]->count : 0,
                'likes' => $dailyLikes->has($dateString) ? $dailyLikes[$dateString]->count : 0,
            ];
        }

        return $result;
    }

    /**
     * Get audience demographics.
     *
     * @param \App\Models\Artist $artist
     * @return array
     */
    private function getAudienceDemographics($artist)
    {
        // Get locations of users who have played the artist's tracks
        $locations = User::whereHas('activities', function ($query) use ($artist) {
                $query->whereHasMorph('activity', [Music::class], function ($q) use ($artist) {
                    $q->where('artist_id', $artist->id);
                });
            })
            ->whereNotNull('location')
            ->select('location', DB::raw('COUNT(*) as count'))
            ->groupBy('location')
            ->orderBy('count', 'desc')
            ->limit(5)
            ->get();

        // This is a simplified version. In a real app, you might have more detailed demographics
        return [
            'locations' => $locations,
        ];
    }

    /**
     * Get followers growth over time.
     *
     * @param \App\Models\Artist $artist
     * @return array
     */
    private function getFollowersGrowth($artist)
    {
        $startDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now();

        $dailyFollowers = ArtistFollower::where('artist_id', $artist->id)
            ->where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $result = [];
        $cumulativeCount = ArtistFollower::where('artist_id', $artist->id)
            ->where('created_at', '<', $startDate)
            ->count();

        for ($date = $startDate->copy(); $date <= $endDate; $date->addDay()) {
            $dateString = $date->format('Y-m-d');
            $dailyCount = $dailyFollowers->has($dateString) ? $dailyFollowers[$dateString]->count : 0;
            $cumulativeCount += $dailyCount;

            $result[] = [
                'date' => $dateString,
                'new_followers' => $dailyCount,
                'total_followers' => $cumulativeCount,
            ];
        }

        return $result;
    }

    /**
     * Get top performing tracks.
     *
     * @param \App\Models\Artist $artist
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function getTopTracks($artist)
    {
        return Music::where('artist_id', $artist->id)
            ->orderBy('view_count', 'desc')
            ->orderBy('like_count', 'desc')
            ->with('genre')
            ->limit(5)
            ->get();
    }

    /**
     * Get revenue statistics.
     *
     * @param \App\Models\Artist $artist
     * @return array
     */
    private function getRevenueStats($artist)
    {
        // This is a placeholder. In a real app, you would calculate actual revenue
        // based on streams, downloads, etc.
        return [
            'total_revenue' => 0,
            'revenue_this_month' => 0,
            'revenue_last_month' => 0,
            'revenue_growth' => 0,
        ];
    }

    /**
     * Get artist statistics.
     *
     * @param \App\Models\Artist $artist
     * @return array
     */
    private function getArtistStats($artist)
    {
        // Total tracks
        $totalTracks = Music::where('artist_id', $artist->id)->count();

        // Total albums
        $totalAlbums = Album::where('artist_id', $artist->id)->count();

        // Total plays
        $totalPlays = $artist->total_plays;

        // Total likes
        $totalLikes = Music::where('artist_id', $artist->id)->sum('like_count');

        // Total followers
        $totalFollowers = $artist->followers_count;

        // Average plays per track
        $averagePlays = $totalTracks > 0 ? round($totalPlays / $totalTracks) : 0;

        return [
            'total_tracks' => $totalTracks,
            'total_albums' => $totalAlbums,
            'total_plays' => $totalPlays,
            'total_likes' => $totalLikes,
            'total_followers' => $totalFollowers,
            'average_plays' => $averagePlays,
            'popularity_score' => $artist->popularity_score,
        ];
    }
}
