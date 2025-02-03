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
                        'file_url' => '/path/to/music/files/hey_jude.mp3',
                        'image_url' => '/path/to/music/images/hey_jude.jpg',
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
                        'file_url' => '/path/to/music/files/lose_yourself.mp3',
                        'image_url' => '/path/to/music/images/lose_yourself.jpg',
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
                            '01 Sorry 4 What LV BELT',
                            '02 Bad Bitches Wrk @ Taboo',
                            '03 Where 2 Start',
                            '04 Sex Songs',
                            '05 Hennessy Memories',
                            '06 Not Tricking Black Keys',
                            '07 Y.D.S Iggy DelDia',
                            "08 This Ain't Working",
                            '09 Hurting Me',
                            '10 Why Did I',
                            '11 No More Parties in LA',
                            '12 Anymore Fuck Boy Intentions',
                            '13 Red Casamigos',
                            '14 Understand',
                            '15 Casa-Freak-Hoes',
                            '16 Role Call (feat. A Boogie wit da Hoodie)',
                            '17 Rare L',
                            '18 Albany Bahamas',
                            '19 Collection (feat. Yoko Gold)',
                            '20 The Vent',
                        ],
                    ],
                ],
            ],
        ];

        foreach ($musicData as $artistName => $genres) {
            $artist = Artist::firstOrCreate(['name' => $artistName], [
                'bio' => 'Bio for ' . $artistName,
                'image_url' => '/path/to/artists/images/' . str_replace(' ', '_', strtolower($artistName)) . '.jpg',
            ]);

            foreach ($genres as $genreName => $albums) {
                $genre = Genre::firstOrCreate(['name' => $genreName], [
                    'description' => $genreName . ' music genre',
                ]);

                foreach ($albums as $albumInfo) {
                    if (isset($albumInfo['songs'])) {
                        // Create album
                        $album = Album::create([
                            'title' => $albumInfo['title'],
                            'artist_id' => $artist->id,
                            'genre_id' => $genre->id,
                            'original_filename' => "{$albumInfo['title']}.mp3",
                            'file_url' => "/path/to/albums/files/{$albumInfo['title']}.mp3",
                            'image_url' => "/path/to/albums/images/{$albumInfo['title']}.jpg",
                            'tracks' => count($albumInfo['songs']),
                            'is_published' => true,
                            'download_counts' => rand(1, 500),
                        ]);

                        // Create music for the album
                        foreach ($albumInfo['songs'] as $songTitle) {
                            $filename = str_replace([' ', '(', ')', '@', '-'], '_', $songTitle) . '.mp3';
                            Music::create([
                                'title' => $songTitle,
                                'artist_id' => $artist->id,
                                'genre_id' => $genre->id,
                                'album_id' => $album->id,
                                'file_url' => "/home/crock/Documents/projects/personal/laravel/music/public/uploads/albums/Tory Lanez - Sorry 4 What - (SongsLover.com)/{$filename}",
                                'image_url' => "/path/to/music/images/{$filename}.jpg",
                                'duration' => rand(180, 300),
                                'original_filename' => $filename,
                                'is_published' => true,
                                'download_counts' => rand(1, 500),
                            ]);
                        }
                    } else {
                        // Create individual music
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
