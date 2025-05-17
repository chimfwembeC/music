import React from 'react';
import { Link } from '@inertiajs/react';
import { Playlist } from '@/types';

interface PlaylistCardProps {
  playlist: Playlist;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link href={`/playlists/${playlist.id}`}>
        <div className="relative pb-[100%]">
          <img
            src={playlist.image_url || '/images/default-playlist.jpg'}
            alt={playlist.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
            <span className="text-white text-xs font-medium px-2 py-1 rounded bg-gray-800/50">
              {playlist.tracks_count || 0} tracks
            </span>
            {!playlist.is_public && (
              <span className="text-white text-xs font-medium px-2 py-1 rounded bg-gray-800/50 ml-2">
                Private
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/playlists/${playlist.id}`}>
          <h3 className="font-medium text-gray-900 dark:text-white truncate">{playlist.name}</h3>
        </Link>
        {playlist.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
            {playlist.description}
          </p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Created: {new Date(playlist.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default PlaylistCard;
