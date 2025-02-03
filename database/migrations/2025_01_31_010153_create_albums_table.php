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
        Schema::create('albums', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->foreignId('artist_id')->nullable()->constrained('artists');
            $table->foreignId('genre_id')->constrained('genres')->onDelete('cascade');
            $table->string('original_filename')->nullable();  // Add the new column
            $table->string('file_url');
            $table->string('image_url')->nullable();
            $table->string('download_counts')->nullable()->default(0);
            $table->integer('tracks')->default(1);
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('albums');
    }
};
