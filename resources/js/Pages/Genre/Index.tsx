import PaginatedTable from '@/Components/PaginatedTable';
import PrimaryButton from '@/Components/PrimaryButton';
import useRoute from '@/Hooks/useRoute';
import AppLayout from '@/Layouts/AppLayout';
import { Album, Genre } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Pencil, PlusCircle, Trash2 } from 'lucide-react';
import React from 'react';

export default function Index({ genres }: Genre) {
  const route = useRoute();

  return (
    <AppLayout
      title="Albums"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Genre Management
        </h2>
      )}
    >
      <div className="max-w-5xl h-screen m-auto mt-4">
        <div className="flex justify-end mb-4">
          <PrimaryButton onClick={() => router.get(route('genres.create'))}>
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Genre
          </PrimaryButton>
        </div>
        <PaginatedTable
          items={genres}
          getRowId={genre => genre?.id}
          columns={[
            { label: 'Name', key: 'name' },
            { label: 'Slug', key: 'slug' },
            { label: 'Description', key: 'description' },
            {
              label: 'Actions',
              type: 'custom',
              render: genre => (
                <div className="flex gap-2 justify-center">
                  <Link
                    href={`/genres/${genre?.slug}/edit`}
                    className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-600"
                  >
                    <Pencil size={18} />
                  </Link>
                  <button
                    onClick={() => console.log('Delete', genre?.slug)}
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
