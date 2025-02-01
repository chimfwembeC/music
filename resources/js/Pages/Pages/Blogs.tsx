import React from 'react';
import { User } from 'lucide-react';
import { motion } from 'framer-motion'; // Import motion from framer-motion
import GuestLayout from '@/Layouts/GuestLayout';
import { Link } from '@inertiajs/react';

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
}

const BlogsPage: React.FC<BlogsPageProps> = ({ blogs }) => {
    return (
        <GuestLayout title="Blogs">
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-6">Blogs</h1>

                    {blogs.length ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {blogs.map((blog) => (
                                // Using Framer Motion for animation on the blog item
                                <motion.div
                                    key={blog.id}
                                    className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-700/50 transition-all duration-300"
                                    initial={{ opacity: 0, y: 20 }} // Start with opacity 0 and slide from below
                                    animate={{ opacity: 1, y: 0 }} // Animate to full opacity and normal position
                                    transition={{ duration: 0.5 }} // Animation duration
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
                </div>
            </div>
        </GuestLayout>
    );
};

export default BlogsPage;
