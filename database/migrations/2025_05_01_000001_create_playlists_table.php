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
        Schema::create('playlists', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->boolean('is_public')->default(true);
            $table->string('image_url')->nullable();
            $table->timestamps();
        });

        // Create pivot table for playlist_music relationship
        Schema::create('playlist_music', function (Blueprint $table) {
            $table->id();
            $table->foreignId('playlist_id')->constrained()->onDelete('cascade');
            $table->foreignId('music_id')->constrained()->onDelete('cascade');
            $table->integer('position')->default(0); // For ordering tracks in playlist
            $table->timestamps();
            
            // Ensure a track can only be added once to a playlist
            $table->unique(['playlist_id', 'music_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('playlist_music');
        Schema::dropIfExists('playlists');
    }
};
