import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import AddUserForm from './Components/AddUserForm';

export default function Create() {
  return (
    <AppLayout
      title="Create User"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Create New User
        </h2>
      )}
    >
      <div className="max-w-5xl h-screen m-auto mt-4">
        <AddUserForm />
      </div>
    </AppLayout>
  );
}
