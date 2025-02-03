import React from 'react';
import { User } from 'lucide-react';
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

interface ArtistsPageProps {
    artists: Artist[];
}

const ArtistsPage: React.FC<ArtistsPageProps> = ({ artists }) => {
    return (
        <GuestLayout title="Artists">
            <div className="min-h-screen bg-gradient-to-br  dark:from-gray-900 dark:to-gray-800 from-gray-200 to-gray-100 dark:text-white text-gray-600">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-6">Artists</h1>

                    {artists.length ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {artists.map((artist) => (
                                // Wrap the artist card in a motion.div for animation
                                <motion.div
                                    key={artist.id}
                                    className="bg-gray-400/50 dark:bg-gray-800/50 rounded-lg p-4 dark:hover:bg-gray-700/50 hover:bg-gray-500/50 transition-all duration-300"
                                    initial={{ opacity: 0, y: 20 }} // Start with opacity 0 and slide from below
                                    animate={{ opacity: 1, y: 0 }} // Animate to full opacity and normal position
                                    transition={{ duration: 0.5 }} // Animation duration
                                    whileHover={{ scale: 1.05 }} // Scale the card up slightly when hovered
                                >
                                    <img
                                        src={artist.image_url}
                                        alt={artist.name}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
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
        </GuestLayout>
    );
};

export default ArtistsPage;
