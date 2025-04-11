import React from 'react';
import { Music } from '@/types';
import { Link } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import classNames from 'classnames';
import ToggleSwitch from '@/Components/ToggleSwitch';

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
    <div className="overflow-x-auto rounded-lg shadow-md bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Artist</th>
            <th className="px-4 py-3">Genre</th>
            <th className="px-4 py-3">Album</th>
            <th className="px-4 py-3">Duration</th>
            <th className="px-4 py-3">Published</th>
            <th className="px-4 py-3">Featured</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {musics.map((music, idx) => (
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

              {/* is_published toggle */}
              <td className="px-4 py-3">
                <ToggleSwitch
                  checked={music.is_published}
                  onChange={checked => onTogglePublish?.(music.id, checked)}
                  color="green"
                />
              </td>

              {/* is_featured toggle */}
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
                  onClick={() => console.log('Delete', music.slug)} // Replace with delete logic
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}

          {musics.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="text-center px-4 py-6 text-gray-500 dark:text-gray-400"
              >
                No music tracks found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
