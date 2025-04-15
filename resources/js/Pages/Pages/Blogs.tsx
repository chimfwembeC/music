import React, { useState } from 'react';
import { Cpu, Heart, List, MessageCircleMore, Music, User } from 'lucide-react';
import { motion } from 'framer-motion';
import GuestLayout from '@/Layouts/GuestLayout';
import { Link } from '@inertiajs/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import ReactionButton from '@/Components/ReactionButton';
import useTypedPage from '@/Hooks/useTypedPage';
import CommentSection from '@/Components/CommentSection'; // Import the CommentSection
import { Music as MusicData } from '@/types';

// Types
interface UserReaction {
  user_name: string;
  avatar: string;
  reaction: string; // like "😂" or "❤️"
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
  {
    id: 2,
    title: 'Midnight Drive',
    slug: 'midnight-drive',
    artist_id: 2,
    genre_id: 2,
    album_id: 2,
    duration: 198,
    file_url: 'https://example.com/music2.mp3',
    original_filename: 'midnight_drive.mp3',
    image_url:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80',
    download_counts: 950,
    is_published: true,
    is_featured: true,
    created_at: '2024-03-14',
    updated_at: '2024-03-14',
  },
  {
    id: 3,
    title: 'Urban Dreams',
    slug: 'urban-dreams',
    artist_id: 3,
    genre_id: 3,
    album_id: 2,
    duration: 256,
    file_url: 'https://example.com/music3.mp3',
    original_filename: 'urban_dreams.mp3',
    image_url:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&h=800',
    download_counts: 1100,
    is_published: true,
    is_featured: true,
    created_at: '2024-03-13',
    updated_at: '2024-03-13',
  },
  {
    id: 4,
    title: 'Ocean Waves',
    slug: 'ocean-waves',
    artist_id: 4,
    genre_id: 4,
    album_id: 3,
    duration: 345,
    file_url: 'https://example.com/music4.mp3',
    original_filename: 'ocean_waves.mp3',
    image_url:
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&h=600',
    download_counts: 850,
    is_published: true,
    is_featured: false,
    created_at: '2024-03-12',
    updated_at: '2024-03-12',
  },
  {
    id: 5,
    title: 'City Nights',
    slug: 'city-nights',
    artist_id: 5,
    genre_id: 5,
    album_id: 3,
    duration: 289,
    file_url: 'https://example.com/music5.mp3',
    original_filename: 'city_nights.mp3',
    image_url:
      'https://images.unsplash.com/photo-1513829596324-4bb2800c5efb?auto=format&fit=crop&q=80&h=900',
    download_counts: 1400,
    is_published: true,
    is_featured: true,
    created_at: '2024-03-11',
    updated_at: '2024-03-11',
  },
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

  const age = 18;
  const isUserAdult = age >= 18;
  const filteredAds = inlineAds.filter(ad => {
    if (ad.id === 3 && !isUserAdult) return false; // 🔞 block adult ad
    return true;
  });

  const categoryIcons: Record<string, JSX.Element> = {
    All: <List className="w-4 h-4 mr-1" />,
    Tech: <Cpu className="w-4 h-4 mr-1" />,
    Music: <Music className="w-4 h-4 mr-1" />,
    Lifestyle: <Heart className="w-4 h-4 mr-1" />,
  };
  // Simulate an API call to get more blogs
  const [pageNumber, setPageNumber] = useState(2); // start at 2 for infinite scroll

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

  // Handle drag end on the sheet - if dragged down more than threshold, close it
  const handleDragEnd = (event: MouseEvent | TouchEvent, info: PanInfo) => {
    if (info.offset.y > 100) {
      closeCommentSheet();
    }
  };

  // Top 3 trending music by download_counts
  const trendingMusic = [...music]
    .filter(m => m.is_published)
    .sort((a, b) => b.download_counts - a.download_counts)
    .slice(0, 3);
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

          <div className="grid grid-cols-1 md:grid-cols-5 max-w-5xl m-auto gap-8">
            {/* Infinite Scroll */}

            {/* first col span */}
            <div className="col-span-1 hidden lg:block">
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
                  <p className="text-center text-gray-400">
                    Loading more blogs...
                  </p>
                }
              >
                {displayedBlogs.length ? (
                  <div className="grid gap-6 md:grid-cols-1">
                    {displayedBlogs.map((blog, index) => (
                      <React.Fragment key={blog.id}>
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
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <img
        src={reaction?.avatar}
        alt={reaction?.user_name}
        className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
      />

      {/* Emoji Badge */}
      <div className="absolute -bottom-1.5 -right-1.5 bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-md text-sm">
  {emojiMap[reaction?.reaction] || reaction?.reaction}
</div>


      {/* Tooltip */}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 whitespace-nowrap">
        {reaction?.user_name} reacted with {reaction?.reaction}
      </div>
    </motion.div>
  ))}
</div>

                            </div>

                          </div>
                        </motion.div>
                        {/* Insert ad every 4 blogs */}
                        {index > 0 &&
                          index % 2 === 0 &&
                          (() => {
                            const ad =
                              filteredAds[(index / 2) % inlineAds.length];
                            return (
                              <div
                                className={`${ad.bgColor} p-4 flex justify-center items-center text-center rounded-lg shadow h-48`}
                              >
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
            <div className="col-span-1 space-y-4  hidden lg:block">
              {[
                {
                  color: 'bg-red-100 dark:bg-red-700',
                  text: '🎮 Try the #1 gaming platform of 2025!',
                  link: 'https://example.com/gaming',
                  linkText: 'Play Now',
                },
                {
                  color: 'bg-yellow-100 dark:bg-yellow-700',
                  text: '👜 Explore next-gen fashion accessories',
                  link: 'https://example.com/fashion',
                  linkText: 'See Styles',
                },
                {
                  color: 'bg-purple-100 dark:bg-purple-700',
                  text: '📚 Learn coding interactively — free trial!',
                  link: 'https://example.com/learn-to-code',
                  linkText: 'Enroll Today',
                },
              ].map((ad, idx) => (
                <div
                  key={idx}
                  className={`${ad.color} p-4 rounded-lg shadow text-center`}
                >
                  {ad.text}
                  <a
                    href={ad.link}
                    className="block mt-2 underline text-sm dark:text-white"
                  >
                    {ad.linkText}
                  </a>
                </div>
              ))}
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
