import React, { useState } from 'react';

export default function CommentForm({ blogId, onNewComment }: any) {
  const [body, setBody] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/blogs/${blogId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Make sure to include authorization headers if needed!
      },
      body: JSON.stringify({ body }),
    });

    const newComment = await res.json();
    onNewComment(newComment);
    setBody('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write a comment..."
        className="w-full p-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white"
        rows={3}
        required
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Post Comment
      </button>
    </form>
  );
}
