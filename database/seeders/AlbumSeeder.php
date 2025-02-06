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
            'Tory Lanez' => [
                'Hip-Hop' => [
                    [
                        'title' => 'Sorry 4 What',
                        'image_url' => '/uploads/albums/Tory Lanez - Sorry 4 What - (SongsLover.com)/Tory Lanez - PLAYBOY.jpg',
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
                        'image_url' => $albumInfo['image_url'],
                        'is_published' => $albumInfo['is_published'],
                        'download_counts' => $albumInfo['download_counts'],
                    ]);
                }
            }
        }
    }
}
