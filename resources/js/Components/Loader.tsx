import React from 'react';

export function CommentLoader() {
  return (
    <div className="p-4 rounded shadow-sm bg-gray-200 dark:bg-purple-800 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-400 dark:bg-purple-900 rounded-full"></div>
        <div className="flex-1">
          <div className="w-3/4 h-4 bg-gray-400 dark:bg-purple-900 mb-2"></div>
          <div className="w-full h-3 bg-gray-400 dark:bg-purple-900"></div>
        </div>
      </div>
    </div>
  );
}

export function Loader() {
  return (
    <div className="space-y-4">
      <CommentLoader />
      <CommentLoader />
      <CommentLoader />
    </div>
  );
}
