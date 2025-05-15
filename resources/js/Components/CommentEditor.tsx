import React from 'react'

export function CommentEditor({
    editedContent,
    setEditedContent,
  }: {
    editedContent: string;
    setEditedContent: React.Dispatch<React.SetStateAction<string>>;
  }) {
    return (
      <textarea
        className="w-full mt-1 p-2 text-sm bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600"
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        rows={2}
      />
    );
  }
  