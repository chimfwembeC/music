import AppLayout from '@/Layouts/AppLayout';
import React from 'react';
import AddGenreForm from './Components/AddGenreForm';

export default function Create() {
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
        <AddGenreForm />
      </div>
    </AppLayout>
  );
}
