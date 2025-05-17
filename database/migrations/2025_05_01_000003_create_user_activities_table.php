<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('activity_name'); // e.g., 'play', 'search', 'download', 'share'
            $table->morphs('activity'); // This creates activity_id and activity_type columns
            $table->json('metadata')->nullable(); // Additional data about the activity
            $table->timestamps();

            // Index for faster queries
            $table->index(['user_id', 'activity_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_activities');
    }
};
