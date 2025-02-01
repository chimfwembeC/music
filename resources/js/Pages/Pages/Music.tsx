import React, { useState } from 'react';
import { Play, Clock, Calendar, User, Tag, Download, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import GuestLayout from '@/Layouts/GuestLayout';

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
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [isFileVerified, setIsFileVerified] = useState(false);
    const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);
    const [downloadingMusicIds, setDownloadingMusicIds] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);

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
        setShowModal(true);  // Open the modal immediately
        setDownloadProgress(0);
        setIsFileVerified(false);  // Start with the file not verified
        setError(null);  // Reset any previous errors

        // After the modal opens, start the download process
        handleDownload(music);  // Now we trigger handleDownload here
    };

    const handleDownload = async (music: Music) => {
        if (!music || downloadingMusicIds.includes(music.id)) return;

        const audioUrl = music.file_url;
        console.log('Attempting to download from:', audioUrl);

        try {
            // First verify the file exists (this is the HEAD request)
            const verificationResponse = await fetch(audioUrl, {
                method: 'HEAD',
                headers: {
                    'Content-Type': 'application/octet-stream',
                },
            });

            if (!verificationResponse.ok) {
                throw new Error('File not found or unable to fetch');
            }

            // If verification passes, set isFileVerified to true
            setIsFileVerified(true);

            // Start actual download (the GET request)
            const response = await fetch(audioUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/octet-stream',
                },
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

                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = `${music.original_filename}.mp3`;
                    link.click();

                    URL.revokeObjectURL(downloadUrl);
                    setDownloadingMusicIds((prev) => prev.filter(id => id !== music.id));
                    setShowModal(false);
                    return;
                }

                if (value) {
                    chunks.push(value);
                    receivedBytes += value.length;
                    const progress = Math.round((receivedBytes / totalBytes) * 100);
                    setDownloadProgress(progress);
                }

                setTimeout(readStream, 0);
            };

            await readStream();
        } catch (error) {
            console.error('Error during download:', error);
            setIsFileVerified(false);  // If there was an error, file is not verified
            setDownloadProgress(0);
            setDownloadingMusicIds((prev) => prev.filter(id => id !== music.id));
            setShowModal(false);
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsDownloading(false);
        }
    };


    const handleShare = (musicId: number) => {
        const music = musics.find((m) => m.id === musicId);
        if (music) {
            const shareData = {
                title: music.title,
                text: `Check out this song: ${music.title} by ${music.artist.name}`,
                url: music.file_url,
            };

            if (navigator.share) {
                navigator.share(shareData)
                    .then(() => console.log('Successfully shared'))
                    .catch((error) => console.error('Error sharing:', error));
            } else {
                console.log('Web Share API not supported in this browser');
            }
        }
    };

    return (
        <GuestLayout title="Music">
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-6">Music</h1>

                    {/* Search & Filter Controls */}
                    <div className="mb-6 flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Search by title..."
                            className="p-3 bg-gray-800 text-white rounded-md w-full md:w-1/2"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <select
                            className="p-3 bg-gray-800 text-white rounded-md w-full md:w-1/4"
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
                                    className="bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-700/50 transition-all duration-300 backdrop-blur-sm"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    whileHover={{ scale: 1.01 }}
                                >
                                    <div className="flex items-center p-4">
                                        <div className="relative group w-20 h-20 flex-shrink-0">
                                            <img
                                                src={music.image_url && 'https://placehold.jp/150x150.png'}
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
                                                    <span>{music.artist?.name}</span>
                                                </div>
                                                <div className="flex items-center text-gray-300">
                                                    <Tag className="w-4 h-4 mr-2" />
                                                    <span>{music.genre?.name}</span>
                                                </div>
                                                <div className="flex items-center text-gray-300">
                                                    <Clock className="w-4 h-4 mr-2" />
                                                    <span>{formatDuration(music.duration)}</span>
                                                </div>
                                                <div className="flex items-center text-gray-300">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    <span>{new Date(music.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Download, Share, Play Buttons */}
                                    <div className="p-4 flex justify-between items-center bg-gray-700/50 rounded-b-lg">
                                        <button
                                            onClick={() => handleDownloadStart(music)}
                                            className="flex items-center px-4 py-2 bg-blue-600 rounded-lg text-white"
                                            disabled={downloadingMusicIds.includes(music.id)}
                                        >
                                            <Download className="mr-2" />
                                            {downloadingMusicIds.includes(music.id) ? 'Downloading...' : 'Download'}
                                        </button>
                                        <button
                                            onClick={() => handleShare(music.id)}
                                            className="flex items-center px-4 py-2 bg-green-600 rounded-lg text-white"
                                        >
                                            <Share2 className="mr-2" />
                                            Share
                                        </button>
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
                        <div className="flex justify-center mt-6 space-x-2">
                            <button
                                className={`px-4 py-2 rounded-md ${currentPage === 1 || downloadingMusicIds.length > 0 ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-500'}`}
                                disabled={currentPage === 1 || downloadingMusicIds.length > 0}
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 bg-gray-700 rounded-md">{currentPage} / {totalPages}</span>
                            <button
                                className={`px-4 py-2 rounded-md ${currentPage === totalPages || downloadingMusicIds.length > 0 ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-500'}`}
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
                        <div className="bg-gray-800 p-6 rounded-lg w-80 text-center">
                            <h2 className="text-xl font-semibold mb-4">Downloading...</h2>

                            {/* File verification status */}
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

                            {/* Download progress */}
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

                            {/* Error state */}
                            {error && (
                                <div className="text-red-500 mt-4">
                                    Failed to download file. Please try again.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}

export default Music;
