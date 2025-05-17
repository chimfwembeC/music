<?php

namespace Database\Seeders;

use App\Models\Album;
use Illuminate\Database\Seeder;
use App\Models\Artist;
use App\Models\Blog;
use App\Models\Genre;
use App\Models\Music;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Truncate tables to prevent duplicate data
        Artist::truncate();
        Blog::truncate();
        Genre::truncate();
        Music::truncate();
        Album::truncate();
        User::truncate();

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Seed Users
        $user = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
            'password' => bcrypt('password'),
        ]);


        $this->call([
            GenreSeeder::class,
            ArtistSeeder::class,
            MusicSeeder::class,
            BlogSeeder::class,
            // AlbumSeeder::class,
        ]);


        $this->command->info('Database seeding completed successfully!');
    }
}
