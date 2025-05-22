import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import AddArtistForm from './Components/AddArtistForm';
import SectionBorder from '@/Components/SectionBorder';
import WithLayout from '@/Components/WithLayout';

export default function Create() {
  return (
    <WithLayout
      title="Add Artist"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Artist
        </h2>
      )}
    >
      <div className="max-w-5xl h-screen m-auto mt-4">
        <AddArtistForm />

        <SectionBorder />
      </div>
    </WithLayout>
  );
}
