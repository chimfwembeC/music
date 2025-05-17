<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Check if user is admin
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }
        
        $users = User::all();
        
        return Inertia::render('User/Index', [
            'users' => $users
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Check if user is admin
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }
        
        return Inertia::render('User/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Check if user is admin
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin,artist,listener',
            'profile_photo' => 'nullable|image|max:1024',
        ]);
        
        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->role = $request->role;
        $user->is_active = true;
        
        if ($request->hasFile('profile_photo')) {
            $user->updateProfilePhoto($request->file('profile_photo'));
        }
        
        $user->save();
        
        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Check if user is admin or viewing their own profile
        if (Auth::user()->role !== 'admin' && Auth::id() != $id) {
            abort(403, 'Unauthorized action.');
        }
        
        $user = User::findOrFail($id);
        
        // Get user-specific data based on role
        $userData = [];
        
        if ($user->role === 'listener') {
            $userData = [
                'playlists' => $user->playlists()->withCount('tracks')->get(),
                'favorites' => $user->favorites()->with(['music.artist', 'music.genre'])->get(),
                'recentlyPlayed' => $user->trackViews()->with(['music.artist', 'music.genre'])->orderBy('created_at', 'desc')->limit(10)->get(),
            ];
        } elseif ($user->role === 'artist') {
            $artist = $user->artist;
            
            if ($artist) {
                $userData = [
                    'artist' => $artist,
                    'tracks' => $artist->tracks()->with(['genre'])->get(),
                    'albums' => $artist->albums()->with(['genre'])->get(),
                    'followers' => $artist->followers()->count(),
                ];
            }
        }
        
        return Inertia::render('User/Show', [
            'user' => $user,
            'userData' => $userData,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // Check if user is admin or editing their own profile
        if (Auth::user()->role !== 'admin' && Auth::id() != $id) {
            abort(403, 'Unauthorized action.');
        }
        
        $user = User::findOrFail($id);
        
        return Inertia::render('User/Edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Check if user is admin or updating their own profile
        if (Auth::user()->role !== 'admin' && Auth::id() != $id) {
            abort(403, 'Unauthorized action.');
        }
        
        $user = User::findOrFail($id);
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => 'required|in:admin,artist,listener',
            'profile_photo' => 'nullable|image|max:1024',
        ]);
        
        $user->name = $request->name;
        $user->email = $request->email;
        
        // Only admin can change roles
        if (Auth::user()->role === 'admin') {
            $user->role = $request->role;
        }
        
        if ($request->hasFile('profile_photo')) {
            $user->updateProfilePhoto($request->file('profile_photo'));
        }
        
        $user->save();
        
        return redirect()->route('users.show', $user->id)->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Check if user is admin
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }
        
        // Prevent deleting yourself
        if (Auth::id() == $id) {
            return back()->with('error', 'You cannot delete your own account.');
        }
        
        $user = User::findOrFail($id);
        
        // Delete profile photo if exists
        if ($user->profile_photo_path) {
            Storage::disk('public')->delete($user->profile_photo_path);
        }
        
        $user->delete();
        
        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }
    
    /**
     * Toggle user active status.
     */
    public function toggleActive(Request $request, string $id)
    {
        // Check if user is admin
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }
        
        $request->validate([
            'is_active' => 'required|boolean',
        ]);
        
        $user = User::findOrFail($id);
        
        // Prevent deactivating yourself
        if (Auth::id() == $id) {
            return back()->with('error', 'You cannot deactivate your own account.');
        }
        
        $user->is_active = $request->boolean('is_active');
        $user->save();
        
        return back()->with('message', 'User status updated successfully.');
    }
}
