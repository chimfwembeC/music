<?php

namespace Database\Seeders;

use App\Models\Genre;
use Illuminate\Database\Seeder;

class GenreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $genreData = [
            'Rock' => 'Classic and alternative rock music.',
            'Pop' => 'Popular mainstream music.',
            'Hip-Hop' => 'Rap and hip-hop culture music.',
            'Jazz' => 'Smooth and instrumental jazz.',
            'Electronic' => 'EDM, house, and techno music.',
        ];

        foreach ($genreData as $name => $description) {
            Genre::create([
                'name' => $name,
                'description' => $description,
            ]);
        }
    }
}
