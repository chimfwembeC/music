import React, { useState } from 'react';
import { MessageCircleMore, User } from 'lucide-react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import GuestLayout from '@/Layouts/GuestLayout';
import { Link } from '@inertiajs/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import ReactionButton from '@/Components/ReactionButton';
import CommentForm from '@/Components/CommentForm';
import CommentList from '@/Components/CommentList';

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
  const [latestComment, setLatestComment] = useState<any | null>(null);
  const [displayedBlogs, setDisplayedBlogs] = useState<Blog[]>(blogs);

  // Simulate an API call to get more blogs
  const fetchMoreBlogs = async () => {
    const moreBlogs = await fetch(
      `/api/blogs?page=${page + 1}&search=${filters.search}`,
    )
      .then((res) => res.json())
      .then((data) => data.blogs);
    setDisplayedBlogs((prevBlogs) => [...prevBlogs, ...moreBlogs]);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFilters({ ...filters, search: value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFilters({ ...filters, category: value });
  };

  const [comments, setComments] = useState<any[]>([]);
  const [activeBlogId, setActiveBlogId] = useState<number | null>(null);

  const openCommentSheet = (id: number) => setActiveBlogId(id);
  const closeCommentSheet = () => setActiveBlogId(null);

  // Handle drag end on the sheet - if dragged down more than threshold, close it
  const handleDragEnd = (event: MouseEvent | TouchEvent, info: PanInfo) => {
    if (info.offset.y > 100) {
      closeCommentSheet();
    }
  };

  return (
    <GuestLayout title="Blogs">
      <div className="min-h-screen bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 from-gray-200 to-gray-100 dark:text-white text-gray-600">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Blogs</h1>

          {/* Filters */}
          <div className="flex justify-between mb-6">
            <input
              type="text"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search Blogs"
              className="w-full max-w-xs p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-white"
            />
            <select
              value={filters.category}
              onChange={handleCategoryChange}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-white ml-4"
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
            hasMore={displayedBlogs.length < total}
            loader={<p className="text-center text-gray-400">Loading more blogs...</p>}
          >
            {displayedBlogs.length ? (
              <div className="grid gap-6 md:grid-cols-1">
                {displayedBlogs.map((blog) => (
                  <motion.div
                    key={blog.id}
                    className="bg-gray-100 dark:bg-gray-800 border border-gray-400/50 dark:border-gray-600 rounded-lg p-4 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <img
                      src={`/storage/${blog.image_url}`}
                      alt={blog.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                    <p className="text-gray-400">{blog.content.slice(0, 100)}...</p>
                    {/* Blog card bottom actions */}
                    <div className="flex items-center justify-between mt-4">
                      <ReactionButton blogId={blog.id} />
                      <button
                        onClick={() => openCommentSheet(blog.id)}
                        className="text-sm text-blue-500 hover:text-blue-400"
                      >
                        <MessageCircleMore className="w-6 h-6 inline-block mr-1" />
                        {/* {blog.comments_count} Comments */}
                      </button>
                    </div>
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

          {/* Bottom Sheet for Comments */}
          <AnimatePresence>
            {activeBlogId !== null && (
              <motion.div
                className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeCommentSheet} // click backdrop to close
              >
                {/* Prevent clicks from closing when interacting with the sheet */}
                <motion.div
                  className="bg-white dark:bg-gray-900 w-full rounded-t-2xl p-4 h-[80vh] overflow-y-auto"
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  onDragEnd={handleDragEnd}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Comments</h2>
                    <button
                      onClick={closeCommentSheet}
                      className="text-gray-500 hover:text-red-500"
                    >
                      Close
                    </button>
                  </div>
                  <CommentForm
  blogId={activeBlogId}
  onNewComment={(comment) => setLatestComment(comment)}
/>

<CommentList blogId={activeBlogId} newComment={latestComment} />
                  {/* <div className="mt-4">
                    <CommentList blogId={activeBlogId} />
                  </div> */}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </GuestLayout>
  );
};

export default BlogsPage;
