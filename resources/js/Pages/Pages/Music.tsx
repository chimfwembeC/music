import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Clock, User as UserIcon, Tag, Download, Share2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import AudioPlayer from '@/Components/AudioPlayer';
import MotionAlert from '@/Components/MotionAlert';
import ImageWithFallback from '@/Components/ImageWithFallback';
import axios from 'axios';
import useTypedPage from '@/Hooks/useTypedPage';
import WithLayout from '@/Components/WithLayout';
import TrackInteractionService from '@/Services/TrackInteractionService';

// Types
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
    slug: string;
    download_counts: number;
    view_count?: number;
    like_count?: number;
    play_count?: number;
    last_played_at?: string;
}

interface MusicPageProps {
    musics: Music[];
}

function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function Music({ musics }: MusicPageProps) {
    const page = useTypedPage();
    // @ts-ignore - auth is available in the page props
    const user = page.props.auth?.user;

    // Search, filter, pagination & download states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [isFileVerified, setIsFileVerified] = useState(false);
    const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);
    const [downloadingMusicIds, setDownloadingMusicIds] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Audio Player states
    const [selectedPlayerMusic, setSelectedPlayerMusic] = useState<Music | null>(null);
    const [showPlayerModal, setShowPlayerModal] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Track interaction states for authenticated users
    const [likedMusicIds, setLikedMusicIds] = useState<number[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [musicStats, setMusicStats] = useState<{[key: number]: {likes: number, views: number, downloads: number}}>({});
    const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({
        like: false,
        play: false,
        download: false
    });

    // MotionAlert state for success and error notifications
    const [motionAlert, setMotionAlert] = useState<{ message: string, type: "success" | "error" } | null>(null);

    // Check like status for each music when user is authenticated
    useEffect(() => {
        if (user) {
            // Check like status for each music
            const checkLikeStatus = async () => {
                try {
                    const likedIds: number[] = [];
                    const stats: {[key: number]: {likes: number, views: number, downloads: number}} = {};

                    // For each music, check if it's liked
                    for (const music of musics) {
                        try {
                            const response = await TrackInteractionService.checkLike(music.id);
                            if (response.is_liked) {
                                likedIds.push(music.id);
                            }

                            // Get stats for the music
                            const statsResponse = await TrackInteractionService.getStats(music.id);
                            stats[music.id] = {
                                likes: statsResponse.like_count || 0,
                                views: statsResponse.view_count || 0,
                                downloads: statsResponse.download_count || 0
                            };
                        } catch (error) {
                            console.error(`Error checking like status for music ${music.id}:`, error);
                        }
                    }

                    setLikedMusicIds(likedIds);
                    setMusicStats(stats);
                } catch (error) {
                    console.error('Error checking like status:', error);
                }
            };

            checkLikeStatus();
        }
    }, [user, musics]);

    // Handle like button click
    const handleLike = async (musicId: number) => {
        if (!user) {
            // Redirect to login if not authenticated
            window.location.href = '/login';
            return;
        }

        setIsLoading(prev => ({ ...prev, like: true }));
        try {
            const response = await TrackInteractionService.toggleLike(musicId);

            // Update liked music IDs
            if (response.is_liked) {
                setLikedMusicIds(prev => [...prev, musicId]);
            } else {
                setLikedMusicIds(prev => prev.filter(id => id !== musicId));
            }

            // Update music stats
            setMusicStats(prev => ({
                ...prev,
                [musicId]: {
                    ...prev[musicId],
                    likes: response.like_count
                }
            }));

            setMotionAlert({
                message: response.is_liked ? 'Added to your likes' : 'Removed from your likes',
                type: 'success'
            });
            setTimeout(() => setMotionAlert(null), 3000);
        } catch (error) {
            console.error('Error toggling like:', error);
            setMotionAlert({ message: 'Failed to update like. Please try again.', type: 'error' });
            setTimeout(() => setMotionAlert(null), 3000);
        } finally {
            setIsLoading(prev => ({ ...prev, like: false }));
        }
    };

    const filteredMusic = musics.filter((music) =>
        music.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedGenre === '' || music.genre.name === selectedGenre)
    );

    const totalPages = Math.ceil(filteredMusic.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedMusic = filteredMusic.slice(startIndex, startIndex + itemsPerPage);

    const handleDownloadStart = (music: Music) => {
        setSelectedMusic(music);
        setDownloadingMusicIds((prev) => [...prev, music.id]);
        setShowModal(true);
        setDownloadProgress(0);
        setIsFileVerified(false);
        setError(null);

        // Start the download process
        handleDownload(music);
    };

    const handleFinalDownload = (music: Music, downloadUrl: string) => {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${music.original_filename}.mp3`;
        link.click();
    };

    const handleDownload = async (music: Music) => {
        if (!music || downloadingMusicIds.includes(music.id)) return;
        const audioUrl = music.file_url;
        // console.log('Attempting to download from:', audioUrl);

        try {
            // Verify file existence via a HEAD request
            const verificationResponse = await fetch(audioUrl, {
                method: 'HEAD',
                headers: { 'Content-Type': 'application/octet-stream' },
            });

            if (!verificationResponse.ok) {
                throw new Error('File not found or unable to fetch');
            }
            setIsFileVerified(true);

            // Download file via GET request
            const response = await fetch(audioUrl, {
                method: 'GET',
                headers: { 'Content-Type': 'application/octet-stream' },
            });

            const contentLength = response.headers.get('Content-Length');
            const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;
            const reader = response.body?.getReader();
            if (!reader) throw new Error('Failed to initialize file reader');

            let receivedBytes = 0;
            const chunks: Uint8Array[] = [];
            setIsLoading(prev => ({ ...prev, download: true }));

            const readStream = async () => {
                const { done, value } = await reader.read();
                if (done) {
                    const blob = new Blob(chunks);
                    const downloadUrl = URL.createObjectURL(blob);
                    handleFinalDownload(music, downloadUrl);
                    URL.revokeObjectURL(downloadUrl);
                    setDownloadingMusicIds((prev) => prev.filter(id => id !== music.id));
                    setShowModal(false);
                    // Show success alert
                    setMotionAlert({ message: 'Download completed successfully!', type: 'success' });

                    // Record download for authenticated users using the service
                    if (user) {
                        try {
                            const downloadResponse = await TrackInteractionService.downloadTrack(music.id);

                            // Update music stats
                            setMusicStats(prev => ({
                                ...prev,
                                [music.id]: {
                                    ...prev[music.id],
                                    downloads: downloadResponse.downloads
                                }
                            }));
                        } catch (downloadError) {
                            console.error('Error recording download:', downloadError);
                        }
                    } else {
                        // For unauthenticated users, use the existing endpoint
                        await axios.post(`/music/${music.id}/download`);
                    }

                    setTimeout(() => setMotionAlert(null), 3000);
                    return;
                }
                if (value) {
                    chunks.push(value);
                    receivedBytes += value.length;
                    const progress = totalBytes ? Math.round((receivedBytes / totalBytes) * 100) : 0;
                    setDownloadProgress(progress);
                }
                setTimeout(readStream, 0);
            };

            await readStream();
        } catch (error) {
            console.error('Error during download:', error);
            setIsFileVerified(false);
            setDownloadProgress(0);
            setDownloadingMusicIds((prev) => prev.filter(id => id !== music.id));
            setShowModal(false);
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            setError(errorMessage);
            // Show error alert
            setMotionAlert({ message: errorMessage, type: 'error' });
            setTimeout(() => setMotionAlert(null), 3000);
        } finally {
            setIsLoading(prev => ({ ...prev, download: false }));
        }
    };

    const handleShare = async (musicId: number) => {
        const music = musics.find((m) => m.id === musicId);
        if (music) {
            // Construct a human-friendly URL for the music page.
            const shareUrl = `${window.location.origin}/music/${music.slug}`;
            const shareData = {
                title: music.title,
                text: `Check out this song: ${music.title} by ${music.artist.name}`,
                url: shareUrl,
            };

            // Record share for authenticated users
            const recordShare = async () => {
                try {
                    if (user) {
                        // Use the service for authenticated users
                        await TrackInteractionService.shareTrack(musicId);
                    } else {
                        // Use direct API call for unauthenticated users
                        await axios.post(`/music/${musicId}/share`);
                    }
                } catch (error) {
                    console.error('Error recording share:', error);
                }
            };

            if (navigator.share) {
                navigator.share(shareData)
                    .then(async () => {
                        setMotionAlert({ message: 'Successfully shared!', type: 'success' });
                        await recordShare();
                        setTimeout(() => setMotionAlert(null), 3000);
                    })
                    .catch((error) => {
                        setMotionAlert({ message: 'Error sharing: ' + error.message, type: 'error' });
                        setTimeout(() => setMotionAlert(null), 3000);
                    });
            } else {
                // Fallback: Copy URL to clipboard
                navigator.clipboard.writeText(shareUrl)
                    .then(async () => {
                        setMotionAlert({ message: 'Share URL copied to clipboard!', type: 'success' });
                        await recordShare();
                        setTimeout(() => setMotionAlert(null), 3000);
                    })
                    .catch(() => {
                        setMotionAlert({ message: 'Error copying share URL!', type: 'error' });
                        setTimeout(() => setMotionAlert(null), 3000);
                    });
            }
        }
    };

    // Initialize audio element and set up global state for currently playing track
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            // Set up event listeners
            audio.addEventListener('ended', () => {
                setIsPlaying(false);
                setSelectedPlayerMusic(null);

                // Update global state when playback ends
                updateGlobalNowPlaying(null);
            });

            // Set up play/pause event listeners to keep state in sync
            audio.addEventListener('play', () => {
                setIsPlaying(true);
            });

            audio.addEventListener('pause', () => {
                setIsPlaying(false);
            });

            // Clean up
            return () => {
                audio.pause();
                audio.removeEventListener('ended', () => {});
                audio.removeEventListener('play', () => {});
                audio.removeEventListener('pause', () => {});
            };
        }
    }, []);

    // Function to update the global now playing state
    const updateGlobalNowPlaying = (track: Music | null) => {
        // This would typically be done through a global state manager like Redux
        // For now, we'll use a simple approach by storing in localStorage
        if (track) {
            localStorage.setItem('currentlyPlaying', JSON.stringify(track));
        } else {
            localStorage.removeItem('currentlyPlaying');
        }

        // Dispatch a custom event that other components can listen for
        window.dispatchEvent(new CustomEvent('nowPlayingChanged', {
            detail: { track }
        }));
    };

    // Handle playing music
    const handlePlay = async (music: Music) => {
        setIsLoading(prev => ({ ...prev, play: true }));
        try {
            // Record a view if user is authenticated
            if (user) {
                const viewResponse = await TrackInteractionService.recordView(music.id);

                // Update music stats
                setMusicStats(prev => ({
                    ...prev,
                    [music.id]: {
                        ...prev[music.id],
                        views: viewResponse.view_count
                    }
                }));
            }

            // If the same track is already selected, toggle play/pause
            if (selectedPlayerMusic && selectedPlayerMusic.id === music.id) {
                const audio = audioRef.current;
                if (audio) {
                    if (isPlaying) {
                        audio.pause();
                        // We don't need to update global state here as the pause event listener will handle it
                    } else {
                        audio.play().catch(error => {
                            console.error('Error playing audio:', error);
                        });
                        // Update global now playing state
                        updateGlobalNowPlaying(music);
                    }
                    // setIsPlaying is handled by the event listeners now
                }
            } else {
                // Set the new track and show the player
                setSelectedPlayerMusic(music);
                setShowPlayerModal(true);
                setIsPlaying(true);

                // Update global now playing state
                updateGlobalNowPlaying(music);

                // Wait for the next render cycle when audioRef is updated
                setTimeout(() => {
                    const audio = audioRef.current;
                    if (audio) {
                        audio.src = `/storage/${music.file_url}`;
                        audio.play().catch(error => {
                            console.error('Error playing audio:', error);
                            setIsPlaying(false);
                            // Clear global now playing state if playback fails
                            updateGlobalNowPlaying(null);
                        });
                    }
                }, 0);
            }
        } catch (error) {
            console.error('Error playing track:', error);
            setMotionAlert({ message: 'Failed to play track. Please try again.', type: 'error' });
            setTimeout(() => setMotionAlert(null), 3000);
        } finally {
            setIsLoading(prev => ({ ...prev, play: false }));
        }
    };

    return (
        <WithLayout
            title="Music"
            requireAuth={false}
            allowedRoles={['admin', 'artist', 'listener']}
        >
            <div className="min-h-screen bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 from-gray-200 to-gray-100 dark:text-white text-gray-600">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-6">
                        {user ? 'Your Music Collection' : 'Discover your favourite songs'}
                    </h1>

                    {/* Recently played section for authenticated users */}
                    {user && (
                        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Recently Played</h2>
                                <Link
                                    href="/listener-dashboard"
                                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    View All
                                </Link>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Continue listening to your recently played tracks or explore new music below.
                            </p>
                            <div className="flex gap-4 overflow-x-auto pb-4">
                                {/* This would ideally be populated with recently played tracks from the user's history */}
                                <div className="text-gray-500 dark:text-gray-400 italic">
                                    Your recently played tracks will appear here as you listen to music.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sign up prompt for unauthenticated users */}
                    {!user && (
                        <div className="mb-8 p-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg shadow-md">
                            <div className="flex flex-col md:flex-row justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-semibold mb-2">Create an account to get more features!</h2>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Sign up to like songs, create playlists, track your listening history, and more.
                                    </p>
                                </div>
                                <div className="mt-4 md:mt-0">
                                    <Link
                                        href="/register"
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        Sign Up
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="ml-4 px-6 py-2 border border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-600/10 transition-colors"
                                    >
                                        Log In
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Search & Filter Controls */}
                    <div className="mb-6 flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Search by title..."
                            className="p-3 bg-gray-100 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-white rounded-md w-full md:w-1/2"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <select
                            className="p-3 bg-gray-100 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white text-gray-600 rounded-md w-full md:w-1/4"
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                        >
                            <option value="">All Genres</option>
                            {Array.from(new Set(musics.map((music) => music.genre.name))).map((genre) => (
                                <option key={genre} value={genre}>{genre}</option>
                            ))}
                        </select>
                    </div>

                    {displayedMusic.length ? (
                        <div className="grid gap-6">
                            {displayedMusic.map((music) => (
                                <motion.div
                                    key={music.id}
                                    className="border-b border-gray-400 dark:border-gray-600 overflow-hidden transition-all duration-300 backdrop-blur-sm"
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="flex items-center p-4">
                                        <div className="relative group w-16 h-16 flex-shrink-0">
                                            <ImageWithFallback
                                                src={`/storage/${music.image_url}`}
                                                fallbackSrc="/images/default-album-art.svg"
                                                alt={music.title}
                                                className="w-16 h-16 object-cover rounded bg-gray-400 dark:bg-gray-600 border border-gray-300 dark:border-gray-500"
                                            />
                                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300 rounded-md opacity-0 group-hover:opacity-100 flex items-center justify-center">
                                                <Play className="w-8 h-8 text-white cursor-pointer" />
                                            </div>
                                        </div>
                                        <div className="ml-4 flex-grow">
                                            <Link href={`/music/${music.slug}`}>
                                                <span className="text-xl font-semibold mb-2 hover:underline">{music.title}</span>
                                            </Link>
                                            <div className="flex justify-between items-center gap-4">
                                                <div className="flex justify-between gap-2 items-center dark:text-gray-300">
                                                    <div className="flex items-center">
                                                        <UserIcon className="w-4 h-4 mr-2" />
                                                        <span>{music.artist.name}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Tag className="w-4 h-4 mr-2" />
                                                        <span>{music.genre.name}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Clock className="w-4 h-4 mr-2" />
                                                        <span>{formatDuration(music.duration)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 p-1 px-2 text-sm rounded-lg bg-gray-400/50 dark:bg-gray-600/50 ">
                                                        <span>Downloads:</span>
                                                        <span>{music.download_counts}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handlePlay(music)}
                                                        className="flex items-center gap-2 p-2 border border-gray-400 dark:border-gray-600 bg-gray-400/50 dark:bg-gray-600/50 rounded-lg text-white"
                                                    >
                                                        {isPlaying && selectedPlayerMusic?.id === music.id ? (
                                                            <Pause className="h-4 w-4" />
                                                        ) : (
                                                            <Play className="h-4 w-4" />
                                                        )}
                                                        <div className="text-sm">
                                                            {isPlaying && selectedPlayerMusic?.id === music.id ? 'Pause' : 'Play'}
                                                        </div>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDownloadStart(music)}
                                                        className="flex items-center gap-2 p-2 bg-blue-600 rounded-lg text-white"
                                                        disabled={downloadingMusicIds.includes(music.id)}
                                                    >
                                                        <Download className="h-4 w-4" />
                                                        <div className="text-sm">
                                                            {downloadingMusicIds.includes(music.id) ? 'Downloading...' : 'Download'}
                                                        </div>
                                                    </button>
                                                    <button
                                                        onClick={() => handleShare(music.id)}
                                                        className="flex items-center p-2 bg-green-600 rounded-lg text-white"
                                                    >
                                                        <Share2 className="h-4 w-4" />
                                                    </button>
                                                    {user && (
                                                        <button
                                                            onClick={() => handleLike(music.id)}
                                                            className={`flex items-center p-2 rounded-lg text-white ${
                                                                likedMusicIds.includes(music.id)
                                                                    ? 'bg-red-500'
                                                                    : 'bg-gray-500'
                                                            }`}
                                                            disabled={isLoading.like}
                                                        >
                                                            <Heart className={`h-4 w-4 ${
                                                                likedMusicIds.includes(music.id) ? 'fill-white' : ''
                                                            }`} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-800/50 rounded-lg p-8 text-center text-gray-400">
                            <p className="text-lg">No music found.</p>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-end items-center mt-6 space-x-2">
                            <button
                                className={`px-4 py-2 rounded-md ${currentPage === 1 || downloadingMusicIds.length > 0 ? 'bg-gray-400/50 dark:bg-gray-600 hover:bg-gray-500 cursor-not-allowed' : 'bg-gray-400/50 dark:bg-gray-600 hover:bg-gray-500'}`}
                                disabled={currentPage === 1 || downloadingMusicIds.length > 0}
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 bg-gray-400/50 dark:bg-gray-600 rounded-md">{currentPage} / {totalPages}</span>
                            <button
                                className={`px-4 py-2 rounded-md ${currentPage === totalPages || downloadingMusicIds.length > 0 ? 'bg-gray-300 dark:bg-gray-700  cursor-not-allowed' : 'bg-gray-400/50 dark:bg-gray-600 hover:bg-gray-500'}`}
                                disabled={currentPage === totalPages || downloadingMusicIds.length > 0}
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>

                {/* Download Modal */}
                {showModal && selectedMusic && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                        <div className="dark:bg-gray-800 bg-white p-6 rounded-lg w-80 text-center">
                            <h2 className="text-xl font-semibold mb-4">Downloading...</h2>
                            {!isFileVerified && (
                                <div className="mb-4">
                                    <span className="text-sm text-green-400">Verifying file...</span>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="h-1 bg-green-500 rounded-full mt-2"
                                    />
                                </div>
                            )}
                            {isFileVerified && (
                                <div className="relative pt-1">
                                    <div className="flex mb-2 items-center justify-between">
                                        <span className="text-sm">Downloading file...</span>
                                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-200 text-green-600">
                                            {downloadProgress}%
                                        </span>
                                    </div>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${downloadProgress}%` }}
                                        transition={{ duration: 0.5 }}
                                        className="flex rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-center h-2"
                                    />
                                </div>
                            )}
                            {error && (
                                <div className="text-red-500 mt-4">
                                    Failed to download file. Please try again.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Hidden audio element for playing music */}
            <audio ref={audioRef} className="hidden" />

            {/* Audio Player */}
            {showPlayerModal && selectedPlayerMusic && (
                <AudioPlayer
                    // @ts-ignore - Type mismatch is expected but compatible
                    music={selectedPlayerMusic}
                    onClose={() => {
                        setShowPlayerModal(false);
                        // Don't set isPlaying directly, let the event listener handle it
                        if (audioRef.current) {
                            audioRef.current.pause();
                            // The pause event will trigger the event listener which will update isPlaying
                        }
                        // Note: We don't clear the global now playing state here
                        // because we want the music to continue playing in the background
                    }}
                />
            )}

            {/* Motion Alert for Success & Error Notifications */}
            <MotionAlert
                show={!!motionAlert}
                message={motionAlert ? motionAlert.message : ''}
                type={motionAlert ? motionAlert.type : 'success'}
            />
        </WithLayout>
    );
}

export default Music;
