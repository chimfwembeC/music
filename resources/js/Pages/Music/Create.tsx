import useTypedPage from '@/Hooks/useTypedPage';
import AppLayout from '@/Layouts/AppLayout';
import React, { useRef, useState } from 'react';
import UpdateProfileInformationForm from '../Profile/Partials/UpdateProfileInformationForm';
import SectionBorder from '@/Components/SectionBorder';
import { useForm } from '@inertiajs/react';
import AddMusicForm from './Components/AddMusicForm';
import { useRoute } from 'ziggy-js';

export default function Create({albums, genres, artists}) {
  const page = useTypedPage();

  return (
    <AppLayout
      title="Add Music"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
        Music
        </h2>
      )}
    >
      <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
        <div>
          <AddMusicForm albums={albums} genres={genres} artists={artists} />

          <SectionBorder />
        </div>
      </div>
    </AppLayout>
  );
}
