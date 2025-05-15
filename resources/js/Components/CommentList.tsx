import React, { useEffect, useState, useRef } from 'react';
import { MessageCircleMore, Loader2 } from 'lucide-react';
import { CommentItem } from './CommentItem';
import { ErrorMessage } from './ErrorMessage';
import { Loader } from './Loader';
import { Pagination } from './Pagination';
import moment from 'moment';

interface Comment {
  id: number;
  content: string;
  blog_id: number;
  user: {
    id: number;
    name: string;
  };
  created_at: string;
  parent_comment_id?: number;
}

export default function CommentList({
  blogId,
  newComment,
  user,
}: {
  blogId: number;
  newComment?: Comment | null;
  user?: { id: number };
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const newCommentRef = useRef<HTMLDivElement | null>(null);

  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);

  // console.log('user', user);
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

  useEffect(() => {
    fetchComments();

    const interval = setInterval(() => {
      fetchComments();
    }, 15000);
    return () => clearInterval(interval);
  }, [blogId]);

  useEffect(() => {
    if (newComment && newComment.blog_id === blogId) {
      setComments(prev => [...prev, newComment]);
    }
  }, [newComment, blogId]);

  useEffect(() => {
    if (newCommentRef.current) {
      newCommentRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [comments]);

  return (
    <div className="mt-4 space-y-4" role="list" aria-label="Comment list">
      <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white">
        <MessageCircleMore className="w-5 h-5" />
        Comments ({comments.length})
      </h4>

      {loading && <Loader />}

      {error && <ErrorMessage message={error} />}

      {!loading && comments.length === 0 && (
        <p className="text-gray-500">No comments yet.</p>
      )}

      {comments.map(comment => (
        <CommentItem
          key={comment.id}
          blogId={blogId}
          comment={comment}
          user={user}
          newCommentRef={newCommentRef}
          activeReplyId={activeReplyId}
          setActiveReplyId={setActiveReplyId}
        />
      ))}

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}
