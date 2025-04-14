import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Pencil, Save, MessageCircle, ChevronDown } from 'lucide-react';
import moment from 'moment';
import { CommentEditor } from './CommentEditor';
import ReplyForm from './ReplyForm';
import { CommentReply } from './CommentReply';

interface Comment {
  id: number;
  content: string;
  user: { id: number; name: string; profile_photo_url?: string };
  created_at: string;
  parent_comment_id?: number;
  replies?: Comment[];
}

export function CommentItem({
  blogId,
  comment,
  user,
  newCommentRef,
  activeReplyId,
  setActiveReplyId,
}: {
  blogId: number;
  comment: Comment;
  user?: { id: number };
  newCommentRef: React.RefObject<HTMLDivElement>;
  activeReplyId: number | null;
  setActiveReplyId: (id: number | null) => void;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [showAllReplies, setShowAllReplies] = useState(false);

  useEffect(() => {
    if (comment.replies?.length > 1) {
      setShowAllReplies(false);
    }
  }, [comment.replies]);

  const handleReply = () => {
    setActiveReplyId(activeReplyId === comment.id ? null : comment.id);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/comments/${id}`);
    } catch (error) {
      console.error('Failed to delete comment', error);
    }
  };

  const handleEdit = () => {
    setEditingId(comment.id);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      await axios.put(`/comments/${comment.id}`, { content: editedContent });
      setEditingId(null);
    } catch (error) {
      console.error('Failed to save comment', error);
    }
  };

  const isAuthor = user?.id === comment.user.id;
  const isEditing = editingId === comment.id;

  return (
    <div
      ref={comment.id === 1 ? newCommentRef : null}
      className="p-4 rounded shadow-sm transition-all duration-500 bg-gray-200 dark:bg-gray-800"
    >
      <div>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {comment.user.name}
          <span className="ml-2 text-xs text-gray-400">
            {moment(comment.created_at).fromNow()}
          </span>
        </p>

        {isEditing ? (
          <CommentEditor
            editedContent={editedContent}
            setEditedContent={setEditedContent}
          />
        ) : (
          <p className="mt-1 text-gray-800 dark:text-gray-200 text-sm">
            {comment.content}
          </p>
        )}

        <div className="flex items-center gap-3 mt-2">
          {isAuthor && (
            <>
              <button
                onClick={() => handleDelete(comment.id)}
                className="text-red-500 text-xs flex items-center"
              >
                <Trash2 className="w-3 h-3 mr-1" /> Delete
              </button>
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="text-green-600 text-xs flex items-center"
                >
                  <Save className="w-3 h-3 mr-1" /> Save
                </button>
              ) : (
                <button
                  onClick={handleEdit}
                  className="text-blue-500 text-xs flex items-center"
                >
                  <Pencil className="w-3 h-3 mr-1" /> Edit
                </button>
              )}
            </>
          )}
          <button
            onClick={handleReply}
            className="text-blue-500 text-xs flex items-center"
          >
            <MessageCircle className="w-3 h-3 mr-1" /> Reply
          </button>
        </div>

        {/* Reply input form */}
        {activeReplyId === comment.id && (
          <ReplyForm
            commentId={comment.id}
            onReplyPosted={() => {
              setActiveReplyId(null);
            }}
            onDone={() => setActiveReplyId(null)}
          />
        )}

{comment.replies && comment.replies.length > 0 && (
  <div className="mt-4 space-y-3 ml-4">
    {(showAllReplies ? comment.replies : [comment.replies[0]]).map(reply => (
      <div key={reply.id} className="w-full">
        <CommentReply
          blogId={blogId}
          comment={reply}
          user={user}
          newCommentRef={newCommentRef}
          activeReplyId={activeReplyId}
          setActiveReplyId={setActiveReplyId}
        />
      </div>
    ))}

    {comment.replies.length > 1 && (
      <button
        onClick={() => setShowAllReplies(!showAllReplies)}
        className="text-blue-500 text-xs flex items-center"
      >
        <ChevronDown
          className={`w-3 h-3 mr-1 transition-transform ${
            showAllReplies ? 'rotate-180' : ''
          }`}
        />
        {showAllReplies ? 'Hide replies' : 'View more replies'}
      </button>
    )}
  </div>
)}

      </div>
    </div>
  );
}
