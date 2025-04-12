import AppLayout from '@/Layouts/AppLayout'
import React from 'react'
import UpdateBlogForm from './Components/UpdateBlogForm'
import { Blog } from '@/types'

export default function Edit({blog}: Blog) {
  return (
    <AppLayout 
    title='Update blog'
    renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Blog
        </h2>
      )}
    >
      <div className="max-w-5xl h-screen m-auto mt-4">
        <UpdateBlogForm blog={blog} />
      </div>
    </AppLayout>
  )
}
