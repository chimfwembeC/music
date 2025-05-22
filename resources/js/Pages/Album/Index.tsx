import PaginatedTable from '@/Components/PaginatedTable';
import PrimaryButton from '@/Components/PrimaryButton';
import WithLayout from '@/Components/WithLayout';
import useRoute from '@/Hooks/useRoute';
import AppLayout from '@/Layouts/AppLayout';
import { Album } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Pencil, PlusCircle, Trash2 } from 'lucide-react';
import React from 'react';

export default function Index({ albums }: Album) {
  const route = useRoute();

  const handleTogglePublish = (musicId: number, newValue: boolean) => {
    router.patch(route('albums.toggle-publish', { id: musicId }), {
      is_published: newValue,
      preserveScroll: true,
    });
  };

  const handleToggleFeatured = (musicId: number, newValue: boolean) => {
    router.patch(route('albums.toggle-featured', { id: musicId }), {
      is_featured: newValue,
      preserveScroll: true,
    });
  };
  return (
    <WithLayout
      title="Albums"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Albums Management
        </h2>
      )}
    >
      <div className="py-12">
        <div className="max-w-5xl h-screen m-auto mt-4">
          <div className="flex justify-end mb-4">
            <PrimaryButton onClick={() => router.get(route('albums.create'))}>
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Album
            </PrimaryButton>
          </div>
          <PaginatedTable
            items={albums}
            getRowId={album => album?.id}
            columns={[
              {
                label: 'Image',
                type: 'custom',
                render: album => (
                  <img
                    src={`/storage/${album?.image_url}`}
                    alt={album?.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                ),
              },
              { label: 'Artist', key: 'artist.name' },
              { label: 'Genre', key: 'genre.name' },
              { label: 'Duration', key: 'duration' },
              {
                label: 'Published',
                key: 'is_published',
                type: 'toggle',
                onToggle: handleTogglePublish,
              },
              {
                label: 'Featured',
                key: 'is_featured',
                type: 'toggle',
                onToggle: handleToggleFeatured,
              },
              {
                label: 'Actions',
                type: 'custom',
                render: album => (
                  <div className="flex gap-2 justify-center">
                    <Link
                      href={`/albums/${album?.slug}/edit`}
                      className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-600"
                    >
                      <Pencil size={18} />
                    </Link>
                    <button
                      onClick={() => console.log('Delete', album?.slug)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </WithLayout>
  );
}
