<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Jetstream\HasProfilePhoto;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;
    use HasProfilePhoto;
    use Notifiable;
    use TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'bio',
        'phone',
        'location',
        'social_links',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_recovery_codes',
        'two_factor_secret',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'profile_photo_url',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'social_links' => 'array',
        ];
    }

    /**
     * Get the playlists that belong to the user.
     */
    public function playlists()
    {
        return $this->hasMany(Playlist::class);
    }

    /**
     * Get the favorites that belong to the user.
     */
    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    /**
     * Get the activities that belong to the user.
     */
    public function activities()
    {
        return $this->hasMany(UserActivity::class);
    }

    /**
     * Get the user's favorite music.
     */
    public function favoriteTracks()
    {
        return $this->favorites()->where('favorable_type', Music::class);
    }

    /**
     * Get the user's favorite albums.
     */
    public function favoriteAlbums()
    {
        return $this->favorites()->where('favorable_type', Album::class);
    }

    /**
     * Get the user's favorite artists.
     */
    public function favoriteArtists()
    {
        return $this->favorites()->where('favorable_type', Artist::class);
    }

    /**
     * Check if the user is an admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if the user is an artist.
     */
    public function isArtist(): bool
    {
        return $this->role === 'artist';
    }

    /**
     * Get the artist profile associated with the user.
     */
    public function artist()
    {
        return $this->hasOne(Artist::class);
    }
}
