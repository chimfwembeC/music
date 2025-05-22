import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { User } from '@/types';
import PaginatedTable from '@/Components/PaginatedTable';
import { Pencil, Trash2, PlusCircle, Eye, UserPlus } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useRoute } from '@/Hooks/useRoute';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import WithLayout from '@/Components/WithLayout';

interface Props {
  users: User[];
}

export default function Index({ users }: Props) {
  const route = useRoute();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);

  const handleToggleActive = (userId: number, newValue: boolean) => {
    router.patch(route('users.toggle-active', { id: userId }), {
      is_active: newValue,
      preserveScroll: true,
    });
  };

  const confirmUserDeletion = (user: User) => {
    setUserToDelete(user);
    setConfirmingUserDeletion(true);
  };

  const deleteUser = () => {
    if (userToDelete) {
      router.delete(route('users.destroy', { id: userToDelete.id }), {
        preserveScroll: true,
        onSuccess: () => closeModal(),
      });
    }
  };

  const closeModal = () => {
    setConfirmingUserDeletion(false);
    setUserToDelete(null);
  };

  return (
    <WithLayout
      title="Users"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          User Management
        </h2>
      )}
    >
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-end mb-4">
            <PrimaryButton onClick={() => router.get(route('users.create'))}>
              <UserPlus className="h-4 w-4 mr-1" />
              Add User
            </PrimaryButton>
          </div>
          <PaginatedTable
            items={users}
            getRowId={user => user.id}
            columns={[
              {
                label: 'Avatar',
                type: 'custom',
                render: user => (
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {user.profile_photo_url ? (
                      <img
                        src={user.profile_photo_url}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 text-sm font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                ),
              },
              { label: 'Name', key: 'name' },
              { label: 'Email', key: 'email' },
              {
                label: 'Role',
                type: 'custom',
                render: user => (
                  <span className="capitalize px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                    {user.role}
                  </span>
                )
              },
              {
                label: 'Active',
                key: 'is_active',
                type: 'toggle',
                onToggle: handleToggleActive,
              },
              {
                label: 'Actions',
                type: 'custom',
                render: user => (
                  <div className="flex gap-2 justify-center">
                    <Link
                      href={route('users.show', { id: user.id })}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600"
                    >
                      <Eye size={18} />
                    </Link>
                    <Link
                      href={route('users.edit', { id: user.id })}
                      className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-600"
                    >
                      <Pencil size={18} />
                    </Link>
                    <button
                      onClick={() => confirmUserDeletion(user)}
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

      {/* Delete User Confirmation Modal */}
      <Modal show={confirmingUserDeletion} onClose={closeModal}>
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Delete User
          </h2>

          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
          </p>

          <div className="mt-6 flex justify-end">
            <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>

            <DangerButton
              className="ml-3"
              onClick={deleteUser}
            >
              Delete User
            </DangerButton>
          </div>
        </div>
      </Modal>
    </WithLayout>
  );
}
