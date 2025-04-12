import PaginatedTable from '@/Components/PaginatedTable';
import PrimaryButton from '@/Components/PrimaryButton';
import useRoute from '@/Hooks/useRoute';
import AppLayout from '@/Layouts/AppLayout';
import { Blog } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Pencil, PlusCircle, Trash2 } from 'lucide-react';
import React from 'react';

export default function Index({ blogs }: Blog) {
  const route = useRoute();

  const onTogglePublish = (id: number, value: boolean) => {
    router.patch(route('blogs.toggle-publish', { id: id }), {
      is_published: value,
      preserveScroll: true,
    });
  };
  return (
    <AppLayout
      title="blogs"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Music Management
        </h2>
      )}
    >
      <div className="py-12">
        <div className="max-w-5xl h-screen m-auto">
          <div className="flex justify-end mb-4">
            <PrimaryButton onClick={() => router.get(route('blogs.create'))}>
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Blog
            </PrimaryButton>
          </div>

          <PaginatedTable
            items={blogs}
            getRowId={b => b.id}
            columns={[
              {
                label: 'Image',
                type: 'custom',
                render: b => (
                  <img
                    src={`/storage/${b?.image_url}`}
                    alt={b?.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                ),
              },
              { label: 'Title', key: 'title' },
              { label: 'content', key: 'content' },
              {
                label: 'Published',
                key: 'is_published',
                type: 'toggle',
                onToggle: onTogglePublish,
              },

              {
                label: 'Actions',
                type: 'custom',
                render: blog => (
                  <div className="flex gap-2 justify-end">
                    <Link
                      href={`/blogs/${blog?.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-600"
                    >
                      <Pencil size={18} />
                    </Link>
                    <button
                      onClick={() => console.log('Delete', blog?.id)}
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
    </AppLayout>
  );
}
