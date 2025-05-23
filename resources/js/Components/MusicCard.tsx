import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Music } from '@/types';
import TrackInteractionService from '@/Services/TrackInteractionService';
import { toast } from 'react-hot-toast';

interface MusicCardProps {
  music: Music;
  onPlay?: (music: Music) => void;
  showControls?: boolean;
}

const MusicCard: React.FC<MusicCardProps> = ({
  music,
  onPlay,
  showControls = true
}) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(music.like_count || 0);
  const [downloadCount, setDownloadCount] = useState<number>(music.download_counts || 0);
  const [viewCount, setViewCount] = useState<number>(music.view_count || 0);
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({
    like: false,
    download: false,
    play: false
  });

  // Check if the track is liked on component mount
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const response = await TrackInteractionService.checkLike(music.id);
        setIsLiked(response.is_liked);
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    checkLikeStatus();
  }, [music.id]);

  // Format duration from seconds to mm:ss
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle play button click
  const handlePlay = async () => {
    if (onPlay) {
      setIsLoading(prev => ({ ...prev, play: true }));
      try {
        // Record a view
        const viewResponse = await TrackInteractionService.recordView(music.id);
        setViewCount(viewResponse.view_count);

        // Call the onPlay callback
        onPlay(music);
      } catch (error) {
        console.error('Error playing track:', error);
        toast.error('Failed to play track. Please try again.');
      } finally {
        setIsLoading(prev => ({ ...prev, play: false }));
      }
    }
  };

  // Handle like button click
  const handleLike = async () => {
    setIsLoading(prev => ({ ...prev, like: true }));
    try {
      const response = await TrackInteractionService.toggleLike(music.id);
      setIsLiked(response.is_liked);
      setLikeCount(response.like_count);
      toast.success(response.is_liked ? 'Added to your likes' : 'Removed from your likes');
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like. Please try again.');
    } finally {
      setIsLoading(prev => ({ ...prev, like: false }));
    }
  };

  // Handle download button click
  const handleDownload = async () => {
    setIsLoading(prev => ({ ...prev, download: true }));
    try {
      const response = await TrackInteractionService.downloadTrack(music.id);
      setDownloadCount(response.downloads);

      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = `/storage/${music.file_url}`;
      link.download = music.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Download started');
    } catch (error) {
      console.error('Error downloading track:', error);
      toast.error('Failed to download. Please try again.');
    } finally {
      setIsLoading(prev => ({ ...prev, download: false }));
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link href={`/music/${music.slug}`}>
        <div className="relative pb-[100%]">
          <img
            src={music.image_url || '/images/default-track.jpg'}
            alt={music.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
            <span className="text-white text-xs font-medium px-2 py-1 rounded bg-gray-800/50">
              {formatDuration(music.duration)}
            </span>
            {music.play_count && (
              <span className="text-white text-xs font-medium px-2 py-1 rounded bg-gray-800/50 ml-2">
                {music.play_count} plays
              </span>
            )}
          </div>

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/30">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePlay();
              }}
              disabled={isLoading.play}
              className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white shadow-lg transform hover:scale-110 transition-transform duration-200"
            >
              {isLoading.play ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/music/${music.slug}`}>
          <h3 className="font-medium text-gray-900 dark:text-white truncate">{music.title}</h3>
        </Link>
        {music.artist && (
          <Link href={`/artists/${music.artist.slug}`}>
            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{music.artist.name}</p>
          </Link>
        )}

        {/* Track stats */}
        <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {viewCount}
          </div>
          <div className="flex items-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {likeCount}
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {downloadCount}
          </div>
        </div>

        {music.last_played_at && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Last played: {new Date(music.last_played_at).toLocaleDateString()}
          </p>
        )}

        {/* Action buttons */}
        {showControls && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={handleLike}
              disabled={isLoading.like}
              className={`flex items-center justify-center p-2 rounded-md ${
                isLiked
                  ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {isLoading.like ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill={isLiked ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>

            <button
              onClick={handlePlay}
              disabled={isLoading.play}
              className="flex items-center justify-center p-2 rounded-md text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
            >
              {isLoading.play ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              )}
            </button>

            <button
              onClick={handleDownload}
              disabled={isLoading.download}
              className="flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isLoading.download ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicCard;
