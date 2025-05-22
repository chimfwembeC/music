import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Playlist } from '@/types';
import PaginatedTable from '@/Components/PaginatedTable';
import { Pencil, Trash2, PlusCircle, Eye } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useRoute } from '@/Hooks/useRoute';
import PrimaryButton from '@/Components/PrimaryButton';
import WithLayout from '@/Components/WithLayout';

interface Props {
  playlists: Playlist[];
}

export default function Index({ playlists }: Props) {
  const route = useRoute();

  const handleTogglePublic = (playlistId: number, newValue: boolean) => {
    router.patch(route('playlists.toggle-public', { id: playlistId }), {
      is_public: newValue,
      preserveScroll: true,
    });
  };

  const handleDelete = (playlistId: number) => {
    if (confirm('Are you sure you want to delete this playlist?')) {
      router.delete(route('playlists.destroy', { id: playlistId }), {
        preserveScroll: true,
      });
    }
  };

  return (
    <WithLayout
      title="Playlists"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Playlist Management
        </h2>
      )}
    >
      <div className="py-12">
        <div className="max-w-5xl h-screen m-auto mt-4">
          <div className="flex justify-end mb-4">
            <PrimaryButton onClick={() => router.get(route('playlists.create'))}>
              <PlusCircle className="h-4 w-4 mr-1" />
              Create Playlist
            </PrimaryButton>
          </div>
          <PaginatedTable
            items={playlists}
            getRowId={playlist => playlist.id}
            columns={[
              {
                label: 'Image',
                type: 'custom',
                render: playlist => (
                  <img
                    src={playlist.image_url ? `/storage/${playlist.image_url}` : '/images/default-playlist.jpg'}
                    alt={playlist.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                ),
              },
              { label: 'Name', key: 'name' },
              { label: 'Creator', key: 'user.name' },
              {
                label: 'Tracks',
                type: 'custom',
                render: playlist => (
                  <span>{playlist.tracks_count || 0}</span>
                )
              },
              {
                label: 'Public',
                key: 'is_public',
                type: 'toggle',
                onToggle: handleTogglePublic,
              },
              {
                label: 'Actions',
                type: 'custom',
                render: playlist => (
                  <div className="flex gap-2 justify-center">
                    <Link
                      href={route('playlists.show', { id: playlist.id })}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600"
                    >
                      <Eye size={18} />
                    </Link>
                    <Link
                      href={route('playlists.edit', { id: playlist.id })}
                      className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-600"
                    >
                      <Pencil size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(playlist.id)}
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
