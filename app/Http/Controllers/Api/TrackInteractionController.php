<?php

namespace App\Http\Controllers\Api;

use App\Models\Music;
use App\Models\TrackView;
use App\Models\TrackLike;
use App\Models\UserActivity;
use App\Enums\ActivityType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TrackInteractionController extends ApiController
{
    /**
     * Record a view for a track.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function recordView(Request $request, $id)
    {
        $music = Music::findOrFail($id);

        // Get user info
        $userId = $request->user() ? $request->user()->id : null;
        $ipAddress = $request->ip();
        $userAgent = $request->userAgent();

        // Generate or get session ID
        $sessionId = $request->cookie('track_session_id');
        if (!$sessionId) {
            $sessionId = Str::uuid()->toString();
            // In a real app, you would set a cookie here
        }

        // Check if this is a unique view (not viewed in the last 24 hours by this user/session)
        $isUnique = !TrackView::where('music_id', $music->id)
            ->where(function($query) use ($userId, $ipAddress, $sessionId) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->where('ip_address', $ipAddress)
                          ->where('session_id', $sessionId);
                }
            })
            ->where('created_at', '>=', now()->subHours(24))
            ->exists();

        // Record the view
        $view = TrackView::create([
            'music_id' => $music->id,
            'user_id' => $userId,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
            'session_id' => $sessionId,
            'view_duration' => $request->input('duration', 0),
            'is_unique' => $isUnique,
        ]);

        // Increment view count if it's a unique view
        if ($isUnique) {
            $music->incrementViewCount();

            // Also increment artist's total plays
            $music->artist->incrementTotalPlays();

            // Log the activity if user is authenticated
            if ($userId) {
                UserActivity::create([
                    'user_id' => $userId,
                    'activity_name' => ActivityType::PLAY->value,
                    'activity_id' => $music->id,
                    'activity_type' => Music::class,
                ]);
            }
        }

        return $this->success([
            'view_count' => $music->view_count,
            'is_unique' => $isUnique,
        ]);
    }

    /**
     * Update view duration for a track.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateViewDuration(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'view_id' => 'required|exists:track_views,id',
            'duration' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation error', 422, $validator->errors());
        }

        $view = TrackView::findOrFail($request->view_id);

        // Ensure the view belongs to the specified track
        if ($view->music_id != $id) {
            return $this->error('View does not belong to this track', 422);
        }

        // Update the duration
        $view->view_duration = $request->duration;
        $view->save();

        return $this->success($view);
    }

    /**
     * Toggle like for a track.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleLike(Request $request, $id)
    {
        $music = Music::findOrFail($id);
        $user = $request->user();

        // Check if user already liked this track
        $like = TrackLike::where('music_id', $music->id)
            ->where('user_id', $user->id)
            ->first();

        if ($like) {
            // Unlike
            $like->delete();
            $music->decrementLikeCount();
            $message = 'Track unliked successfully';
            $isLiked = false;
        } else {
            // Like
            TrackLike::create([
                'music_id' => $music->id,
                'user_id' => $user->id,
            ]);

            $music->incrementLikeCount();

            // Log the activity
            UserActivity::create([
                'user_id' => $user->id,
                'activity_name' => ActivityType::FAVORITE->value,
                'activity_id' => $music->id,
                'activity_type' => Music::class,
            ]);

            $message = 'Track liked successfully';
            $isLiked = true;
        }

        return $this->success([
            'like_count' => $music->like_count,
            'is_liked' => $isLiked,
        ], $message);
    }

    /**
     * Check if a user has liked a track.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkLike(Request $request, $id)
    {
        $music = Music::findOrFail($id);
        $user = $request->user();

        $isLiked = TrackLike::where('music_id', $music->id)
            ->where('user_id', $user->id)
            ->exists();

        return $this->success([
            'is_liked' => $isLiked,
            'like_count' => $music->like_count,
        ]);
    }

    /**
     * Get track statistics.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStats(Request $request, $id)
    {
        $music = Music::findOrFail($id);

        // Get view stats
        $totalViews = $music->view_count;
        $uniqueViews = $music->getUniqueViewsCount();
        $uniqueViewsLast7Days = $music->getUniqueViewsCount(7);
        $uniqueViewsLast30Days = $music->getUniqueViewsCount(30);

        // Get like stats
        $totalLikes = $music->like_count;
        $likesLast7Days = $music->likes()->fromPeriod(7)->count();
        $likesLast30Days = $music->likes()->fromPeriod(30)->count();

        // Get other stats
        $downloads = $music->download_counts;
        $shares = $music->share_count;

        return $this->success([
            'views' => [
                'total' => $totalViews,
                'unique' => $uniqueViews,
                'last_7_days' => $uniqueViewsLast7Days,
                'last_30_days' => $uniqueViewsLast30Days,
            ],
            'likes' => [
                'total' => $totalLikes,
                'last_7_days' => $likesLast7Days,
                'last_30_days' => $likesLast30Days,
            ],
            'downloads' => $downloads,
            'shares' => $shares,
        ]);
    }
}
