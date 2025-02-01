<?php

namespace Database\Seeders;

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
        User::truncate();

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Seed Users
        $user = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);

        // Seed Genres
        $genreData = [
            'Rock' => 'Classic and alternative rock music.',
            'Pop' => 'Popular mainstream music.',
            'Hip-Hop' => 'Rap and hip-hop culture music.',
            'Jazz' => 'Smooth and instrumental jazz.',
            'Electronic' => 'EDM, house, and techno music.',
        ];

        $genres = [];
        foreach ($genreData as $name => $description) {
            $genres[$name] = Genre::create([
                'name' => $name,
                'description' => $description,
            ]);
        }

        // Seed Artists and Their Music
        $artistsData = [
            'The Beatles' => [
                'bio' => 'Legendary rock band from Liverpool.',
                'image_url' => 'https://example.com/beatles.jpg',
                'songs' => ['Hey Jude', 'Let It Be', 'Yesterday'],
                'genre' => 'Rock',
            ],
            'Eminem' => [
                'bio' => 'Iconic rapper from Detroit.',
                'image_url' => 'https://example.com/eminem.jpg',
                'songs' => ['Lose Yourself', 'Stan', 'Without Me'],
                'genre' => 'Hip-Hop',
            ],
            'Daft Punk' => [
                'bio' => 'Pioneers of electronic music.',
                'image_url' => 'https://example.com/daftpunk.jpg',
                'songs' => ['Get Lucky', 'One More Time', 'Harder, Better, Faster, Stronger'],
                'genre' => 'Electronic',
            ],
            'Miles Davis' => [
                'bio' => 'Legendary jazz musician.',
                'image_url' => 'https://example.com/milesdavis.jpg',
                'songs' => ['So What', 'Blue in Green', 'Freddie Freeloader'],
                'genre' => 'Jazz',
            ],
            'Taylor Swift' => [
                'bio' => 'Pop music icon.',
                'image_url' => 'https://example.com/taylorswift.jpg',
                'songs' => ['Love Story', 'Blank Space', 'Shake It Off'],
                'genre' => 'Pop',
            ],
        ];

        foreach ($artistsData as $artistName => $artistInfo) {
            $artist = Artist::create([
                'name' => $artistName,
                'bio' => $artistInfo['bio'],
                'image_url' => $artistInfo['image_url'],
            ]);

            foreach ($artistInfo['songs'] as $songTitle) {
                Music::create([
                    'title' => $songTitle,
                    'artist_id' => $artist->id,
                    'genre_id' => $genres[$artistInfo['genre']]->id,
                    'file_url' => "https://example.com/music/{$songTitle}.mp3",
                    'image_url' => "https://example.com/music/{$songTitle}.jpg",
                    'duration' => rand(180, 300),
                ]);
            }
        }

        // Seed Blogs Related to Music
        $blogPosts = [
            [
                'title' => 'The Evolution of Rock Music',
                'content' => 'Rock music has transformed from classic blues roots to modern alternative rock.',
                'image_url' => 'https://example.com/rock-blog.jpg',
            ],
            [
                'title' => 'Hip-Hop’s Influence on Modern Culture',
                'content' => 'From the streets of New York to global domination, hip-hop is a movement.',
                'image_url' => 'https://example.com/hiphop-blog.jpg',
            ],
            [
                'title' => 'Why Jazz Still Matters',
                'content' => 'Jazz remains one of the most influential genres in modern music composition.',
                'image_url' => 'https://example.com/jazz-blog.jpg',
            ],
            [
                'title' => 'How Electronic Music Took Over Festivals',
                'content' => 'The rise of EDM has reshaped the music industry worldwide.',
                'image_url' => 'https://example.com/edm-blog.jpg',
            ],
            [
                'title' => 'Pop Stars Who Changed the Game',
                'content' => 'From Madonna to Taylor Swift, pop stars redefine the industry with every album.',
                'image_url' => 'https://example.com/pop-blog.jpg',
            ],
        ];

        foreach ($blogPosts as $post) {
            Blog::create([
                'title' => $post['title'],
                'content' => $post['content'],
                'author_id' => $user->id,
                'image_url' => $post['image_url'],
            ]);
        }

        $this->command->info('Database seeding completed successfully!');
    }
}
