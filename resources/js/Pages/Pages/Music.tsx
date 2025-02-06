import React, { useState } from 'react';
import { Play, Clock, User, Tag, Download, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import GuestLayout from '@/Layouts/GuestLayout';
import { Link } from '@inertiajs/react';
import MediaPlayerModal from '@/Components/MediaPlayerModal';
import MotionAlert from '@/Components/MotionAlert';
import axios from 'axios';

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
    // Search, filter, pagination & download states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [isFileVerified, setIsFileVerified] = useState(false);
    const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);
    const [downloadingMusicIds, setDownloadingMusicIds] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Media Player Modal states
    const [selectedPlayerMusic, setSelectedPlayerMusic] = useState<Music | null>(null);
    const [showPlayerModal, setShowPlayerModal] = useState(false);

    // MotionAlert state for success and error notifications
    const [motionAlert, setMotionAlert] = useState<{ message: string, type: "success" | "error" } | null>(null);

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
            setIsDownloading(true);

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

                    // send downloads increment count
                    const response = await axios.post(`/music/${music.id}/download`);

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
            setIsDownloading(false);
        }
    };

    const handleShare = (musicId: number) => {
        const music = musics.find((m) => m.id === musicId);
        if (music) {
            // Construct a human-friendly URL for the music page.
            const shareUrl = `${window.location.origin}/music/${music.slug}`;
            const shareData = {
                title: music.title,
                text: `Check out this song: ${music.title} by ${music.artist.name}`,
                url: shareUrl,
            };

            if (navigator.share) {
                navigator.share(shareData)
                    .then(() => {
                        setMotionAlert({ message: 'Successfully shared!', type: 'success' });
                        // send downloads increment count
                        axios.post(`/music/${musicId}/share`);
                        setTimeout(() => setMotionAlert(null), 3000);
                    })
                    .catch((error) => {
                        setMotionAlert({ message: 'Error sharing: ' + error.message, type: 'error' });
                        setTimeout(() => setMotionAlert(null), 3000);
                    });
            } else {
                // Fallback: Copy URL to clipboard
                navigator.clipboard.writeText(shareUrl)
                    .then(() => {
                        setMotionAlert({ message: 'Share URL copied to clipboard!', type: 'success' });
                        const response = axios.post(`/music/${musicId}/share`);
                        setTimeout(() => setMotionAlert(null), 3000);
                    })
                    .catch((error) => {
                        setMotionAlert({ message: 'Error copying share URL!', type: 'error' });
                        setTimeout(() => setMotionAlert(null), 3000);
                    });
            }
        }
    };

    // Handle playing music
    const handlePlay = (music: Music) => {
        setSelectedPlayerMusic(music);
        setShowPlayerModal(true);
    };

    return (
        <GuestLayout title="Music">
            <div className="min-h-screen bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 from-gray-200 to-gray-100 dark:text-white text-gray-600">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-6">Discover your favourite songs</h1>

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
                                    className="border border-gray-400 dark:border-gray-600 bg-gray-400/50 dark:bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-300 dark:hover:bg-gray-700/50 transition-all duration-300 backdrop-blur-sm"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    whileHover={{ scale: 1.01 }}
                                >
                                    <div className="flex items-center p-4">
                                        <div className="relative group w-12 h-12 flex-shrink-0">
                                            <img
                                                src={`${music.image_url}`}
                                                alt={music.title}
                                                className="w-12 h-12 object-cover rounded-md bg-gray-400 dark:bg-gray-600 border border-gray-300 dark:border-gray-500"
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
                                                        <User className="w-4 h-4 mr-2" />
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
                                                        <Play className="h-4 w-4" />
                                                        <div className="text-sm">Play</div>
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

            {/* Media Player Modal */}
            {showPlayerModal && selectedPlayerMusic && (
                <MediaPlayerModal
                    music={selectedPlayerMusic}
                    onClose={() => setShowPlayerModal(false)}
                />
            )}

            {/* Motion Alert for Success & Error Notifications */}
            <MotionAlert
                show={!!motionAlert}
                message={motionAlert ? motionAlert.message : ''}
                type={motionAlert ? motionAlert.type : 'success'}
            />
        </GuestLayout>
    );
}

export default Music;
