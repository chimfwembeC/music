import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  onReact?: (type: string) => void;
}

const ReactionButton: React.FC<ReactionButtonProps> = ({ blogId, onReact }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleReaction = async (type: string) => {
    setShowPicker(false);

    await fetch(`/blogs/${blogId}/react`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type }),
    });

    onReact?.(type);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowPicker(true)}
      onMouseLeave={() => setShowPicker(false)}
    >
      <button className="text-xl hover:scale-110 transition">👍</button>

      <AnimatePresence>
        {showPicker && (
          <motion.div
            className="absolute bottom-10 left-0 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg flex gap-2 z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {reactions.map((reaction) => (
              <motion.button
                key={reaction.type}
                onClick={() => handleReaction(reaction.type)}
                whileHover={{ scale: 1.2 }}
                className="text-2xl"
              >
                {reaction.emoji}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReactionButton;
