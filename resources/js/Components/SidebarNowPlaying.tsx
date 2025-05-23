import React, { useState, useEffect } from 'react';
import { Play, Pause, Music } from 'lucide-react';
import { Link } from '@inertiajs/react';
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

const SidebarNowPlaying: React.FC = () => {
    const [currentTrack, setCurrentTrack] = useState<Music | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Initialize component
    useEffect(() => {
        // Try to get currently playing track from localStorage
        const storedTrack = localStorage.getItem('currentlyPlaying');
        if (storedTrack) {
            try {
                setCurrentTrack(JSON.parse(storedTrack));
            } catch (e) {
                console.error('Error parsing stored track:', e);
            }
        }

        // Listen for changes to the currently playing track
        const handleNowPlayingChanged = (event: CustomEvent) => {
            setCurrentTrack(event.detail.track);
        };

        window.addEventListener('nowPlayingChanged', handleNowPlayingChanged as EventListener);

        // Find the global audio element
        const findAudioElement = () => {
            const audio = document.getElementById('global-audio-player') as HTMLAudioElement;
            if (audio) {
                // Set up event listeners
                audio.addEventListener('timeupdate', updateProgress);
                audio.addEventListener('loadedmetadata', () => {
                    setDuration(audio.duration);
                });
                audio.addEventListener('play', () => {
                    setIsPlaying(true);
                });
                audio.addEventListener('pause', () => {
                    setIsPlaying(false);
                });

                // Initialize state
                setIsPlaying(!audio.paused);
                setCurrentTime(audio.currentTime);
                setDuration(audio.duration);
            }
        };

        // Try to find the audio element immediately
        findAudioElement();

        // Also set up a timer to keep checking for the audio element
        // (in case it's not available immediately)
        const intervalId = setInterval(() => {
            findAudioElement();
        }, 1000);

        // Clean up
        return () => {
            window.removeEventListener('nowPlayingChanged', handleNowPlayingChanged as EventListener);
            clearInterval(intervalId);

            const audio = document.getElementById('global-audio-player') as HTMLAudioElement;
            if (audio) {
                audio.removeEventListener('timeupdate', updateProgress);
                audio.removeEventListener('loadedmetadata', () => {});
                audio.removeEventListener('play', () => {});
                audio.removeEventListener('pause', () => {});
            }
        };
    }, []);

    // Update progress bar
    const updateProgress = () => {
        const audio = document.getElementById('global-audio-player') as HTMLAudioElement;
        if (audio) {
            setCurrentTime(audio.currentTime);
        }
    };

    // Toggle play/pause
    const togglePlayPause = () => {
        const audio = document.getElementById('global-audio-player') as HTMLAudioElement;
        if (audio) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play().catch(error => {
                    console.error('Error playing audio:', error);
                });
            }
        }
    };

    // Format time (seconds to MM:SS)
    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Calculate progress percentage
    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    if (!currentTrack) {
        return (
            <div className="p-3 text-center text-gray-500 dark:text-gray-400 text-sm">
                No track currently playing
            </div>
        );
    }

    return (
        <div className="p-3">
            <div className="">
                {/* Album art with play/pause overlay */}
                <div className="relative group h-24">
                    <ImageWithFallback
                        src={`/storage/${currentTrack.image_url}`}
                        fallbackSrc="/images/album-cover-placeholder.jpeg"
                        alt={currentTrack.title}
                        className="h-24 w-full object-cover rounded-md"
                    />
                    <button
                        onClick={togglePlayPause}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
                    >
                        {isPlaying ?
                            <Pause className="w-5 h-5 text-white" /> :
                            <Play className="w-5 h-5 text-white" />
                        }
                    </button>
                </div>

               <div className="flex items-center mt-1">
               <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {currentTrack.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {currentTrack.artist.name}
                    </p>
                </div>

                <button
                    onClick={togglePlayPause}
                    className="p-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ?
                        <Pause className="w-3.5 h-3.5" /> :
                        <Play className="w-3.5 h-3.5" />
                    }
                </button>
               </div>
            </div>

            {/* Progress bar */}
            <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                    className="h-full bg-indigo-600"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>

            {/* Time display */}
            <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>
        </div>
    );
};

export default SidebarNowPlaying;
