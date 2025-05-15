// BlogSkeleton.tsx
import React from 'react';

const BlogSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg my-6 overflow-hidden">
      <div className="h-48 w-full bg-gray-300 dark:bg-gray-600"></div>
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
        <div className="flex items-center justify-between mt-4">
          <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-8 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default BlogSkeleton;
