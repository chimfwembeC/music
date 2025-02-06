<?php

namespace Database\Seeders;

use App\Models\Music;
use App\Models\Artist;
use App\Models\Genre;
use App\Models\Album;
use Illuminate\Database\Seeder;

class MusicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $musicData = [
            'The Beatles' => [
                'Rock' => [
                    [
                        'title' => 'Hey Jude',
                        'original_filename' => 'hey_jude.mp3',
                        // Update these paths to point to storage instead of public
                        'file_url' => 'storage/path/to/music/files/hey_jude.mp3',
                        'image_url' => 'storage/path/to/music/images/hey_jude.jpg',
                        'duration' => rand(180, 300),
                        'is_published' => true,
                        'download_counts' => rand(1, 500),
                    ],
                    // other songs...
                ],
            ],
            'Eminem' => [
                'Hip-Hop' => [
                    [
                        'title' => 'Lose Yourself',
                        'original_filename' => 'lose_yourself.mp3',
                        'file_url' => 'storage/path/to/music/files/lose_yourself.mp3',
                        'image_url' => 'storage/path/to/music/images/lose_yourself.jpg',
                        'duration' => rand(180, 300),
                        'is_published' => true,
                        'download_counts' => rand(1, 500),
                    ],
                    // other songs...
                ],
            ],
            // other artists...

            // Tory Lanez - Sorry 4 What album
            'Tory Lanez' => [
                'Pop' => [
                    [
                        'title' => 'Sorry 4 What',
                        'songs' => [
                            '01 Sorry 4 What LV BELT - (SongsLover.com)',
                            '02 Bad Bitches Wrk @ Taboo - (SongsLover.com)',
                        ],
                    ],
                ],
            ],
        ];

        foreach ($musicData as $artistName => $genres) {
            $artist = Artist::firstOrCreate(['name' => $artistName], [
                'bio' => 'Bio for ' . $artistName,
                // Update artist image path
                'image_url' => '/storage/path/to/artists/images/' . str_replace(' ', '_', strtolower($artistName)) . '.jpg',
            ]);

            foreach ($genres as $genreName => $albums) {
                $genre = Genre::firstOrCreate(['name' => $genreName], [
                    'description' => $genreName . ' music genre',
                ]);

                foreach ($albums as $albumInfo) {
                    if (isset($albumInfo['songs'])) {
                        // Create album using storage path for image
                        $album = Album::create([
                            'title' => $albumInfo['title'],
                            'artist_id' => $artist->id,
                            'genre_id' => $genre->id,
                            'image_url' => "/storage/uploads/albums/Sorry 4 What/Tory Lanez - PLAYBOY.jpg",
                            'is_published' => true,
                            'download_counts' => rand(1, 500),
                        ]);

                        // Create music for the album
                        foreach ($albumInfo['songs'] as $songTitle) {
                            // $filename = str_replace([' ', '(', ')', '@', '-'], '_', $songTitle) . '.mp3';
                            $filename =  $songTitle . '.mp3';

                            Music::create([
                                'title' => $songTitle,
                                'artist_id' => $artist->id,
                                'genre_id' => $genre->id,
                                'album_id' => $album->id,
                                // File path now points to storage
                                'file_url' => "/storage/uploads/albums/Sorry 4 What/{$filename}",
                                'image_url' => "/storage/uploads/albums/Sorry 4 What/Tory Lanez - PLAYBOY.jpg",
                                'duration' => rand(180, 300),
                                'original_filename' => $filename,
                                'is_published' => true,
                                'download_counts' => rand(1, 500),
                            ]);
                        }
                    } else {
                        // Create individual music, ensuring the file paths point to storage.
                        Music::create([
                            'title' => $albumInfo['title'],
                            'artist_id' => $artist->id,
                            'genre_id' => $genre->id,
                            'file_url' => $albumInfo['file_url'],
                            'image_url' => $albumInfo['image_url'],
                            'duration' => $albumInfo['duration'],
                            'original_filename' => $albumInfo['original_filename'],
                            'is_published' => $albumInfo['is_published'],
                            'download_counts' => $albumInfo['download_counts'],
                        ]);
                    }
                }
            }
        }
    }
}
