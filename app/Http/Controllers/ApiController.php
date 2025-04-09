<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Blog;
class ApiController extends Controller
{
    public function getLatestBlogs()
    {
        // Get all blogs, optionally you can paginate the results
        $blogs = Blog::with('author')->latest()->limit(4)->get();
        return response()->json([
            'status' => 'success',
            'data' => $blogs,
        ]);
    }

}
