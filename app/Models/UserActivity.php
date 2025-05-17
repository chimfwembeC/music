<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserActivity extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'activity_name',
        'activity_id',
        'activity_type',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    /**
     * Get the user that owns the activity.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the related activity model.
     */
    public function activity()
    {
        return $this->morphTo('activity');
    }

    /**
     * Scope a query to only include activities of a specific type.
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('activity_name', $type);
    }

    /**
     * Scope a query to only include recent activities.
     */
    public function scopeRecent($query, $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }
}
