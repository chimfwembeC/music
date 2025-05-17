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
        Schema::table('artists', function (Blueprint $table) {
            $table->integer('followers_count')->default(0)->after('image_url');
            $table->bigInteger('total_plays')->default(0)->after('followers_count');
            $table->integer('popularity_score')->default(0)->after('total_plays'); // 0-100 score
            $table->boolean('is_verified')->default(false)->after('popularity_score');
            $table->json('social_links')->nullable()->after('is_verified');
            $table->string('website')->nullable()->after('social_links');
            $table->string('country')->nullable()->after('website');
            $table->string('city')->nullable()->after('country');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('artists', function (Blueprint $table) {
            $table->dropColumn([
                'followers_count',
                'total_plays',
                'popularity_score',
                'is_verified',
                'social_links',
                'website',
                'country',
                'city',
            ]);
        });
    }
};
