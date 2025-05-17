import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Playlist, Music } from '@/types';
import { Play, Clock, Download, Share2, Heart, Edit, MoreHorizontal } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useRoute } from '@/Hooks/useRoute';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

interface Props {
  playlist: Playlist & {
    tracks: Music[];
  };
  isOwner: boolean;
}

export default function Show({ playlist, isOwner }: Props) {
  const route = useRoute();
  
  // Format duration from seconds to MM:SS
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Calculate total duration of all tracks
  const totalDuration = playlist.tracks?.reduce((total, track) => total + (track.duration || 0), 0) || 0;
  const formattedTotalDuration = formatDuration(totalDuration);

  return (
    <AppLayout
      title={playlist.name}
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {playlist.name}
        </h2>
      )}
    >
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
            {/* Playlist Header */}
            <div className="flex flex-col md:flex-row p-6 gap-6">
              {/* Playlist Cover */}
              <div className="w-full md:w-64 h-64 flex-shrink-0">
                <img
                  src={playlist.image_url ? `/storage/${playlist.image_url}` : '/images/default-playlist.jpg'}
                  alt={playlist.name}
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </div>
              
              {/* Playlist Info */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 uppercase font-semibold">Playlist</div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{playlist.name}</h1>
                  
                  {playlist.description && (
                    <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-2xl">
                      {playlist.description}
                    </p>
                  )}
                  
                  <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Created by {playlist.user?.name}</span>
                    <span className="mx-2">•</span>
                    <span>{playlist.tracks?.length || 0} tracks</span>
                    <span className="mx-2">•</span>
                    <span>{formattedTotalDuration}</span>
                    <span className="mx-2">•</span>
                    <span>{playlist.is_public ? 'Public' : 'Private'}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-6">
                  <PrimaryButton className="flex items-center gap-1">
                    <Play size={16} />
                    Play All
                  </PrimaryButton>
                  
                  {isOwner && (
                    <Link href={route('playlists.edit', { id: playlist.id })}>
                      <SecondaryButton className="flex items-center gap-1">
                        <Edit size={16} />
                        Edit
                      </SecondaryButton>
                    </Link>
                  )}
                  
                  <SecondaryButton className="flex items-center gap-1">
                    <Download size={16} />
                    Download
                  </SecondaryButton>
                  
                  <SecondaryButton className="flex items-center gap-1">
                    <Share2 size={16} />
                    Share
                  </SecondaryButton>
                </div>
              </div>
            </div>
            
            {/* Tracks List */}
            <div className="px-6 pb-6">
              <table className="w-full mt-4">
                <thead className="border-b border-gray-200 dark:border-gray-700">
                  <tr className="text-left text-xs text-gray-500 dark:text-gray-400 uppercase">
                    <th className="pb-3 pl-4">#</th>
                    <th className="pb-3">Title</th>
                    <th className="pb-3">Artist</th>
                    <th className="pb-3">Album</th>
                    <th className="pb-3 text-right pr-4">
                      <Clock size={16} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {playlist.tracks && playlist.tracks.length > 0 ? (
                    playlist.tracks.map((track, index) => (
                      <tr 
                        key={track.id} 
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="py-4 pl-4 text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                        <td className="py-4">
                          <div className="flex items-center">
                            {track.image_url && (
                              <img 
                                src={`/storage/${track.image_url}`} 
                                alt={track.title} 
                                className="w-10 h-10 mr-3 rounded"
                              />
                            )}
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{track.title}</div>
                              {track.genre && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">{track.genre.name}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-gray-700 dark:text-gray-300">
                          {track.artist?.name}
                        </td>
                        <td className="py-4 text-sm text-gray-700 dark:text-gray-300">
                          {track.album?.title || '-'}
                        </td>
                        <td className="py-4 text-right pr-4 text-sm text-gray-500 dark:text-gray-400">
                          {formatDuration(track.duration)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-gray-500 dark:text-gray-400">
                        This playlist is empty
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
