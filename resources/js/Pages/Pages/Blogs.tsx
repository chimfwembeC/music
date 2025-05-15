import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Heart,
  List,
  MessageCircle,
  MessageCircleMore,
  Music,
  Pencil,
  Save,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GuestLayout from '@/Layouts/GuestLayout';
import { Link } from '@inertiajs/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import ReactionButton from '@/Components/ReactionButton';
import useTypedPage from '@/Hooks/useTypedPage';
import CommentSection from '@/Components/CommentSection'; // Import the CommentSection
import { Music as MusicData, User as user } from '@/types';
import BlogSkeleton from './BlogSkeleton';
import SectionBorder from '@/Components/SectionBorder';
import { CommentItem } from '@/Components/CommentItem';
import moment from 'moment';

// Types
interface UserReaction {
  user_name: string;
  avatar: string;
  reaction: string; // like "😂" or "❤️"
}

interface Comment {
  id: number;
  blog_id: string;
  content: string;
  user_id: string;
  user: user;
  created_at: string;
}

interface Blog {
  id: number;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
  user_reactions: UserReaction[];
  reaction_counts: Record<string, number>;
  user_reaction: string | null;
  comments_count: number;
  comments: Comment;
}

interface BlogsPageProps {
  blogs: Blog[];
  total: number; // Total number of blogs (for infinite scroll pagination)
}

const musicData: MusicData[] = [
  {
    id: 1,
    title: 'Summer Breeze (Extended Mix)',
    slug: 'summer-breeze-extended-mix',
    artist_id: 1,
    genre_id: 1,
    album_id: 1,
    duration: 234,
    is_featured: true,
    file_url: 'https://example.com/music1.mp3',
    original_filename: 'summer_breeze.mp3',
    image_url:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80',
    download_counts: 1200,
    is_published: true,
    created_at: '2024-03-15',
    updated_at: '2024-03-15',
  },
  // ... other music data
];

const inlineAds = [
  {
    id: 1,
    text: '🛍️ Ad: Shop the latest streetwear drops!',
    link: 'https://example.com/streetwear',
    linkText: 'Shop Now',
    bgColor: 'bg-yellow-100 dark:bg-yellow-800',
    textColor: 'text-yellow-900 dark:text-yellow-100',
  },
  {
    id: 2,
    text: '🧠 Ad: Get the newest CPUs and GPUs for less!',
    link: 'https://example.com/hardware-deals',
    linkText: 'Upgrade Your Rig',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900',
    textColor: 'text-indigo-800 dark:text-indigo-200',
  },
  {
    id: 3,
    text: '🔞 Ad: Find local matches near you 😘',
    link: 'https://example.com/adult-dating',
    linkText: 'Start Chatting',
    bgColor: 'bg-red-100 dark:bg-red-800',
    textColor: 'text-red-800 dark:text-red-200',
  },
  {
    id: 4,
    text: '📱 Ad: Hot smartphone deals today only!',
    link: 'https://example.com/phones',
    linkText: 'See Offers',
    bgColor: 'bg-blue-100 dark:bg-blue-800',
    textColor: 'text-blue-800 dark:text-blue-200',
  },
  {
    id: 5,
    text: '🪙 Ad: Invest in crypto the smart way.',
    link: 'https://example.com/crypto',
    linkText: 'Learn More',
    bgColor: 'bg-gray-200 dark:bg-gray-700',
    textColor: 'text-gray-900 dark:text-gray-100',
  },
];

const sidebarAds = [
  {
    id: 101,
    color: 'bg-red-100 dark:bg-red-700',
    text: '🎮 Try the #1 gaming platform of 2025!',
    link: 'https://example.com/gaming',
    linkText: 'Play Now',
  },
  {
    id: 102,
    color: 'bg-yellow-100 dark:bg-yellow-700',
    text: '👜 Explore next-gen fashion accessories',
    link: 'https://example.com/fashion',
    linkText: 'See Styles',
  },
  {
    id: 103,
    color: 'bg-purple-100 dark:bg-purple-700',
    text: '📚 Learn coding interactively — free trial!',
    link: 'https://example.com/learn-to-code',
    linkText: 'Enroll Today',
  },
];

const emojiMap: Record<string, string> = {
  like: '👍',
  love: '❤️',
  haha: '😂',
  wow: '😮',
  sad: '😢',
  angry: '😡',
};

const BlogsPage: React.FC<BlogsPageProps> = ({
  blogs,
  total,
  music = musicData,
}) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
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

  // console.log('blogs', displayedBlogs);
  const age = 18;
  const isUserAdult = age >= 18;
  const filteredAds = inlineAds.filter(ad => {
    if (ad.id === 3 && !isUserAdult) return false;
    return true;
  });

  // Get removed ad IDs from sessionStorage
  const [removedAdIds, setRemovedAdIds] = useState<number[]>(() => {
    const saved = sessionStorage.getItem('removedAds');
    return saved ? JSON.parse(saved) : [];
  });

  // Remove an ad and update sessionStorage
  const handleRemoveAd = (adId: number) => {
    const updated = [...removedAdIds, adId];
    setRemovedAdIds(updated);
    sessionStorage.setItem('removedAds', JSON.stringify(updated));
  };

  // Generate random ad positions on mount or when blogs change
  const [adPositions, setAdPositions] = useState<number[]>([]);
  useEffect(() => {
    const positions: number[] = [];
    displayedBlogs.forEach((_, index) => {
      // 20% chance to inject an ad after this blog
      if (Math.random() < 0.2) {
        positions.push(index);
      }
    });
    setAdPositions(positions);
  }, [displayedBlogs]);

  const categoryIcons: Record<string, JSX.Element> = {
    All: <List className="w-4 h-4 mr-1" />,
    Tech: <Cpu className="w-4 h-4 mr-1" />,
    Music: <Music className="w-4 h-4 mr-1" />,
    Lifestyle: <Heart className="w-4 h-4 mr-1" />,
  };

  // Simulate an API call to get more blogs
  const [pageNumber, setPageNumber] = useState(2);
  const fetchMoreBlogs = async () => {
    const res = await fetch(
      `/get_blogs?search=${filters.search}&page=${pageNumber}`,
    );
    const data = await res.json();
    setDisplayedBlogs(prev => [...prev, ...data.blogs]);
    setPageNumber(prev => prev + 1);
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

  const handleDragEnd = (event: MouseEvent | TouchEvent, info: any) => {
    if (info.offset.y > 100) {
      closeCommentSheet();
    }
  };

  const trendingMusic = [...music]
    .filter(m => m.is_published)
    .sort((a, b) => b.download_counts - a.download_counts)
    .slice(0, 3);

  // console.log('blogs', displayedBlogs?.comments?.[0].user.name);
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
                  className="relative overflow-hidden px-4 py-2 rounded-full text-sm font-medium border flex items-center z-10"
                  style={{
                    borderColor: isActive
                      ? 'rgb(59, 130, 246)'
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

          <div className="grid grid-cols-1 md:grid-cols-5 max-w-5xl m-auto gap-8">
            {/* first col span */}
            <div className="col-span-1 hidden lg:block space-y-4 p-4 sticky top-24 self-start">
              <div className="">
                <div className="text-xl font-bold text-gray-800 dark:text-purple-500 mb-2">
                  Download App
                </div>
                <div className="bg-gray-400/50 dark:bg-purple-800 p-4 border-b-4 border-gray-400/50 dark:border-purple-500 space-y-2 mb-6">
                  <div className="flex justify-center">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?data=https://yourapp.com&size=150x150"
                      alt="QR Code"
                      className="w-36 h-36"
                    />
                  </div>
                </div>
              </div>

              {/* Trending Music */}
              <div className="col-span-1">
                <h2 className="text-xl font-bold text-gray-800 dark:text-purple-500 mb-2">
                  Trending Music
                </h2>
                <div className="bg-gray-400/50 dark:bg-purple-800 p-4 border-b-4 border-gray-400/50 dark:border-purple-500 space-y-2">
                  {trendingMusic.map(track => (
                    <div
                      key={track.id}
                      className="hover:underline dark:text-white"
                    >
                      <Link href={`/music/${track.slug}`}>{track.title}</Link>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-200 dark:bg-yellow-500/20 p-4 rounded-lg text-center font-semibold text-sm text-gray-800 dark:text-yellow-200 shadow mb-6">
                📢 Sponsored: Check out the hottest gadgets of 2025!
                <a
                  href="https://example.com/ad-link"
                  className="text-blue-600 underline block mt-2"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* main center col-span */}
            <div className="col-span-3">
              <InfiniteScroll
                dataLength={displayedBlogs.length}
                next={fetchMoreBlogs}
                hasMore={displayedBlogs.length < total}
                loader={
                  <div>
                    {[...Array(3)].map((_, i) => (
                      <BlogSkeleton key={i} />
                    ))}
                  </div>
                }
              >
                {displayedBlogs.length ? (
                  <div className="">
                    {displayedBlogs.map((blog, index) => (
                      <React.Fragment key={blog.id}>
                        <motion.div
                          key={blog.id}
                          className="bg-gray-100 dark:bg-gray-800 border border-gray-400/50 dark:border-purple-800 rounded-lg transition-all duration-300 my-6"
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
                            <div className="flex justify-between items-center gap-1 mt-4">
                              <div className="flex items-center">
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

                              <div className="flex items-center -space-x-4">
                                {blog.user_reactions.map((reaction, index) => (
                                  <motion.div
                                    key={index}
                                    className="relative group"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{
                                      type: 'spring',
                                      stiffness: 300,
                                      damping: 20,
                                    }}
                                  >
                                    <img
                                      src={reaction?.avatar}
                                      alt={reaction?.user_name}
                                      className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                                    />
                                    {/* Emoji Badge */}
                                    <div className="absolute -bottom-1.5 -left-1.5 z-10 bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-md text-sm">
                                      {emojiMap[reaction?.reaction] ||
                                        reaction?.reaction}
                                    </div>
                                    {/* Tooltip */}
                                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 whitespace-nowrap">
                                      {reaction?.user_name} reacted with{' '}
                                      {reaction?.reaction}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                            {blog?.comments?.[0] && (
                              <>
                                <div className="border border-gray-400/50 dark:border-purple-800 -mx-4 my-4" />
                                <div className="text-sm font-bold mb-2">
                                  Latest Comments
                                </div>
                                <div className="bg-gray-400 dark:bg-gray-700 rounded p-4">
                                  <div>
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                      {blog?.comments?.[0]?.user.name}
                                      <span className="ml-2 text-xs text-gray-400">
                                        {moment(
                                          blog?.comments?.[0]?.created_at,
                                        ).fromNow()}
                                      </span>
                                    </p>
                                    <p className="mt-1 text-gray-800 dark:text-gray-200 text-sm">
                                      {blog.comments?.[0]?.content}
                                    </p>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </motion.div>

                        {/* Determine if an ad should be inserted at this index */}
                        {adPositions.includes(index) &&
                          (() => {
                            const ad =
                              filteredAds[
                                Math.floor(index / 4) % filteredAds.length
                              ];
                            if (removedAdIds.includes(ad.id)) return null;
                            return (
                              <div
                                className={`${ad.bgColor} relative rounded-lg shadow my-6`}
                              >
                                <div className="absolute top-2 right-2">
                                  <button
                                    onClick={() => handleRemoveAd(ad.id)}
                                    className="bg-gray-400 hover:bg-gray-600 transition-all duration-300 h-8 w-8 flex justify-center items-center rounded"
                                    type="button"
                                  >
                                    <X className="w-6 h-6 text-gray-200" />
                                  </button>
                                </div>
                                <div className="p-4 flex justify-center items-center text-center h-64">
                                  <div className="p-4">
                                    {ad.text}
                                    <a
                                      href={ad.link}
                                      className={`${ad.textColor} underline block mt-2`}
                                    >
                                      {ad.linkText}
                                    </a>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                      </React.Fragment>
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

            {/* third col span - Ad section */}
            <div className="col-span-1 space-y-4 hidden lg:block">
              {sidebarAds.map(ad => {
                if (removedAdIds.includes(ad.id)) return null;
                return (
                  <div
                    key={ad.id}
                    className={`${ad.color} p-4 rounded-lg shadow text-center relative`}
                  >
                    <button
                      onClick={() => handleRemoveAd(ad.id)}
                      className="absolute top-2 right-2 bg-gray-400 hover:bg-gray-600 h-6 w-6 rounded flex items-center justify-center"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                    {ad.text}
                    <a
                      href={ad.link}
                      className="block mt-2 underline text-sm dark:text-white"
                    >
                      {ad.linkText}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
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
