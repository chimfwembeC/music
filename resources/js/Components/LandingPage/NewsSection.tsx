import React, { useState, useEffect } from 'react';
import { Clock, User } from 'lucide-react'; // Import Lucid Icons
import axios from 'axios';
import { Link } from '@inertiajs/react';

interface Blog {
  id: number;
  title: string;
  content: string;
  author_name: string;
  author_image: string;
  image_url: string;
  date: string;
}

export default function NewsSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch data from an API endpoint (replace with your actual API)
  useEffect(() => {
    axios
      .get('/api/get-blogs') // Replace with your actual API endpoint
      .then(response => {
        setBlogs(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching blogs:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-purple-500 mb-2">
        Celebrity News & Gists
      </h2>
      <p className="text-sm text-start text-gray-800 dark:text-gray-400">
        Stay updated with the latest celebrity news, gossip, and trends. From
        red carpet events to behind-the-scenes stories, we've got you covered!
      </p>

      <div className="w-full h-24 relative mt-4">
        <img
          src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80"
          alt="Celebrity News"
          className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-semibold">
          Celebrity News
        </div>
      </div>

      <div className="border border-purple-800 mt-4"></div>

      {/* News Loop - Render blogs */}
      <div className="h-96 overflow-y-auto mt-4 border border-purple-800">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          blogs?.map(blog => (
            <div
              key={blog.id}
              className=" items-center justify-between p-4 border-b border-purple-800"
            >
              <div className="flex justify-between gap-3">
                <img
                  src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80"
                  //   src={blog.author_image || 'https://via.placeholder.com/150'}
                  alt={blog.author_name}
                  className="w-full h-48"
                />
              </div>
              <h3 className="text-md font-semibold text-gray-800 dark:text-purple-600">
                {blog.title}
              </h3>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {blog.content.substring(0, 100)}...
                </p>
              </div>
              <div className="flex items-center text-gray-500 mt-1">
                <Clock className="mr-2 h-4 w-4" /> {/* Lucid Icon */}
                <span className="text-sm">
                  {new Date(blog.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex justify-end text-sm font-bold text-purple-500 mt-1">
        <Link href={`/blogs`}>See More</Link>
      </div>
    </div>
  );
}
