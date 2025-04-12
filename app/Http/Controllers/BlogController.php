<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Get all blogs, optionally you can paginate the results
        $blogs = Blog::with('author')->get();
        return Inertia::render('Blog/Index', [
            'blogs' => $blogs,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Show form for creating a new blog
        return Inertia::render('Blog/Create');
    }


    public function togglePublish(Request $request, $id)
    {
        $request->validate([
            'is_published' => 'required|boolean',
        ]);
    
        $music = Blog::findOrFail($id);
        $music->is_published = $request->boolean('is_published');
        $music->save();
    
        return back()->with('message', 'blog publish status updated.');
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            // 'author_id' => 'required|exists:users,id',
            'image_url' => 'nullable|image|max:2048', // Optional image with a size limit
            'is_published' => 'sometimes|boolean',
        ]);

        $isPublished = $request->boolean('is_published');

        // Handle the image upload
        $image_url = $request->hasFile('image_url') ? $request->file('image_url')->store('blog_images','public') : null;

        // Store the blog record
        Blog::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'author_id' => auth()->Id(),
            'is_published' => $isPublished,
            'image_url' => $image_url,
        ]);

        return redirect()->route('blogs.index')->with('success', 'Blog created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Blog $blog)
    {
        // Show the blog details, including the author
        return Inertia::render('Blog/Show', [
            'blog' => $blog->load('author'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Blog $blog)
    {
        // Show the form to edit an existing blog
        return Inertia::render('Blog/Edit', [
            'blog' => $blog,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Blog $blog)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            // 'author_id' => 'required|exists:users,id',
            'image_url' => 'nullable|image|max:2048',
            'is_published' => 'sometimes|boolean'
        ]);

        // Handle the image upload if a new image is provided
        if ($request->hasFile('image_url')) {
            // Delete old image if a new one is uploaded
            // Storage::delete($blog->image_url);
            // Store the new image
            $image_url = $request->file('image_url')->store('blog_images','public');
        } else {
            $image_url = $blog->image_url;
        }

        $isPublished = $request->boolean('is_published');


        // Update the blog record
        $blog->update([
            'title' => $validated['title'],
            'content' => $validated['content'],
            // 'author_id' => $validated['author_id'],
            'is_published' => $isPublished,
            'image_url' => $image_url,
        ]);

        return redirect()->route('blogs.index')->with('success', 'Blog updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Blog $blog)
    {
        // Delete the image if exists
        if ($blog->image_url) {
            Storage::delete($blog->image_url);
        }

        // Delete the blog record
        $blog->delete();

        return redirect()->route('blogs.index')->with('success', 'Blog deleted successfully.');
    }
}
