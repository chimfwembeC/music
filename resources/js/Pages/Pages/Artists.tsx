import React from 'react';
import { Download, User } from 'lucide-react';
import { motion } from 'framer-motion'; // Import motion from framer-motion
import GuestLayout from '@/Layouts/GuestLayout';
import { Link } from '@inertiajs/react';

// Types
interface Artist {
    id: number;
    name: string;
    bio: string;
    image_url: string;
}

interface Genre {
    id: number;
    name: string;
}

interface Album {
    id: number;
    title: string;
    artist: Artist;
    genre: Genre;
    tracks: number;
    created_at: string;
    image_url: string;
}


interface Music {
    id: number;
    title: string;
    artist: Artist;
    genre: Genre;
    duration: number;
    created_at: string;
    image_url: string;
    file_url: string;
    original_filename: string;
}
interface ArtistsPageProps {
    artists: Artist[];
    albums: Album;
    music: Music;
}

const ArtistsPage: React.FC<ArtistsPageProps> = ({ artists, albums, music }) => {
    return (
        <GuestLayout title="Artists">
            <div className="min-h-screen bg-gradient-to-br  dark:from-gray-900 dark:to-gray-800 from-gray-200 to-gray-100 dark:text-white text-gray-600">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-6">Artists</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                        <div className="col-span col-span-1">
                            <div className="bg-gray-100 dark:bg-gray-800 border border-gray-400/50 dark:border-gray-600 rounded-lg p-4">
                                <div className="text-2xl">Music</div>
                                <div className="border border-t -mx-4 my-4 border-gray-400/50 dark:border-gray-600 rounded-lg" />
                                {music?.length > 0 ? (
                                    <>
                                        {
                                            music?.map((music, index) => (
                                                <div className="" key={music.id}>
                                                    <div className="flex justify-between items-center gap-2 mt-1">
                                                        <div className="flex justify-start items-center gap-2 mt-1">
                                                            <img className='w-10 h-10 border border-gray-300 dark:border-gray-600' src={music.image_url} alt={music.title} />

                                                            <Link href={`/music/${music.id}`}>
                                                                <span className="">
                                                                    <div className="text-sm hover:underline">
                                                                        {music.title}
                                                                    </div>

                                                                    <div className="flex gap-2">
                                                                        <div className="bg-gray-200 dark:bg-gray-600 text-xs px-2 rounded-lg">
                                                                            <span>Downloads</span>
                                                                            <span className='border-r border-gray-300 dark:border-gray-500 mx-1'></span>
                                                                            {music?.download_counts}
                                                                        </div>
                                                                    </div>
                                                                </span>
                                                            </Link>
                                                        </div>
                                                    </div>

                                                    {music.length > index + 1 && (
                                                        <div className="border border-t -mx-4 my-4 border-gray-400 dark:border-gray-600 rounded-lg" />
                                                    )}
                                                </div>
                                            ))
                                        }
                                    </>
                                ) : (
                                    <div className="">No music found</div>
                                )}
                            </div>
                        </div>
                        <div className="col-span col-span-3">
                            <div className="">
                                {artists.length ? (
                                    <div className="grid gap-4 md:grid-cols-3">
                                        {artists.map((artist) => (
                                            // Wrap the artist card in a motion.div for animation
                                            <motion.div
                                                key={artist.id}
                                                className="bg-gray-100 dark:bg-gray-800 border border-gray-400/50 dark:border-gray-600 p-4 hover:bg-gray-500/50 transition-all duration-300 rounded-lg"
                                                initial={{ opacity: 0, y: 20 }} // Start with opacity 0 and slide from below
                                                animate={{ opacity: 1, y: 0 }} // Animate to full opacity and normal position
                                                transition={{ duration: 0.5 }} // Animation duration
                                                whileHover={{ scale: 1.05 }} // Scale the card up slightly when hovered
                                            >
                                                <img
                                                    src={artist.image_url}
                                                    alt={artist.name}
                                                    className="w-full h-28 object-cover rounded-lg mb-4"
                                                />
                                                <h3 className="text-xl font-semibold mb-2">{artist.name}</h3>
                                                <p className="text-gray-400">{artist.bio}</p>
                                                <Link
                                                    href={`/artists/${artist.id}`}
                                                    className="text-blue-500 hover:text-blue-400"
                                                >
                                                    Learn more
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-gray-800/50 rounded-lg p-8 text-center text-gray-400">
                                        <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg">No artists found.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-span col-span-1">
                            <div className="bg-gray-100 dark:bg-gray-800 border border-gray-400/50 dark:border-gray-600 rounded-lg p-4">
                                <div className="text-2xl">Trending Albums</div>
                                <div className="border border-t -mx-4 my-4 border-gray-400/50 dark:border-gray-600 rounded-lg" />
                                {albums.length > 0 ? (
                                    <div className="">
                                        {
                                            albums.map((album, index) => (
                                                <div className="" key={album?.id}>
                                                    <div className="flex justify-start items-center gap-2 mt-1">
                                                        <img className='w-10 h-10 border border-gray-400 dark:border-gray-600 rounded-lg' src={album.image_url} alt={album.title} />

                                                        <div className="">
                                                            <Link href={`/albums/${album?.id}`}>
                                                                <span className="hover:underline">
                                                                    {album?.title}
                                                                </span>
                                                            </Link>
                                                            <div className="flex gap-2">
                                                                <div className="bg-gray-200 dark:bg-gray-600 text-xs px-2 rounded-lg">
                                                                    <span>Downloads</span>
                                                                    <span className='border-r border-gray-300 dark:border-gray-500 mx-1'></span>
                                                                    {album?.download_counts}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {albums.length > index + 1 && (
                                                            <div className="border border-t -mx-4 my-4 border-gray-300 dark:border-gray-600 rounded-lg" />
                                                        )}
                                                    </div>

                                                    {albums.length > index + 1 && (
                                                        <div className="border border-t -mx-4 my-4 border-gray-300 dark:border-gray-600 rounded-lg" />
                                                    )}

                                                </div>
                                            ))
                                        }

                                    </div>

                                ) : (
                                    <div className="">No album found</div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </GuestLayout>
    );
};

export default ArtistsPage;
