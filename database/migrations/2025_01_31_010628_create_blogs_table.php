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
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->unsignedBigInteger('author_id'); // Foreign key to authors table (if exists)
            $table->string('image_url')->nullable(); // URL of the featured image (nullable in case it's not provided)
            $table->boolean('is_published')->default(false);
            $table->timestamps(); // created_at and updated_at

            // Foreign key constraint
            $table->foreign('author_id')->references('id')->on('users')->onDelete('cascade'); // Assuming authors are users
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};
