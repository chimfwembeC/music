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
        Schema::create('track_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('music_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('session_id')->nullable();
            $table->integer('view_duration')->default(0); // Duration in seconds
            $table->boolean('is_unique')->default(true); // Whether this is a unique view
            $table->timestamps();
            
            // Indexes for faster queries
            $table->index(['music_id', 'created_at']);
            $table->index(['user_id', 'music_id']);
            $table->index(['ip_address', 'music_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('track_views');
    }
};
