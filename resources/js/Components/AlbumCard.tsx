import React from 'react';
import { Link } from '@inertiajs/react';
import { Album } from '@/types';

interface AlbumCardProps {
  album: Album;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link href={`/albums/${album.slug}`}>
        <div className="relative pb-[100%]">
          <img
            src={album.image_url || '/images/default-album.jpg'}
            alt={album.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
            {album.tracks_count !== undefined && (
              <span className="text-white text-xs font-medium px-2 py-1 rounded bg-gray-800/50">
                {album.tracks_count} tracks
              </span>
            )}
            {!album.is_published && (
              <span className="text-white text-xs font-medium px-2 py-1 rounded bg-gray-800/50 ml-2">
                Draft
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/albums/${album.slug}`}>
          <h3 className="font-medium text-gray-900 dark:text-white truncate">{album.title}</h3>
        </Link>
        {album.artist && (
          <Link href={`/artists/${album.artist.slug}`}>
            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{album.artist.name}</p>
          </Link>
        )}
        {album.genre && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {album.genre.name}
          </p>
        )}
        <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {album.download_counts}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumCard;
