import React, { useState } from 'react';
import { User } from 'lucide-react';
import { motion } from 'framer-motion'; // Import motion from framer-motion
import GuestLayout from '@/Layouts/GuestLayout';
import { Link } from '@inertiajs/react';
import InfiniteScroll from 'react-infinite-scroll-component';

// Types
interface Blog {
    id: number;
    title: string;
    content: string;
    image_url: string;
    created_at: string;
}

interface BlogsPageProps {
    blogs: Blog[];
    total: number; // Total number of blogs (for infinite scroll pagination)
    page: number; // Current page (for infinite scroll pagination)
}

const BlogsPage: React.FC<BlogsPageProps> = ({ blogs, total, page }) => {
    const [filters, setFilters] = useState({
        search: '',
        category: '', // You can add a category filter here
    });

    const [displayedBlogs, setDisplayedBlogs] = useState<Blog[]>(blogs);

    // Simulate an API call to get more blogs
    const fetchMoreBlogs = async () => {
        // Logic to fetch more blogs (add API call here based on pagination)
        // Here I'm just adding more blogs for demonstration
        const moreBlogs = await fetch(`/api/blogs?page=${page + 1}&search=${filters.search}`)
            .then(res => res.json())
            .then(data => data.blogs);
        setDisplayedBlogs(prevBlogs => [...prevBlogs, ...moreBlogs]);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFilters({ ...filters, search: value });
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setFilters({ ...filters, category: value });
    };

    return (
        <GuestLayout title="Blogs">
            <div className="min-h-screen bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 from-gray-200 to-gray-100 text-white">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-6">Blogs</h1>

                    {/* Filters */}
                    <div className="flex justify-between mb-6">
                        <input
                            type="text"
                            value={filters.search}
                            onChange={handleSearchChange}
                            placeholder="Search Blogs"
                            className="w-full max-w-xs p-2 rounded-lg bg-gray-400/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-white"
                        />
                        <select
                            value={filters.category}
                            onChange={handleCategoryChange}
                            className="p-2 rounded-lg bg-gray-400/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-white ml-4"
                        >
                            <option value="">All Categories</option>
                            <option value="Tech">Tech</option>
                            <option value="Music">Music</option>
                            <option value="Lifestyle">Lifestyle</option>
                            {/* Add more categories as needed */}
                        </select>
                    </div>

                    {/* Infinite Scroll */}
                    <InfiniteScroll
                        dataLength={displayedBlogs.length}
                        next={fetchMoreBlogs}
                        hasMore={displayedBlogs.length < total} // Total blogs from server
                        loader={<p className="text-center text-gray-400">Loading more blogs...</p>}
                    >
                        {displayedBlogs.length ? (
                            <div className="grid gap-6 md:grid-cols-1">
                                {displayedBlogs.map((blog) => (
                                    <motion.div
                                        key={blog.id}
                                        className="bg-gray-400/50 dark:bg-gray-800/50 rounded-lg p-4 dark:hover:bg-gray-500/50 hover:bg-gray-700/50 transition-all duration-300"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <img
                                            src={blog.image_url}
                                            alt={blog.title}
                                            className="w-full h-48 object-cover rounded-lg mb-4"
                                        />
                                        <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                                        <p className="text-gray-400">{blog.content.slice(0, 100)}...</p>
                                        <Link
                                            href={`/blogs/${blog.id}`}
                                            className="text-blue-500 hover:text-blue-400"
                                        >
                                            Read more
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-800/50 rounded-lg p-8 text-center text-gray-400">
                                <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">No blogs found.</p>
                            </div>
                        )}
                    </InfiniteScroll>
                </div>
            </div>
        </GuestLayout>
    );
};

export default BlogsPage;
