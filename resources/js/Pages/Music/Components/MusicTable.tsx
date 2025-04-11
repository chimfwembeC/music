import React from 'react';
import PaginatedTable from '@/Components/PaginatedTable';
import { Music } from '@/types';
import { Pencil, Trash2 } from 'lucide-react';
import { Link } from '@inertiajs/react';
import ToggleSwitch from '@/Components/ToggleSwitch';
import classNames from 'classnames';

interface Props {
  musics: Music[];
  onTogglePublish?: (musicId: number, newValue: boolean) => void;
  onToggleFeatured?: (musicId: number, newValue: boolean) => void;
}

export default function MusicTable({
  musics,
  onTogglePublish,
  onToggleFeatured,
}: Props) {
  return (
    <PaginatedTable
      items={musics}
      itemsPerPage={10}
      headers={
        <>
          <th className="px-4 py-3">Title</th>
          <th className="px-4 py-3">Artist</th>
          <th className="px-4 py-3">Genre</th>
          <th className="px-4 py-3">Album</th>
          <th className="px-4 py-3">Duration</th>
          <th className="px-4 py-3">Published</th>
          <th className="px-4 py-3">Featured</th>
          <th className="px-4 py-3 text-right">Actions</th>
        </>
      }
      renderRow={(music, idx) => (
        <tr
          key={music.id}
          className={classNames(
            'border-b border-gray-200 dark:border-gray-800',
            {
              'bg-gray-50 dark:bg-gray-800/50': idx % 2 === 1,
            }
          )}
        >
          <td className="px-4 py-3">{music.title}</td>
          <td className="px-4 py-3">{music.artist?.name ?? '-'}</td>
          <td className="px-4 py-3">{music.genre?.name ?? '-'}</td>
          <td className="px-4 py-3">{music.album?.title ?? '—'}</td>
          <td className="px-4 py-3">{music.duration}s</td>
          <td className="px-4 py-3">
            <ToggleSwitch
              checked={music.is_published}
              onChange={checked => onTogglePublish?.(music.id, checked)}
              color="green"
            />
          </td>
          <td className="px-4 py-3">
            <ToggleSwitch
              checked={music.is_featured}
              onChange={checked => onToggleFeatured?.(music.id, checked)}
              color="yellow"
            />
          </td>
          <td className="px-4 py-3 text-right flex gap-2 justify-end">
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
          </td>
        </tr>
      )}
    />
  );
}
