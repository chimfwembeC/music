import React, { useEffect, useState } from 'react';

export default function CommentList({ blogId }: { blogId: number }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch(`/blogs/${blogId}/comments`)
      .then(res => res.json())
      .then(setComments);
  }, [blogId]);

  return (
    <div className="mt-4 space-y-4">
      <h4 className="text-lg font-semibold">Comments</h4>
      {comments.length === 0 && <p className="text-gray-500">No comments yet.</p>}
      {comments.map(comment => (
        <div key={comment.id} className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
          <p className="text-sm font-semibold">{comment.user.name}</p>
          <p>{comment.body}</p>
        </div>
      ))}
    </div>
  );
}
