import React from 'react';
import { Music } from '@/types';
import PaginatedTable from '@/Components/PaginatedTable';
import { Pencil, Trash2 } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Props {
  musics: Music[];
  onTogglePublish?: (id: number, value: boolean) => void;
  onToggleFeatured?: (id: number, value: boolean) => void;
}

export default function MusicTable({ musics, onTogglePublish, onToggleFeatured }: Props) {
  return (
    <PaginatedTable
      items={musics}
      getRowId={(m) => m.id}
      columns={[
        { label: 'Title', key: 'title' },
        { label: 'Artist', key: 'artist.name' },
        { label: 'Genre', key: 'genre.name' },
        { label: 'Duration', key: 'duration' },
        {
          label: 'Published',
          key: 'is_published',
          type: 'toggle',
          onToggle: onTogglePublish,
        },
        {
          label: 'Featured',
          key: 'is_featured',
          type: 'toggle',
          onToggle: onToggleFeatured,
        },
        {
          label: 'Actions',
          type: 'custom',
          render: (music) => (
            <div className="flex gap-2 justify-end">
              <Link
                href={`/tracks/${music.slug}/edit`}
                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-600"
              >
                <Pencil size={18} />
              </Link>
              <button
                onClick={() => console.log('Delete', music.slug)}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ),
        },
      ]}
    />
  );
}
