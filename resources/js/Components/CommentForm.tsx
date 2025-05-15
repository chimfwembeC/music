import axios from 'axios';
import { useForm } from '@inertiajs/react';
import React, { useRef } from 'react';
import { Send } from 'lucide-react';
import PrimaryButton from './PrimaryButton';

interface CommentFormProps {
  blogId: number;
  onNewComment: (comment: any) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ blogId, onNewComment }) => {
  const { data, setData, processing, reset } = useForm({
    content: '',
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setData('content', value);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset first
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to scrollHeight

      // Optional: scroll if overflowing
      if (textareaRef.current.scrollHeight > textareaRef.current.clientHeight) {
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/blogs/${blogId}/comments`, {
        content: data.content,
      });

      onNewComment(res.data);
      reset(); // Reset form
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Reset height visually too
      }
    } catch (error: any) {
      console.error('Failed to post comment:', error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2 items-start">
        {/* Textarea */}
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            className="w-full resize-none overflow-hidden max-h-48 overflow-y-auto p-2 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm transition-all duration-150 ease-in-out"
            placeholder="Add a comment..."
            rows={1}
            value={data.content}
            onChange={handleInput}
          />
        </div>

        {/* Button */}
        <div className="flex-shrink-0">
          <PrimaryButton
            type="submit"
            className="px-2 py-3 bg-blue-500 text-white rounded"
            disabled={processing || data.content.trim() === ''}
          >
            <Send className="h-4 w-4 text-white" />
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
