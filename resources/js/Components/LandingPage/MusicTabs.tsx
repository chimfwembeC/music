import React, { useState } from 'react';
import { motion } from 'framer-motion';

const tabs = ['Best Artist', 'Best Album', 'Most Downloaded'];

export default function MusicTabs() {
  const [activeTab, setActiveTab] = useState('Best Artist');

  return (
    <div className="max-w-5xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b border-purple-700 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-md font-semibold pb-2 border-b-2 transition-all ${
              activeTab === tab
                ? 'border-purple-500 text-purple-500'
                : 'border-transparent text-gray-400 hover:text-purple-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content with Framer Motion and Spring Animation */}
      <motion.div
        className="bg-gray-400/50 dark:bg-purple-800 p-6 shadow-md dark:text-white"
        key={activeTab}  // This will trigger reanimation when tab changes
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{
          type: 'spring',
          stiffness: 300,  // Controls the spring "tightness"
          damping: 30,     // Controls the spring "bounce"
          duration: 0.5,   // Duration of the spring animation
        }}
      >
        {activeTab === 'Best Artist' && (
          <div>
            <h2 className="text-xl font-bold mb-2">🔥 Best Artist</h2>
            <p>Display best artist details here (e.g. highest downloads, most albums, etc).</p>
          </div>
        )}

        {activeTab === 'Best Album' && (
          <div>
            <h2 className="text-xl font-bold mb-2">🎧 Best Album</h2>
            <p>Show top album by rating/downloads.</p>
          </div>
        )}

        {activeTab === 'Most Downloaded' && (
          <div>
            <h2 className="text-xl font-bold mb-2">⬇️ Most Downloaded</h2>
            <p>List of songs or albums with highest download_counts.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
