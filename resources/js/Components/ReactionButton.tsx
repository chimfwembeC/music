import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import PrimaryButton from './PrimaryButton';

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

  const handleReaction = async (type: string) => {
    setShowPicker(false);
    setLoading(true);

    try {
      const response = await axios.post(`/blogs/${blogId}/react`, { type });
      const { reactions, userReaction: updatedReaction } = response.data;

      setUserReaction(updatedReaction);
      setReactionCounts(reactions);
    } catch (error) {
      console.error('Reaction failed:', error);
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
      <button
        className="text-lg hover:scale-110 transition"
        onClick={() => setShowPicker(!showPicker)}
        disabled={loading}
        title={userReaction ? `You reacted: ${userReaction}` : 'React'}
      >
        {userReaction
          ? reactions.find(r => r.type === userReaction)?.emoji
          : '👍'}{' '}
        {Object.values(reactionCounts).reduce((sum, count) => sum + count, 0)}
      </button>

      <AnimatePresence>
        {showPicker && (
          <motion.div
            className="absolute bottom-10 left-0 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg flex gap-2 z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {reactions.map(reaction => (
              <motion.button
                key={reaction.type}
                onClick={() => handleReaction(reaction.type)}
                whileHover={{ scale: 1.2 }}
                className={`text-sm px-2 py-1 flex flex-col items-center ${
                  userReaction === reaction.type ? 'ring-2 ring-blue-500' : ''
                }`}
                disabled={loading}
              >
                <span className="text-xl">{reaction.emoji}</span>
                <span className="text-xs text-gray-500">
                  {reactionCounts[reaction.type] || 0}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReactionButton;
