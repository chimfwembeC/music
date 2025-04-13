import axios from 'axios';
import { useForm } from '@inertiajs/react';
import React from 'react';

interface CommentFormProps {
  blogId: number;
  onNewComment: (comment: any) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ blogId, onNewComment }) => {
  const { data, setData, processing, reset } = useForm({
    content: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(`/blogs/${blogId}/comments`, {
        content: data.content,
      });

      // Call the onNewComment function to notify parent component about the new comment
      onNewComment(res.data);
      reset(); // Reset the form after submitting
    } catch (error: any) {
      console.error('Failed to post comment:', error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        className="w-full p-2 rounded border border-gray-300 dark:bg-gray-800"
        placeholder="Add a comment..."
        value={data.content}
        onChange={(e) => setData('content', e.target.value)}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded"
        disabled={processing}
      >
        Post
      </button>
    </form>
  );
};

export default CommentForm;
