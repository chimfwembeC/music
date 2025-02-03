<?php

namespace Database\Seeders;

use App\Models\Album;
use App\Models\Artist;
use App\Models\Genre;
use Illuminate\Database\Seeder;

class AlbumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $albumData = [
            'The Beatles' => [
                'Rock' => [
                    [
                        'title' => 'Hey Jude',
                        'original_filename' => 'hey_jude.mp3',
                        'file_url' => '/path/to/albums/files/hey_jude.mp3',
                        'image_url' => '/path/to/albums/images/hey_jude.jpg',
                        'tracks' => 10,
                        'is_published' => true,
                        'download_counts' => rand(1, 500),
                    ],
                    [
                        'title' => 'Let It Be',
                        'original_filename' => 'let_it_be.mp3',
                        'file_url' => '/path/to/albums/files/let_it_be.mp3',
                        'image_url' => '/path/to/albums/images/let_it_be.jpg',
                        'tracks' => 12,
                        'is_published' => true,
                        'download_counts' => rand(1, 500),
                    ],
                    [
                        'title' => 'Yesterday',
                        'original_filename' => 'yesterday.mp3',
                        'file_url' => '/path/to/albums/files/yesterday.mp3',
                        'image_url' => '/path/to/albums/images/yesterday.jpg',
                        'tracks' => 11,
                        'is_published' => true,
                        'download_counts' => rand(1, 500),
                    ],
                ],
            ],
            'Eminem' => [
                'Hip-Hop' => [
                    [
                        'title' => 'The Eminem Show',
                        'original_filename' => 'the_eminem_show.mp3',
                        'file_url' => '/path/to/albums/files/the_eminem_show.mp3',
                        'image_url' => '/path/to/albums/images/the_eminem_show.jpg',
                        'tracks' => 20,
                        'is_published' => true,
                        'download_counts' => rand(1, 500),
                    ],
                    [
                        'title' => 'Encore',
                        'original_filename' => 'encore.mp3',
                        'file_url' => '/path/to/albums/files/encore.mp3',
                        'image_url' => '/path/to/albums/images/encore.jpg',
                        'tracks' => 18,
                        'is_published' => true,
                        'download_counts' => rand(1, 500),
                    ],
                    [
                        'title' => 'Recovery',
                        'original_filename' => 'recovery.mp3',
                        'file_url' => '/path/to/albums/files/recovery.mp3',
                        'image_url' => '/path/to/albums/images/recovery.jpg',
                        'tracks' => 17,
                        'is_published' => true,
                        'download_counts' => rand(1, 500),
                    ],
                ],
            ],
            'Daft Punk' => [
                'Electronic' => [
                    [
                        'title' => 'Homework',
                        'original_filename' => 'homework.mp3',
                        'file_url' => '/path/to/albums/files/homework.mp3',
                        'image_url' => '/path/to/albums/images/homework.jpg',
                        'tracks' => 16,
                        'is_published' => true,
                        'download_counts' => rand(1, 500),
                    ],
                    [
                        'title' => 'Discovery',
                        'original_filename' => 'discovery.mp3',
                        'file_url' => '/path/to/albums/files/discovery.mp3',
                        'image_url' => '/path/to/albums/images/discovery.jpg',
                        'tracks' => 14,
                        'is_published' => true,
                        'download_counts' => rand(1, 500),
                    ],
                    [
                        'title' => 'Random Access Memories',
                        'original_filename' => 'random_access_memories.mp3',
                        'file_url' => '/path/to/albums/files/random_access_memories.mp3',
                        'image_url' => '/path/to/albums/images/random_access_memories.jpg',
                        'tracks' => 13,
                        'is_published' => true,
                        'download_counts' => rand(1, 500),
                    ],
                ],
            ],
            'Miles Davis' => [
                'Jazz' => [
                    [
                        'title' => 'Kind of Blue',
                        'original_filename' => 'kind_of_blue.mp3',
                        'file_url' => '/path/to/albums/files/kind_of_blue.mp3',
                        'image_url' => '/path/to/albums/images/kind_of_blue.jpg',
                        'tracks' => 9,
                        'is_published' => true,
                        'download_counts' => rand(1, 500),
                    ],
                    [
                        'title' => 'Bitches Brew',
                        'original_filename' => 'bitches_brew.mp3',
                        'file_url' => '/path/to/albums/files/bitches_brew.mp3',
                        'image_url' => '/path/to/albums/images/bitches_brew.jpg',
                        'tracks' => 8,
                        'is_published' => true,
                        'download_counts' => rand(1, 500),
                    ],
                    [
                        'title' => 'In a Silent Way',
                        'original_filename' => 'in_a_silent_way.mp3',
                        'file_url' => '/path/to/albums/files/in_a_silent_way.mp3',
                        'image_url' => '/path/to/albums/images/in_a_silent_way.jpg',
                        'tracks' => 7,
                        'is_published' => true,
                        'download_counts' => rand(1, 500),
                    ],
                ],
            ],
            'Taylor Swift' => [
                'Pop' => [
                    [
                        'title' => 'Fearless',
                        'original_filename' => 'fearless.mp3',
                        'file_url' => '/path/to/albums/files/fearless.mp3',
                        'image_url' => '/path/to/albums/images/fearless.jpg',
                        'tracks' => 13,
                        'is_published' => true,
                        'download_counts' => rand(1, 500),
                    ],
                    [
                        'title' => '1989',
                        'original_filename' => '1989.mp3',
                        'file_url' => '/path/to/albums/files/1989.mp3',
                        'image_url' => '/path/to/albums/images/1989.jpg',
                        'tracks' => 16,
                        'is_published' => true,
                        'download_counts' => rand(1, 500),
                    ],
                    [
                        'title' => 'Reputation',
                        'original_filename' => 'reputation.mp3',
                        'file_url' => '/path/to/albums/files/reputation.mp3',
                        'image_url' => '/path/to/albums/images/reputation.jpg',
                        'tracks' => 15,
                        'is_published' => true,
                        'download_counts' => rand(1, 500),
                    ],
                ],
            ],
            'Tory Lanez' => [
                'Hip-Hop' => [
                    [
                        'title' => 'Sorry 4 What',
                        'original_filename' => 'sorry_4_what.mp3',
                        'file_url' => '/home/crock/Documents/projects/personal/laravel/music/public/uploads/albums/Tory Lanez - Sorry 4 What - (SongsLover.com)/sorry_4_what.mp3',
                        'image_url' => '/path/to/albums/images/sorry_4_what.jpg',
                        'tracks' => 20,
                        'is_published' => true,
                        'download_counts' => rand(1, 500),
                    ],
                ],
            ],
        ];

        foreach ($albumData as $artistName => $genres) {
            $artist = Artist::where('name', $artistName)->first();
            foreach ($genres as $genreName => $albums) {
                $genre = Genre::where('name', $genreName)->first();
                foreach ($albums as $albumInfo) {
                    Album::create([
                        'title' => $albumInfo['title'],
                        'artist_id' => $artist->id,
                        'genre_id' => $genre->id,
                        'original_filename' => $albumInfo['original_filename'],
                        'file_url' => $albumInfo['file_url'],
                        'image_url' => $albumInfo['image_url'],
                        'tracks' => $albumInfo['tracks'],
                        'is_published' => $albumInfo['is_published'],
                        'download_counts' => $albumInfo['download_counts'],
                    ]);
                }
            }
        }
    }
}
