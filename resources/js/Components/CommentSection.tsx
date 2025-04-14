import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X } from 'lucide-react';
import CommentForm from '@/Components/CommentForm';
import CommentList from '@/Components/CommentList';

interface CommentSectionProps {
  activeBlogId: number | null;
  closeCommentSheet: () => void;
  latestComment: any;
  setLatestComment: (comment: any) => void;
  user: any;
  handleDragEnd: (event: MouseEvent | TouchEvent, info: PanInfo) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  activeBlogId,
  closeCommentSheet,
  latestComment,
  setLatestComment,
  user,
  handleDragEnd,
}) => {
  return (
    <AnimatePresence>
      {activeBlogId !== null && (
        <motion.div
          className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCommentSheet}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 w-full rounded-t-2xl p-4 h-[80vh] overflow-y-auto"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={handleDragEnd}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Comments</h2>
              <button
                onClick={closeCommentSheet}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <CommentForm
              blogId={activeBlogId}
              onNewComment={(comment) => setLatestComment(comment)}
            />

            <CommentList
              blogId={activeBlogId}
              newComment={latestComment}
              user={user}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommentSection;
