<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UserController extends ApiController
{
    /**
     * Display the authenticated user's profile.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function profile(Request $request)
    {
        $user = $request->user();

        // Load relationships
        $user->load([
            'playlists' => function($query) {
                $query->latest()->limit(5);
            },
            'favorites' => function($query) {
                $query->latest()->limit(5)->with('favorable');
            },
            'activities' => function($query) {
                $query->latest()->limit(10);
            }
        ]);

        return $this->success($user);
    }

    /**
     * Update the authenticated user's profile.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => [
                'sometimes',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'bio' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
            'social_links' => 'nullable|array',
            'profile_photo' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation error', 422, $validator->errors());
        }

        // Update profile photo if provided
        if ($request->hasFile('profile_photo')) {
            $user->updateProfilePhoto($request->file('profile_photo'));
        }

        // Update other fields if provided
        if ($request->has('name')) $user->name = $request->name;
        if ($request->has('email')) $user->email = $request->email;
        if ($request->has('bio')) $user->bio = $request->bio;
        if ($request->has('phone')) $user->phone = $request->phone;
        if ($request->has('location')) $user->location = $request->location;
        if ($request->has('social_links')) $user->social_links = $request->social_links;

        $user->save();

        return $this->success($user, 'Profile updated successfully');
    }

    /**
     * Update the authenticated user's password.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation error', 422, $validator->errors());
        }

        // Check current password
        if (!Hash::check($request->current_password, $user->password)) {
            return $this->error('Current password is incorrect', 422);
        }

        // Update password
        $user->password = Hash::make($request->password);
        $user->save();

        return $this->success(null, 'Password updated successfully');
    }

    /**
     * Get the authenticated user's playlists.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function playlists(Request $request)
    {
        $user = $request->user();
        $playlists = $user->playlists()->latest()->paginate(15);

        return $this->success($playlists);
    }

    /**
     * Get the authenticated user's favorites.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function favorites(Request $request)
    {
        $user = $request->user();
        $favorites = $user->favorites()->with('favorable')->latest()->paginate(15);

        return $this->success($favorites);
    }

    /**
     * Get the authenticated user's activity history.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function activities(Request $request)
    {
        $user = $request->user();

        // Filter by activity type
        $type = $request->input('type');
        $query = $user->activities();

        if ($type) {
            $query->where('activity_name', $type);
        }

        $activities = $query->latest()->paginate(20);

        return $this->success($activities);
    }

    /**
     * Get a public user profile.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $user = User::findOrFail($id);

        // Load public information only
        $user->load([
            'playlists' => function($query) {
                $query->where('is_public', true)->latest()->limit(5);
            }
        ]);

        // Remove sensitive information
        $user->makeHidden(['email', 'phone', 'social_links']);

        return $this->success($user);
    }
}
