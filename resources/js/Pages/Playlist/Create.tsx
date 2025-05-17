import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import AddPlaylistForm from './Components/AddPlaylistForm';
import { Music } from '@/types';

interface Props {
  tracks: Music[];
}

export default function Create({ tracks }: Props) {
  return (
    <AppLayout
      title="Create Playlist"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Create New Playlist
        </h2>
      )}
    >
      <div className="max-w-5xl h-screen m-auto mt-4">
        <AddPlaylistForm tracks={tracks} />
      </div>
    </AppLayout>
  );
}
