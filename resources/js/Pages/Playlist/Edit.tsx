import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import UpdatePlaylistForm from './Components/UpdatePlaylistForm';
import { Music, Playlist } from '@/types';
import WithLayout from '@/Components/WithLayout';

interface Props {
  playlist: Playlist;
  tracks: Music[];
}

export default function Edit({ playlist, tracks }: Props) {
  return (
    <WithLayout
      title="Edit Playlist"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Edit Playlist
        </h2>
      )}
    >
      <div className="max-w-5xl h-screen m-auto mt-4">
        <UpdatePlaylistForm playlist={playlist} tracks={tracks} />
      </div>
    </WithLayout>
  );
}
