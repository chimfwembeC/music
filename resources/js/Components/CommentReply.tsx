import React, { useState } from 'react';
import axios from 'axios';
import { Trash2, Pencil, Save, MessageCircle } from 'lucide-react';
import { CommentEditor } from './CommentEditor';
import moment from 'moment';

interface Comment {
  id: number;
  content: string;
  user: { id: number; name: string; profile_photo_url?: string };
  created_at: string;
  parent_comment_id?: number;
}

export function CommentReply({
  blogId,
  comment,
  user,
  activeReplyId,
  setActiveReplyId,
  newCommentRef,
}: {
  blogId: number;
  comment: Comment;
  user?: { id: number };
  activeReplyId: number | null;
  setActiveReplyId: (id: number | null) => void;
  newCommentRef: React.RefObject<HTMLDivElement>;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const isAuthor = user?.id === comment.user.id;

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

  const handleReplySubmit = async () => {
    try {
      await axios.post(`/comments/${blogId}/reply`, {
        content: replyContent,
        parent_comment_id: comment.id,
      });
      setReplyContent('');
      setActiveReplyId(null);
  
      setTimeout(() => {
        newCommentRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (error) {
      console.error('Failed to post reply', error);
    }
  };
  

  return (
    <div className="p-3 mt-3 bg-gray-400 dark:bg-gray-700 rounded shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {comment.user.name}
            <span className="ml-2 text-xs text-gray-400">
              {moment(comment.created_at).fromNow()}
            </span>
          </p>

          {editingId === comment.id ? (
            <CommentEditor
              editedContent={editedContent}
              setEditedContent={setEditedContent}
            />
          ) : (
            <p className="text-sm text-gray-800 dark:text-gray-200">
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
                {editingId === comment.id ? (
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
              onClick={() =>
                activeReplyId === comment.id
                  ? setActiveReplyId(null)
                  : setActiveReplyId(comment.id)
              }
              className="text-gray-500 text-xs flex items-center"
            >
              <MessageCircle className="w-3 h-3 mr-1" /> Reply
            </button>
          </div>

          {activeReplyId === comment.id && (
            <div className="mt-3">
              <CommentEditor
                editedContent={replyContent}
                setEditedContent={setReplyContent}
                // placeholder="Write your reply..."
              />
              <div className="flex justify-end mt-2 gap-2">
                <button
                  onClick={() => setActiveReplyId(null)}
                  className="text-sm text-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReplySubmit}
                  className="text-sm text-blue-600 font-semibold"
                >
                  Reply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
