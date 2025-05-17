<?php

namespace App\Http\Controllers\Api;

use App\Models\Artist;
use App\Models\ArtistFollower;
use App\Models\UserActivity;
use App\Enums\ActivityType;
use Illuminate\Http\Request;

class ArtistFollowerController extends ApiController
{
    /**
     * Toggle follow status for an artist.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleFollow(Request $request, $id)
    {
        $artist = Artist::findOrFail($id);
        $user = $request->user();

        // Check if user is already following this artist
        $follower = ArtistFollower::where('artist_id', $artist->id)
            ->where('user_id', $user->id)
            ->first();

        if ($follower) {
            // Unfollow
            $follower->delete();
            $artist->decrementFollowersCount();
            $message = 'Artist unfollowed successfully';
            $isFollowing = false;
        } else {
            // Follow
            ArtistFollower::create([
                'artist_id' => $artist->id,
                'user_id' => $user->id,
                'notifications_enabled' => true,
            ]);

            $artist->incrementFollowersCount();

            // Update artist popularity score
            $artist->updatePopularityScore();

            // Log the activity
            UserActivity::create([
                'user_id' => $user->id,
                'activity_name' => ActivityType::FAVORITE->value,
                'activity_id' => $artist->id,
                'activity_type' => Artist::class,
                'metadata' => ['action' => 'follow'],
            ]);

            $message = 'Artist followed successfully';
            $isFollowing = true;
        }

        return $this->success([
            'followers_count' => $artist->followers_count,
            'is_following' => $isFollowing,
        ], $message);
    }

    /**
     * Check if a user is following an artist.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkFollow(Request $request, $id)
    {
        $artist = Artist::findOrFail($id);
        $user = $request->user();

        $isFollowing = ArtistFollower::where('artist_id', $artist->id)
            ->where('user_id', $user->id)
            ->exists();

        return $this->success([
            'is_following' => $isFollowing,
            'followers_count' => $artist->followers_count,
        ]);
    }

    /**
     * Toggle notifications for an artist.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleNotifications(Request $request, $id)
    {
        $artist = Artist::findOrFail($id);
        $user = $request->user();

        $follower = ArtistFollower::where('artist_id', $artist->id)
            ->where('user_id', $user->id)
            ->first();

        if (!$follower) {
            return $this->error('You are not following this artist', 422);
        }

        $follower->notifications_enabled = !$follower->notifications_enabled;
        $follower->save();

        return $this->success([
            'notifications_enabled' => $follower->notifications_enabled,
        ], 'Notifications ' . ($follower->notifications_enabled ? 'enabled' : 'disabled') . ' successfully');
    }

    /**
     * Get followers of an artist.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFollowers(Request $request, $id)
    {
        $artist = Artist::findOrFail($id);

        $followers = $artist->followers()
            ->with('user:id,name,profile_photo_url')
            ->latest()
            ->paginate(20);

        return $this->success($followers);
    }

    /**
     * Get artists followed by a user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFollowedArtists(Request $request)
    {
        $user = $request->user();

        $followedArtists = ArtistFollower::where('user_id', $user->id)
            ->with('artist')
            ->latest()
            ->paginate(20);

        return $this->success($followedArtists);
    }
}
