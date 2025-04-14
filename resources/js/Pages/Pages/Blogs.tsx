import React, { useState } from 'react';
import { Cpu, Heart, List, MessageCircleMore, Music, User } from 'lucide-react';
import { motion } from 'framer-motion';
import GuestLayout from '@/Layouts/GuestLayout';
import { Link } from '@inertiajs/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import ReactionButton from '@/Components/ReactionButton';
import useTypedPage from '@/Hooks/useTypedPage';
import CommentSection from '@/Components/CommentSection'; // Import the CommentSection

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
}

const BlogsPage: React.FC<BlogsPageProps> = ({ blogs, total }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '', // You can add a category filter here
  });
  const [latestComment, setLatestComment] = useState<any | null>(null);
  const [displayedBlogs, setDisplayedBlogs] = useState<Blog[]>(blogs);
  const page = useTypedPage();
  const user = page.props.auth.user;
  const spring = {
    type: 'spring',
    stiffness: 500,
    damping: 30,
  };

  const categoryIcons: Record<string, JSX.Element> = {
    All: <List className="w-4 h-4 mr-1" />,
    Tech: <Cpu className="w-4 h-4 mr-1" />,
    Music: <Music className="w-4 h-4 mr-1" />,
    Lifestyle: <Heart className="w-4 h-4 mr-1" />,
  };
  // Simulate an API call to get more blogs
  const fetchMoreBlogs = async () => {
    const moreBlogs = await fetch(`/get_blogs?page=search=${filters.search}`)
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
          <h1 className="text-3xl font-bold mb-6">Celebrity News & Gist</h1>

          {/* Filters with animated bubble */}
          <div className="relative flex flex-wrap gap-2 mb-6">
            {['All', 'Tech', 'Music', 'Lifestyle'].map(category => {
              const isActive =
                filters.category === (category === 'All' ? '' : category);

              return (
                <motion.button
                  key={category}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      category: category === 'All' ? '' : category,
                    })
                  }
                  whileTap={{ scale: 0.95 }}
                  transition={spring}
                  className="relative overflow-hidden px-4 py-2 rounded-full text-sm font-medium border 
          flex items-center z-10"
                  style={{
                    borderColor: isActive
                      ? 'rgb(59, 130, 246)' // blue-500
                      : 'var(--tw-border-opacity)',
                    color: isActive ? 'white' : '',
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="bubble"
                      transition={spring}
                      className="absolute inset-0 z-[-1] bg-blue-500 rounded-full"
                    />
                  )}
                  {categoryIcons[category]}
                  <span
                    className={
                      isActive ? 'text-white' : 'text-gray-600 dark:text-white'
                    }
                  >
                    {category}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Infinite Scroll */}
          <InfiniteScroll
            dataLength={displayedBlogs.length}
            next={fetchMoreBlogs}
            hasMore={displayedBlogs.length < total}
            loader={
              <p className="text-center text-gray-400">Loading more blogs...</p>
            }
          >
            {displayedBlogs.length ? (
              <div className="grid gap-6 md:grid-cols-1">
                {displayedBlogs.map(blog => (
                  <motion.div
                    key={blog.id}
                    className="bg-gray-100 dark:bg-gray-800 border border-gray-400/50 dark:border-gray-600 rounded-lg transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <img
                      src={`/storage/${blog.image_url}`}
                      alt={blog.title}
                      className="w-full h-48 object-cover rounded-t mb-4"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-400">
                        {blog.content.slice(0, 100)}...
                      </p>

                      <div className="flex items-center gap-1 mt-4">
                        <ReactionButton
                          blogId={blog.id}
                          initialCounts={blog.reaction_counts}
                          initialReaction={blog.user_reaction}
                        />
                        <button
                          onClick={() => openCommentSheet(blog.id)}
                          className="text-sm text-blue-500 hover:text-blue-400"
                        >
                          <MessageCircleMore className="w-5 h-5 inline-block mr-1" />
                          {blog.comments_count}
                        </button>
                      </div>
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

          {/* Render Comment Section */}
          <CommentSection
            activeBlogId={activeBlogId}
            closeCommentSheet={closeCommentSheet}
            latestComment={latestComment}
            setLatestComment={setLatestComment}
            user={user}
            handleDragEnd={handleDragEnd}
          />
        </div>
      </div>
    </GuestLayout>
  );
};

export default BlogsPage;
