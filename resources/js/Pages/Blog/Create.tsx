import AppLayout from '@/Layouts/AppLayout';
import React from 'react';
import CreateBlogForm from './Components/CreateBlogForm';
import WithLayout from '@/Components/WithLayout';

export default function Create() {
  return (
    <WithLayout title="Create Blog">
      <div className="max-w-5xl h-screen m-auto mt-4">
        <CreateBlogForm />
      </div>
    </WithLayout>
  );
}
