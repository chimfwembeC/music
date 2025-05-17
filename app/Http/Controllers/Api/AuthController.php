<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Enums\ActivityType;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends ApiController
{
    /**
     * Register a new user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'sometimes|in:listener,artist',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation error', 422, $validator->errors());
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'listener',
        ]);

        // Log the registration activity
        UserActivity::create([
            'user_id' => $user->id,
            'activity_name' => ActivityType::REGISTER->value,
            'activity_id' => $user->id,
            'activity_type' => User::class,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->success([
            'user' => $user,
            'token' => $token,
        ], 'User registered successfully');
    }

    /**
     * Login a user and create a token.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
            'device_name' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation error', 422, $validator->errors());
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Delete previous tokens if they exist
        if ($request->has('device_name')) {
            $user->tokens()->where('name', $request->device_name)->delete();
            $token = $user->createToken($request->device_name)->plainTextToken;
        } else {
            $token = $user->createToken('auth_token')->plainTextToken;
        }

        // Log the login activity
        UserActivity::create([
            'user_id' => $user->id,
            'activity_name' => ActivityType::LOGIN->value,
            'activity_id' => $user->id,
            'activity_type' => User::class,
        ]);

        return $this->success([
            'user' => $user,
            'token' => $token,
        ], 'User logged in successfully');
    }

    /**
     * Logout a user and invalidate token.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->success(null, 'User logged out successfully');
    }

    /**
     * Get the authenticated user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function user(Request $request)
    {
        return $this->success($request->user());
    }
}
