import React from 'react'
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
// ---------------------------------------------------------------------
// Media Player Modal Component (using Framer Motion)
// ---------------------------------------------------------------------
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

interface Artist {
    id: number;
    name: string;
}

interface Genre {
    id: number;
    name: string;
}

interface MediaPlayerModalProps {
    music: Music;
    onClose: () => void;
}

const MediaPlayerModal: React.FC<MediaPlayerModalProps> = ({ music, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 relative"
            >
                <div className="flex justify-end mb-2">
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-200 border border-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </button>
                </div>
                <img
                    src={music.image_url}
                    alt={music.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h2 className="text-xl font-bold mb-2">{music.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{music.artist.name}</p>
                <audio controls autoPlay className="w-full">
                    <source src={music.file_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            </motion.div>
        </div>
    );
};


export default MediaPlayerModal;
