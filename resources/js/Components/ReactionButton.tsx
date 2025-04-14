import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import PrimaryButton from './PrimaryButton';
import Swal from 'sweetalert2';
import useTypedPage from '@/Hooks/useTypedPage';

const reactions = [
  { type: 'like', emoji: '👍' },
  { type: 'love', emoji: '❤️' },
  { type: 'haha', emoji: '😂' },
  { type: 'wow', emoji: '😮' },
  { type: 'sad', emoji: '😢' },
  { type: 'angry', emoji: '😡' },
];

interface ReactionButtonProps {
  blogId: number;
  initialReaction?: string;
  initialCounts?: Record<string, number>;
}

const ReactionButton: React.FC<ReactionButtonProps> = ({
  blogId,
  initialReaction = '',
  initialCounts = {},
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [userReaction, setUserReaction] = useState(initialReaction);
  const [reactionCounts, setReactionCounts] =
    useState<Record<string, number>>(initialCounts);
  const [loading, setLoading] = useState(false);
  const page = useTypedPage();
  const user = page.props.auth.user;
  const isLoggedIn = !!user;
  const isGuest = !isLoggedIn;
  const isLoading = loading;
  const isDisabled = loading || !isLoggedIn;

  console.log('user', user);
  const handleReaction = async (type: string) => {
    setShowPicker(false);
    setLoading(true);

    try {
      const response = await axios.post(`/blogs/${blogId}/react`, { type });
      const { reactions, userReaction: updatedReaction } = response.data;

      setUserReaction(updatedReaction);
      setReactionCounts(reactions);
    } catch (error) {
      // console.error('Reaction failed:', error);
      if (error.response?.status === 401) {
        Swal.fire({
          title: 'Unauthorized',
          text: 'You need to register or login to react to blog posts.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Login',
          cancelButtonText: 'Register',
        }).then(result => {
          const currentUrl = window.location.pathname;

          if (result.isConfirmed) {
            window.location.href = `/login?redirect=${encodeURIComponent(currentUrl)}`;
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            window.location.href = `/register?redirect=${encodeURIComponent(currentUrl)}`;
          }
        });
      } else {
        Swal.fire(
          'Error',
          'Something went wrong. Please try again later.',
          'error',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowPicker(true)}
      onMouseLeave={() => setShowPicker(false)}
    >
      <motion.button
        className="flex items-center gap-2 hover:scale-105 transition px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800"
        onClick={() => setShowPicker(!showPicker)}
        disabled={loading}
        animate={{
          scale: userReaction ? [1, 1.1, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        {reactions
          .filter(reaction => reactionCounts[reaction.type]) // only show used reactions
          .map(reaction => (
            <span
              key={reaction.type}
              className={`flex items-center gap-1 text-sm ${
                userReaction === reaction.type ? 'font-bold text-blue-500' : ''
              }`}
            >
              <span>{reaction.emoji}</span>
              <span>{reactionCounts[reaction.type]}</span>
            </span>
          ))}

        {/* Fallback if no reactions */}
        {Object.keys(reactionCounts).length === 0 && (
          <span className="text-sm text-gray-500">React 👍</span>
        )}
      </motion.button>

      <AnimatePresence>
        {showPicker && (
          <motion.div
            className="absolute bottom-10 left-0 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg flex gap-2 z-10"
            initial={{ opacity: 0, y: 10 }} // Starts slightly below and invisible
            animate={{ opacity: 1, y: 0 }} // Moves to position and fades in
            exit={{ opacity: 0, y: 10 }} // Fades out and moves down
            transition={{ type: 'spring', stiffness: 300, damping: 30 }} // Adds springy motion
          >
            {reactions.map(reaction => (
              <motion.button
                key={reaction.type}
                onClick={() => handleReaction(reaction.type)}
                whileHover={{ scale: 1.2 }} // Slight scaling when hovered
                className={`text-sm rounded-lg px-2 py-1 flex flex-col items-center ${
                  userReaction === reaction.type ? 'ring-2 ring-blue-500' : ''
                }`}
                disabled={loading}
              >
                <span className="text-xl">{reaction.emoji}</span>
                {/* <span className="text-xs text-gray-500">
            {reactionCounts[reaction.type] || 0}
          </span> */}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReactionButton;
