import MediaPlayerModal from '@/Components/MediaPlayerModal'
import MotionAlert from '@/Components/MotionAlert'
import GuestLayout from '@/Layouts/GuestLayout'
import { Link } from '@inertiajs/react'
import axios from 'axios'
import { Download, Share2 } from 'lucide-react'
import React, { useState } from 'react'
import { motion } from 'framer-motion';


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

export default function Show({ music }) {

    //  MotionAlert state for success and error notifications
    const [motionAlert, setMotionAlert] = useState<{ message: string, type: "success" | "error" } | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isFileVerified, setIsFileVerified] = useState(false);
    const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);
    const [downloadingMusicIds, setDownloadingMusicIds] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleAlbumDownload = (album) => {
        axios.get(`/albums/${album?.id}/download`, { responseType: 'blob' })
            .then((response) => {
                const blob = response.data;
                const link = document.createElement('a');
                const filename = `${album?.title}.zip`;
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                link.click();
                URL.revokeObjectURL(link.href);
                setMotionAlert({ message: 'Download successfully: ' + album?.title, type: 'success' });
            })
            .catch(() => {
                setMotionAlert({ message: 'Error downloading: ' + album?.title, type: 'error' });
            });
    };


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
        const song = music.find((m) => m.id === musicId);
        if (song) {
            // Construct a human-friendly URL for the music page.
            const shareUrl = `${window.location.origin}/music/${song.slug}`;
            const shareData = {
                title: song.title,
                text: `Check out this song: ${song.title} by ${song.artist.name}`,
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

    return (
        <GuestLayout title={"music"}>
            <div className='h-full w-full px-6 mt-8'>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">

                    <div className="col-span col-span-2">
                        <div className="bg-gray-100 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 rounded-lg p-4">

                            <div className="text-2xl">Music Details</div>
                            <div className="border border-t -mx-4 my-4 border-gray-300 dark:border-gray-600 rounded-lg" />

                            <div className="">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="block md:flex  gap-4 bg-white dark:bg-gray-900 p-6 rounded-lg w-full relative"
                                >

                                    <img
                                        src={`${music.image_url}`}
                                        alt={music.title}
                                        className='h-64 w-full lg:w-auto border border-gray-400 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 rounded-lg'
                                    />

                                    <div className="w-full">
                                        <h2 className="text-xl font-bold mb-2">{music.title}</h2>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4">{music.artist.name}</p>
                                        <p className="text-md text-gray-400">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore reiciendis corporis excepturi quis suscipit corrupti ea quam, dolor laudantium expedita adipisci dicta praesentium quasi, natus id eum repellendus optio cupiditate?
                                        </p>
                                        <audio controls className="w-full">
                                            <source src={music.file_url} type="audio/mpeg" />
                                            Your browser does not support the audio element.
                                        </audio>

                                        <div className="mt-2">
                                            <div className="flex gap-2 text-xs">
                                                <span className='bg-gray-400 dark:bg-gray-600 p-1 rounded-lg'>Downloads: {music?.download_counts}</span>
                                                <span className='bg-gray-400 dark:bg-gray-600 p-1 rounded-lg'>{music.genre?.name}</span>
                                            </div>

                                            <div className="flex justify-end">
                                                <div className="flex gap-2">
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
                            </div>
                        </div>
                    </div>

                    <div className="col-span col-span-1">
                        <div className="bg-gray-100 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 rounded-lg p-4">

                            <div className="text-2xl">Artist Details</div>
                            <div className="border border-t -mx-4 my-4 border-gray-300 dark:border-gray-600 rounded-lg" />

                            <img className='h-28 w-28 border border-gray-400 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 rounded-lg' src={music.artist?.image_url} alt={music.artist?.title} />
                            <div className="border border-t -mx-4 my-4 border-gray-300 dark:border-gray-600" />
                            <Link href={`/artists/${music.artist?.id}`}>
                                <span className='text-2xl hover:underline'>{music.artist?.name}</span>
                            </Link>
                            <p className='text-sm'>Bio: {music.artist?.bio}</p>

                            {/* <p>Artist name: {artist.name}</p> */}
                        </div>

                        {music.album && (
                            <div className="bg-gray-100 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 rounded-lg p-4 mt-4">

                                <div className="text-2xl">Album Details</div>
                                <div className="border border-t -mx-4 my-4 border-gray-300 dark:border-gray-600 rounded-lg" />

                                <img className='h-28 w-28 border border-gray-400 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 rounded-lg' src={`${music.album?.image_url}`} alt={music.album?.title} />
                                <div className="border border-t -mx-4 my-4 border-gray-300 dark:border-gray-600" />
                                <Link href={`/albums/${music.album?.id}`}>
                                    <span className='text-2xl hover:underline'>{music.album?.title}</span>
                                </Link>
                                {/* <p className='text-sm'>Tracks: {music.album?.tracks}</p> */}
                                <p className='text-xs'>Downloads: {music.album?.download_counts}</p>
                                {/* <p>Artist name: {artist.name}</p> */}
                                <div className="flex justify-end">
                                    <button className="flex gap-2 p-2 bg-gray-400 dark:bg-gray-600 rounded-lg cursor-pointer" type='button' onClick={() => handleAlbumDownload(music?.album)}>
                                        Download <Download className='text-gray-200 dark:text-white' size={20} />
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>


                </div>



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

            <MotionAlert
                show={!!motionAlert}
                message={motionAlert ? motionAlert.message : ''}
                type={motionAlert ? motionAlert.type : 'success'}
            />
        </GuestLayout>
    )
}
