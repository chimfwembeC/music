import PrimaryButton from '@/Components/PrimaryButton';
import useRoute from '@/Hooks/useRoute';
import AppLayout from '@/Layouts/AppLayout';
import { router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import React from 'react';
import MusicTable from './Components/MusicTable';
import { Music } from '@/types';

interface Props {
  musics: Music[];
}

export default function Index({ musics }: Props) {
  const route = useRoute();

  const handleTogglePublish = (musicId: number, newValue: boolean) => {
    router.patch(route('tracks.toggle-publish', { id: musicId }), {
      is_published: newValue,
      preserveScroll: true,
    });
  };

  const handleToggleFeatured = (musicId: number, newValue: boolean) => {
    router.patch(route('tracks.toggle-featured', { id: musicId }), {
      is_featured: newValue,
      preserveScroll: true,
    });
  };

  return (
    <AppLayout
      title="Music"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Music Management
        </h2>
      )}
    >
      <div className="max-w-5xl h-screen m-auto mt-4">
        <div className="flex justify-end mb-4">
          <PrimaryButton onClick={() => router.get(route('tracks.create'))}>
            <Plus className="h-4 w-4 mr-1" />
            Add Music
          </PrimaryButton>
        </div>

        <MusicTable
          musics={musics}
          onTogglePublish={handleTogglePublish}
          onToggleFeatured={handleToggleFeatured}
        />
        
      </div>
    </AppLayout>
  );
}
