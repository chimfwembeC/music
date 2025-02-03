<?php

namespace Database\Seeders;

use App\Models\Artist;
use Illuminate\Database\Seeder;

class ArtistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $artistsData = [
            'The Beatles' => [
                'bio' => 'Legendary rock band from Liverpool.',
                'image_url' => 'https://example.com/beatles.jpg',
            ],
            'Eminem' => [
                'bio' => 'Iconic rapper from Detroit.',
                'image_url' => 'https://example.com/eminem.jpg',
            ],
            'Daft Punk' => [
                'bio' => 'Pioneers of electronic music.',
                'image_url' => 'https://example.com/daftpunk.jpg',
            ],
            'Miles Davis' => [
                'bio' => 'Legendary jazz musician.',
                'image_url' => 'https://example.com/milesdavis.jpg',
            ],
            'Taylor Swift' => [
                'bio' => 'Pop music icon.',
                'image_url' => 'https://example.com/taylorswift.jpg',
            ],
        ];

        foreach ($artistsData as $name => $info) {
            Artist::create([
                'name' => $name,
                'bio' => $info['bio'],
                'image_url' => $info['image_url'],
            ]);
        }
    }
}
