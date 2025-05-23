import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';

// Define local Music type to avoid dependency issues
interface Artist {
    id: number;
    name: string;
}

interface Genre {
    id: number;
    name: string;
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
    slug?: string;
}

interface AudioPlayerProps {
    music: Music;
    onClose: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ music, onClose }) => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Expose the audio element to the parent component via a global ID
    useEffect(() => {
        // Add an ID to the audio element for global access
        if (audioRef.current) {
            audioRef.current.id = 'global-audio-player';
        }
    }, []);

    // Initialize audio player
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            // Set up event listeners
            audio.addEventListener('timeupdate', updateProgress);
            audio.addEventListener('loadedmetadata', () => {
                setDuration(audio.duration);
            });
            audio.addEventListener('ended', () => {
                setIsPlaying(false);
                setCurrentTime(0);
            });

            // Start playing
            audio.play().catch(error => {
                console.error('Error playing audio:', error);
                setIsPlaying(false);
            });

            // Clean up
            return () => {
                audio.pause();
                audio.removeEventListener('timeupdate', updateProgress);
                audio.removeEventListener('loadedmetadata', () => {});
                audio.removeEventListener('ended', () => {});
            };
        }
    }, [music]);

    // Update progress bar
    const updateProgress = () => {
        const audio = audioRef.current;
        if (audio) {
            setCurrentTime(audio.currentTime);
        }
    };

    // Toggle play/pause
    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play().catch(error => {
                    console.error('Error playing audio:', error);
                });
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Toggle mute
    const toggleMute = () => {
        const audio = audioRef.current;
        if (audio) {
            audio.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    // Handle volume change
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        const audio = audioRef.current;
        if (audio) {
            audio.volume = newVolume;
            setVolume(newVolume);
            if (newVolume === 0) {
                setIsMuted(true);
            } else if (isMuted) {
                setIsMuted(false);
            }
        }
    };

    // Handle seek
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const seekTime = parseFloat(e.target.value);
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = seekTime;
            setCurrentTime(seekTime);
        }
    };

    // Format time (seconds to MM:SS)
    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

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
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </button>
                </div>

                <ImageWithFallback
                    src={`/storage/${music.image_url}`}
                    fallbackSrc="/images/default-album-art.svg"
                    alt={music.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                />

                <h2 className="text-xl font-bold mb-2 dark:text-white">{music.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{music.artist.name}</p>

                {/* Audio element (hidden) */}
                <audio ref={audioRef} src={`/storage/${music.file_url}`} />

                {/* Custom controls */}
                <div className="space-y-3">
                    {/* Progress bar */}
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400 w-10">
                            {formatTime(currentTime)}
                        </span>
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            className="flex-grow h-2 rounded-full bg-gray-200 dark:bg-gray-700 appearance-none cursor-pointer"
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400 w-10">
                            {formatTime(duration)}
                        </span>
                    </div>

                    {/* Play/Pause and volume controls */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={togglePlayPause}
                            className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                        >
                            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </button>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={toggleMute}
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                            >
                                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="w-20 h-2 rounded-full bg-gray-200 dark:bg-gray-700 appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AudioPlayer;
