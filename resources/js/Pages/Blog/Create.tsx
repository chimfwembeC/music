import AppLayout from '@/Layouts/AppLayout';
import React from 'react';
import CreateBlogForm from './Components/CreateBlogForm';

export default function Create() {
  return (
    <AppLayout title="Create Blog">
      <div className="max-w-5xl h-screen m-auto mt-4">
        <CreateBlogForm />
      </div>
    </AppLayout>
  );
}
