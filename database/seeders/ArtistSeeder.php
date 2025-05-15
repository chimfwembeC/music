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
            'Tory Lanez' => [
                'bio' => 'Bio for Tory Lanez.',
                'image_url' => '/uploads/artists/imgs/Tory Lanez.jpg',
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
