import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, Music } from 'lucide-react';
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

const NowPlaying: React.FC = () => {
    const [currentTrack, setCurrentTrack] = useState<Music | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

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
                setVolume(audio.volume);
                setIsMuted(audio.muted);
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

    // Toggle mute
    const toggleMute = () => {
        const audio = document.getElementById('global-audio-player') as HTMLAudioElement;
        if (audio) {
            audio.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    // Handle volume change
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        const audio = document.getElementById('global-audio-player') as HTMLAudioElement;
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
        const audio = document.getElementById('global-audio-player') as HTMLAudioElement;
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

    if (!currentTrack) {
        return (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No track currently playing
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
                {/* Album art with play/pause overlay */}
                <div className="relative group">
                    <ImageWithFallback
                        src={`/storage/${currentTrack.image_url}`}
                        fallbackSrc="/images/default-album-art.svg"
                        alt={currentTrack.title}
                        className="w-16 h-16 object-cover rounded-md"
                    />
                    <button
                        onClick={togglePlayPause}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
                    >
                        {isPlaying ?
                            <Pause className="w-8 h-8 text-white" /> :
                            <Play className="w-8 h-8 text-white" />
                        }
                    </button>
                </div>

                <div className="flex-grow">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                {currentTrack.title}
                            </h3>
                            <Link
                                href={`/artists/${currentTrack.artist.id}`}
                                className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                            >
                                {currentTrack.artist.name}
                            </Link>
                        </div>

                        {/* Play/Pause and Volume Controls */}
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={togglePlayPause}
                                className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                                aria-label={isPlaying ? "Pause" : "Play"}
                            >
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>

                            <button
                                onClick={toggleMute}
                                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                                aria-label={isMuted ? "Unmute" : "Mute"}
                            >
                                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400 w-8">
                            {formatTime(currentTime)}
                        </span>
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            className="flex-grow h-1 rounded-full bg-gray-200 dark:bg-gray-700 appearance-none cursor-pointer"
                            aria-label="Seek"
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400 w-8">
                            {formatTime(duration)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NowPlaying;
