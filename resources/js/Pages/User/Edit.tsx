import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import UpdateUserForm from './Components/UpdateUserForm';
import { User } from '@/types';
import WithLayout from '@/Components/WithLayout';

interface Props {
  user: User;
}

export default function Edit({ user }: Props) {
  return (
    <WithLayout
      title="Edit User"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Edit User
        </h2>
      )}
    >
      <div className="max-w-5xl h-screen m-auto mt-4">
        <UpdateUserForm user={user} />
      </div>
    </WithLayout>
  );
}
