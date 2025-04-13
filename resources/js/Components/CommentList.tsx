import React, { useEffect, useState } from 'react';
import { MessageCircleMore, Loader2 } from 'lucide-react';

interface Comment {
  id: number;
  content: string;
  blog_id: number;
  user: {
    name: string;
  };
  created_at: string;
}

export default function CommentList({
  blogId,
  newComment,
}: {
  blogId: number;
  newComment?: Comment | null;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch comments from the API when the blogId changes or the component is mounted
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/blogs/${blogId}/comments`);
        if (!res.ok) throw new Error('Failed to fetch comments');
        const data = await res.json();
        setComments(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [blogId]);

  // When a new comment is passed, update the comment list without re-fetching
  useEffect(() => {
    if (newComment && newComment.blog_id === blogId) {
      setComments((prevComments) => [...prevComments ,newComment]); // Add the new comment to the beginning or end
    }
  }, [newComment, blogId]);

  return (
    <div className="mt-4 space-y-4">
      <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white">
        <MessageCircleMore className="w-5 h-5" />
        Comments
      </h4>

      {loading && (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading comments...
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && comments.length === 0 && (
        <p className="text-gray-500">No comments yet.</p>
      )}

      {comments.map((comment) => (
        <div
          key={comment.id}
          id={`comment-${comment.id}`}
          className="p-3 bg-gray-100 dark:bg-gray-700 rounded shadow-sm"
        >
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {comment.user.name}
            <span className="ml-2 text-xs text-gray-400">
              {new Date(comment.created_at).toLocaleString()}
            </span>
          </p>
          <p className="mt-1 text-gray-800 dark:text-gray-200 text-sm">
            {comment.content}
          </p>
        </div>
      ))}
    </div>
  );
}
