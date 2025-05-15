import AppLayout from '@/Layouts/AppLayout';
import React from 'react';
import UpdateAlbumForm from './Components/UpdateGenreForm';

export default function Edit({genre}) {
  return (
    <AppLayout
      title="Genres"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Genre
        </h2>
      )}
    >
      <div className="max-w-5xl h-screen m-auto mt-4">
        <UpdateAlbumForm genre={genre} />
      </div>
    </AppLayout>
  );
}
