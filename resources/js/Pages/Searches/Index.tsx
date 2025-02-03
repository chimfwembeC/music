import React from 'react';
import { Play, Clock, Calendar, Music2, User, Tag, Disc } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';

// Types
interface Genre {
    id: number;
    name: string;
    description: string;
}

interface Artist {
    id: number;
    name: string;
    bio: string;
    image_url: string;
}

interface Music {
    id: number;
    title: string;
    artist_id: number;
    genre_id: number;
    file_url: string;
    image_url: string;
    duration: number;
    is_published: number;
    created_at: string;
    updated_at: string;
    artist: Artist;
    genre: Genre;
}

interface Blog {
    id: number;
    title: string;
    content: string;
    image_url: string;
    created_at: string;
}

interface SearchResults {
    musics: Music[];
    artists: Artist[];
    genres: Genre[];
    blogs: Blog[];
}

function SearchResults({ query, results }: SearchResults) {
    function formatDuration(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } return (
        <GuestLayout title={'search results'}>
            <div className="min-h-screen bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 from-gray-200 to-gray-100 text-gray-800 dark:text-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">
                            Search Results for "{query}"
                        </h1>
                        <div className="h-1 w-20 bg-purple-500 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                        {/* Left Sidebar */}
                        <div className="col-span-1">
                            {/* Artists Section */}
                            <section className="mb-12">
                                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                                    <User className="mr-2" />
                                    Artists
                                </h2>

                                {results.artists.length ? (
                                    <div className="grid gap-4">
                                        {results.artists.map((artist) => (
                                            <div
                                                key={artist.id}
                                                className="bg-white flex gap-4 items-center dark:bg-gray-800/50 rounded-lg p-4 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                            >
                                                <img
                                                    src={artist.image_url}
                                                    alt={artist.name}
                                                    className="w-8 h-8 object-cover rounded-lg"
                                                />
                                                <div>
                                                    <a href={`/artists/${artist.id}`} className="hover:underline">
                                                        <h3 className="text-sm font-semibold">{artist.name}</h3>
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white dark:bg-gray-800/50 rounded-lg p-8 text-center text-gray-400">
                                        <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg">No artists found matching your search.</p>
                                    </div>
                                )}
                            </section>

                            {/* Genres Section */}
                            <section className="mb-12">
                                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                                    <Tag className="mr-2" />
                                    Genres
                                </h2>

                                {results.genres.length ? (
                                    <div className="grid gap-4">
                                        {results.genres.map((genre) => (
                                            <div
                                                key={genre.id}
                                                className="bg-white dark:bg-gray-800/50 rounded-lg p-4 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                            >
                                                <h3 className="text-sm font-semibold">{genre.name}</h3>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white dark:bg-gray-800/50 rounded-lg p-8 text-center text-gray-400">
                                        <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg">No genres found matching your search.</p>
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* Main Content */}
                        <div className="col-span-3">
                            {/* Songs Section */}
                            <section className="mb-12">
                                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                                    <Music2 className="mr-2" />
                                    Songs
                                </h2>

                                {results.musics.length ? (
                                    <div className="grid gap-6">
                                        {results.musics.map((music) => (
                                            <div
                                                key={music.id}
                                                className="bg-white dark:bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 backdrop-blur-sm"
                                            >
                                                <div className="flex items-center p-4">
                                                    <div className="relative group w-20 h-20 flex-shrink-0">
                                                        <img
                                                            src={music.image_url}
                                                            alt={music.title}
                                                            className="w-full h-full object-cover rounded-md"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300 rounded-md opacity-0 group-hover:opacity-100 flex items-center justify-center">
                                                            <Play className="w-8 h-8 text-white cursor-pointer" />
                                                        </div>
                                                    </div>

                                                    <div className="ml-4 flex-grow">
                                                        <h3 className="text-xl font-semibold mb-2">{music.title}</h3>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="flex items-center text-gray-800 dark:text-gray-300">
                                                                <User className="w-4 h-4 mr-2" />
                                                                <span>{music.artist.name}</span>
                                                            </div>

                                                            <div className="flex items-center text-gray-800 dark:text-gray-300">
                                                                <Tag className="w-4 h-4 mr-2" />
                                                                <span>{music.genre.name}</span>
                                                            </div>

                                                            <div className="flex items-center text-gray-800 dark:text-gray-300">
                                                                <Clock className="w-4 h-4 mr-2" />
                                                                <span>{formatDuration(music.duration)}</span>
                                                            </div>

                                                            <div className="flex items-center text-gray-800 dark:text-gray-300">
                                                                <Calendar className="w-4 h-4 mr-2" />
                                                                <span>{formatDate(music.created_at)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white dark:bg-gray-800/50 rounded-lg p-8 text-center text-gray-400">
                                        <Music2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg">No songs found matching your search.</p>
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* Right Sidebar */}
                        <div className="col-span-1">
                            {/* Blogs Section */}
                            <section className="mb-12">
                                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                                    <User className="mr-2" />
                                    Recent Blogs
                                </h2>

                                {results.blogs.length ? (
                                    <div className="grid gap-4">
                                        {results.blogs.map((blog) => (
                                            <div
                                                key={blog.id}
                                                className="bg-white flex items-center gap-4 dark:bg-gray-800/50 rounded-lg p-4 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                            >
                                                <img
                                                    src={blog.image_url}
                                                    alt={blog.title}
                                                    className="w-8 h-8 object-cover rounded-lg"
                                                />
                                                <a href={`/blogs/${blog.id}`} className="hover:underline">
                                                    <h3 className="text-sm font-semibold line-clamp-1">{blog.title}</h3>
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white dark:bg-gray-800/50 rounded-lg p-8 text-center text-gray-400">
                                        <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg">No blogs found matching your search.</p>
                                    </div>
                                )}
                            </section>

                            {/* Albums Section */}
                            <section className="mb-12">
                                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                                    <Disc className="mr-2" />
                                    Albums
                                </h2>

                                {results.albums.length ? (
                                    <div className="grid gap-4">
                                        {results.albums.map((album) => (
                                            <div
                                                key={album.id}
                                                className="bg-white dark:bg-gray-800/50 rounded-lg p-4 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                            >
                                                <h3 className="text-sm font-semibold">{album.name}</h3>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white dark:bg-gray-800/50 rounded-lg p-8 text-center text-gray-400">
                                        <Disc className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg">No albums found.</p>
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}

export default SearchResults;
