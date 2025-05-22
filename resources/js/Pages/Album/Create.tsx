import AppLayout from '@/Layouts/AppLayout';
import React from 'react';
import AddAlbumForm from './Components/AddAlbumForm';
import WithLayout from '@/Components/WithLayout';

export default function Create({genres, artists}) {
  return (
    <WithLayout
      title="Albums"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Album
        </h2>
      )}
    >
      <div className="max-w-5xl h-screen m-auto mt-4">
        <AddAlbumForm genres={genres} artists={artists} />
      </div>
    </WithLayout>
  );
}
