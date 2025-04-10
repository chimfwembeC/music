import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { User } from '@/types';
import SearchModal from '@/Layouts/SearchModal';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Search } from 'lucide-react';
import SearchBar from '@/Components/SearchBar';

// Dummy data for tracks and recommendations
const recentTracks = [
  { title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours' },
  { title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia' },
  { title: 'Save Your Tears', artist: 'The Weeknd', album: 'After Hours' },
];

const recommendedTracks = [
  { title: 'Good 4 U', artist: 'Olivia Rodrigo', album: 'SOUR' },
  {
    title: 'Montero (Call Me By Your Name)',
    artist: 'Lil Nas X',
    album: 'Montero',
  },
  { title: 'Kiss Me More', artist: 'Doja Cat', album: 'Planet Her' },
];

export default function ListenerDashboard({ user }: { user: User }) {
  // States for controlling the UI
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const toggleSearch = () => {
    setIsSearchOpen(prev => !prev);
    // setIsMobileMenuOpen(false);
  };
  // Handle search input change
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        {/* Search Bar */}
        <SearchBar />
        {/* Recently Played Tracks */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold dark:text-purple-500 mb-4">
            Recently Played
          </h3>
          <div className="p-4 rounded-lg bg-gray-200 dark:bg-purple-800">
            {recentTracks.map((track, index) => (
              <div key={index} className="mb-1">
                <h4 className="font-semibold text-gray-600">{track.title}</h4>

                <div className="flex justify-between items-">
                  <p className="text-sm text-gray-400">by {track.artist}</p>
                  <p className="text-xs text-gray-400 flex">
                    <span className="font-bold mr-1">Album: </span>
                    {track.album}
                  </p>
                </div>
                {recentTracks.length > index + 1 ? (
                  <div className="border border-gray-400/50 dark:border-purple-600 mt-1 -mx-4"></div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {/* Music Recommendations */}
        <div>
          <h3 className="text-2xl font-semibold dark:text-purple-500  mb-4">
            Recommended For You
          </h3>
          <div className="p-4 rounded-lg bg-gray-200 dark:bg-purple-800">
            {recommendedTracks.map((track, index) => (
              <div key={index} className="">
                <h4 className="font-bold text-gray-600">{track.title}</h4>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">by {track.artist}</p>
                  <p className="text-xs text-gray-400 flex">
                    <span className="font-bold mr-1">Album: </span>
                    {track.album}
                  </p>
                </div>

                {/* Add to Playlist Button with Icon */}
                <div className="mt-4 flex justify-end">
                  <button className="py-2 px-4 bg-purple-600 text-sx text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                    <PlusCircle className="w-4 h-4" />
                    <span className="text-sm">Add to Playlist</span>
                  </button>
                </div>

                {recommendedTracks.length > index + 1 ? (
                  <div className="border border-gray-400/50 dark:border-purple-600 mt-1 -mx-4"></div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
