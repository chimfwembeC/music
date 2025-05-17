import React from 'react';
import WithLayout from '@/Components/WithLayout';
import ArtistDashboard from './ArtistDashboard';

interface ArtistDashboardPageProps {
  artist: any;
  tracks: any[];
  albums: any[];
  trackPerformance: any[];
  demographics: any;
  followersGrowth: any[];
  topTracks: any[];
  revenue: any;
  stats: any;
}

export default function ArtistDashboardPage({
  artist,
  tracks,
  albums,
  trackPerformance,
  demographics,
  followersGrowth,
  topTracks,
  revenue,
  stats,
}: ArtistDashboardPageProps) {
  return (
    <WithLayout
      title="Artist Dashboard"
      allowedRoles={['artist']}
    >
      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6">
        <ArtistDashboard
          artist={artist}
          tracks={tracks}
          albums={albums}
          trackPerformance={trackPerformance}
          demographics={demographics}
          followersGrowth={followersGrowth}
          topTracks={topTracks}
          revenue={revenue}
          stats={stats}
        />
      </div>
    </WithLayout>
  );
}
