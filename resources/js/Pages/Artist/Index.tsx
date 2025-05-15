import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import PaginatedTable from '@/Components/PaginatedTable';
import { Artist } from '@/types';
import PrimaryButton from '@/Components/PrimaryButton';
import useRoute from '@/Hooks/useRoute';

interface Props {
  artists: Artist[];
}

export default function Index({ artists }: Props) {
  const route = useRoute();
  const onTogglePublish = (id: number, value: boolean) => {
    console.log('Toggle publish', id, value);
    // Handle publish toggle here (e.g., Inertia POST request)
  };

  const onToggleFeatured = (id: number, value: boolean) => {
    console.log('Toggle featured', id, value);
    // Handle featured toggle here
  };

  return (
    <AppLayout
      title="Artists"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Artist Management
        </h2>
      )}
    >
      <div className="max-w-5xl h-screen m-auto mt-4">
        <div className="flex justify-end mb-4">
          <PrimaryButton onClick={() => router.get(route('artists.create'))}>
            <Plus className="h-4 w-4 mr-1" />
            Add Artist
          </PrimaryButton>
        </div>
        <PaginatedTable
          items={artists}
          getRowId={artist => artist.id}
          columns={[
            {
                label: 'Image',
                type: 'custom',
                render: artist => (
                  <img
                    src={`/storage/${artist.image_url}`}
                    alt={artist.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                ),
              },
            { label: 'Name', key: 'name' },
            { label: 'Bio', key: 'bio' },           
            // {
            //   label: 'Published',
            //   key: 'is_published',
            //   type: 'toggle',
            //   onToggle: onTogglePublish,
            // },
            // {
            //   label: 'Featured',
            //   key: 'is_featured',
            //   type: 'toggle',
            //   onToggle: onToggleFeatured,
            // },
            {
              label: 'Actions',
              type: 'custom',
              render: artist => (
                <div className="flex gap-2 justify-center">
                  <Link
                    href={`/artists/${artist.slug}/edit`}
                    className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-600"
                  >
                    <Pencil size={18} />
                  </Link>
                  <button
                    onClick={() => console.log('Delete', artist.slug)}
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
    </AppLayout>
  );
}
