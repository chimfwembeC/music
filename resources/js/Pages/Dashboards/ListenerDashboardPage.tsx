import React from 'react';
import WithLayout from '@/Components/WithLayout';
import ListenerDashboard from './ListenerDashboard';
import { Head } from '@inertiajs/react';

interface ListenerDashboardPageProps {
  recentlyPlayed: any[];
  mostPlayed: any[];
  favoriteTracks: any[];
  followedArtists: any[];
  playlists: any[];
  recommendedTracks: any[];
  listeningStats: any;
  listeningActivity: any[];
}

export default function ListenerDashboardPage({
  recentlyPlayed,
  mostPlayed,
  favoriteTracks,
  followedArtists,
  playlists,
  recommendedTracks,
  listeningStats,
  listeningActivity,
}: ListenerDashboardPageProps) {
  return (
    <WithLayout
      title="Listener Dashboard"
      allowedRoles={['listener']}
    >
      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6">
        <ListenerDashboard
          recentlyPlayed={recentlyPlayed}
          mostPlayed={mostPlayed}
          favoriteTracks={favoriteTracks}
          followedArtists={followedArtists}
          playlists={playlists}
          recommendedTracks={recommendedTracks}
          listeningStats={listeningStats}
          listeningActivity={listeningActivity}
        />
      </div>
    </WithLayout>
  );
}
