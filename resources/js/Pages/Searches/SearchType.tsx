import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Play, Download } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function SearchType() {
    const { type, prop } = usePage().props;
    const [isPlaying, setIsPlaying] = useState(false);
    const audio = new Audio(prop?.audio_url);

    const handlePlay = () => {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = prop?.audio_url;
        link.download = prop?.title || 'audio';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <GuestLayout title={'Search Results'}>
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
                <motion.h1
                    className="text-4xl font-extrabold mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Search Results
                </motion.h1>

                <motion.div
                    className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {type === 'music' && prop ? (
                        <div>
                            <h2 className="text-2xl font-semibold">🎵 {prop.title}</h2>
                            <p className="text-gray-400">By: {prop.artist?.name}</p>
                            <div className="flex gap-4 mt-4">
                                <button
                                    onClick={handlePlay}
                                    className="flex items-center px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
                                >
                                    <Play className="w-5 h-5 mr-2" /> {isPlaying ? 'Pause' : 'Play'}
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                                >
                                    <Download className="w-5 h-5 mr-2" /> Download
                                </button>
                            </div>
                        </div>
                    ) : type === 'artist' && prop ? (
                        <div>
                            <h2 className="text-2xl font-semibold">🎤 {prop.name}</h2>
                            <p className="text-gray-400">Genre: {prop.genre?.name}</p>
                        </div>
                    ) : type === 'genre' && prop ? (
                        <div>
                            <h2 className="text-2xl font-semibold">🎶 {prop.name}</h2>
                        </div>
                    ) : (
                        <p className="text-gray-400">No data found.</p>
                    )}
                </motion.div>
            </div>
        </GuestLayout>
    );
}
