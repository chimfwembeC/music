import React from 'react';
import { Link } from '@inertiajs/react';
import { Music } from '@/types';

interface MusicCardProps {
  music: Music;
}

const MusicCard: React.FC<MusicCardProps> = ({ music }) => {
  // Format duration from seconds to mm:ss
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
        <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {music.view_count}
          </div>
          <div className="flex items-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {music.like_count}
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {music.download_counts}
          </div>
        </div>
        {music.last_played_at && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Last played: {new Date(music.last_played_at).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default MusicCard;
