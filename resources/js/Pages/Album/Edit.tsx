import AppLayout from '@/Layouts/AppLayout';
import React from 'react';
import UpdateAlbumForm from './Components/UpdateAlbumForm';
import WithLayout from '@/Components/WithLayout';

export default function Edit({album,genres, artists}) {
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
        <UpdateAlbumForm album={album} genres={genres} artists={artists} />
      </div>
    </WithLayout>
  );
}
