import React from 'react';
import { Play, Clock, Calendar, Music2, User, Tag } from 'lucide-react';
import { usePage } from '@inertiajs/react';
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
}

function Index() {
    const { query, results } = usePage().props;

    return (
        <GuestLayout title='Search Results'>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">
                            Search Results for "{query}"
                        </h1>
                        <div className="h-1 w-20 bg-purple-500 rounded-full"></div>
                    </div>

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
                                        className="bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-700/50 transition-all duration-300 backdrop-blur-sm"
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
                                                    <div className="flex items-center text-gray-300">
                                                        <User className="w-4 h-4 mr-2" />
                                                        <span>{music.artist.name}</span>
                                                    </div>

                                                    <div className="flex items-center text-gray-300">
                                                        <Tag className="w-4 h-4 mr-2" />
                                                        <span>{music.genre.name}</span>
                                                    </div>

                                                    <div className="flex items-center text-gray-300">
                                                        <Clock className="w-4 h-4 mr-2" />
                                                        <span>{formatDuration(music.duration)}</span>
                                                    </div>

                                                    <div className="flex items-center text-gray-300">
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
                            <div className="bg-gray-800/50 rounded-lg p-8 text-center text-gray-400">
                                <Music2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">No songs found matching your search.</p>
                            </div>
                        )}
                    </section>

                    {/* Artists Section */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-6 flex items-center">
                            <User className="mr-2" />
                            Artists
                        </h2>

                        {results.artists.length ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {results.artists.map((artist) => (
                                    <div
                                        key={artist.id}
                                        className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-700/50 transition-all duration-300"
                                    >
                                        <img
                                            src={artist.image_url}
                                            alt={artist.name}
                                            className="w-full h-48 object-cover rounded-lg mb-4"
                                        />
                                        <h3 className="text-xl font-semibold mb-2">{artist.name}</h3>
                                        <p className="text-gray-400">{artist.bio}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-800/50 rounded-lg p-8 text-center text-gray-400">
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
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {results.genres.map((genre) => (
                                    <div
                                        key={genre.id}
                                        className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-700/50 transition-all duration-300"
                                    >
                                        <h3 className="text-xl font-semibold mb-2">{genre.name}</h3>
                                        <p className="text-gray-400">{genre.description}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-800/50 rounded-lg p-8 text-center text-gray-400">
                                <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">No genres found matching your search.</p>
                            </div>
                        )}
                    </section>

                    {/* Blogs Section */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-6 flex items-center">
                            <User className="mr-2" />
                            Blogs
                        </h2>

                        {results.blogs.length ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {results.blogs.map((blog) => (
                                    <div
                                        key={blog.id}
                                        className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-700/50 transition-all duration-300"
                                    >
                                        <img
                                            src={blog.image_url}
                                            alt={blog.title}
                                            className="w-full h-48 object-cover rounded-lg mb-4"
                                        />
                                        <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                                        <p className="text-gray-400">{blog.content}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-800/50 rounded-lg p-8 text-center text-gray-400">
                                <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">No blogs found matching your search.</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </GuestLayout>
    );
}

export default Index;
