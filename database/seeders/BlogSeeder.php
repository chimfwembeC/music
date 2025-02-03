<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Blog;
use App\Models\User;
use Faker\Factory as Faker;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();

        // Create 10 blog posts
        foreach (range(1, 10) as $index) {
            Blog::create([
                'title' => $faker->sentence(),
                'content' => $faker->paragraph(),
                'author_id' => User::inRandomOrder()->first()->id, // Random user as author
                'image_url' => $faker->imageUrl(800, 600, 'business', true), // Random image URL
            ]);
        }
    }
}
