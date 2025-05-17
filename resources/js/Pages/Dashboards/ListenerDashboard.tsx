import React, { useState } from 'react';
import { Music, Artist, Playlist, ListeningActivity, ListeningStats } from '@/types';
import MusicCard from '@/Components/MusicCard';
import ArtistCard from '@/Components/ArtistCard';
import PlaylistCard from '@/Components/PlaylistCard';
import EmptyState from '@/Components/EmptyState';
import LoadingState from '@/Components/LoadingState';
import SectionHeader from '@/Components/SectionHeader';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ListenerDashboardProps {
  recentlyPlayed: Music[];
  mostPlayed: Music[];
  favoriteTracks: Music[];
  followedArtists: Artist[];
  playlists: Playlist[];
  listeningActivity: ListeningActivity[];
  recommendedTracks: Music[];
  listeningStats: ListeningStats;
}

const ListenerDashboard: React.FC<ListenerDashboardProps> = ({
  recentlyPlayed,
  mostPlayed,
  favoriteTracks,
  followedArtists,
  playlists,
  listeningActivity,
  recommendedTracks,
  listeningStats,
}) => {
  // In a real app, this would be set based on data loading state
  const [isLoading] = useState(false);
  // Prepare data for the listening activity chart
  const chartData = {
    labels: listeningActivity?.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }) || [],
    datasets: [
      {
        label: 'Tracks Played',
        data: listeningActivity?.map(item => item.count) || [],
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Your Listening Activity (Last 30 Days)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Tracks Played',
        },
      },
    },
  };

  return (
    <div>
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Listening Stats */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6 mb-6">
            <SectionHeader title="Your Listening Stats" />

            {isLoading ? (
              <LoadingState message="Loading your stats..." />
            ) : !listeningStats ? (
              <EmptyState
                title="No listening data yet"
                message="Start listening to music to see your stats here."
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                }
                action={{
                  label: "Discover Music",
                  onClick: () => window.location.href = "/discover"
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Plays</h4>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{listeningStats?.total_plays || 0}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Unique Tracks</h4>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{listeningStats?.unique_tracks || 0}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Listening Time</h4>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{listeningStats?.total_listening_time_formatted || '0 seconds'}</p>
                </div>
                {listeningStats?.most_listened_genre && (
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Most Listened Genre</h4>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{listeningStats.most_listened_genre.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{listeningStats.most_listened_genre.listen_count} plays</p>
                  </div>
                )}
                {listeningStats?.most_listened_artist && (
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Most Listened Artist</h4>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{listeningStats.most_listened_artist.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{listeningStats.most_listened_artist.listen_count} plays</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Listening Activity Chart */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6 mb-6">
            <SectionHeader title="Listening Activity" />

            {isLoading ? (
              <LoadingState message="Loading your activity data..." />
            ) : !listeningActivity || listeningActivity.length === 0 ? (
              <EmptyState
                title="No listening activity yet"
                message="Your listening activity will appear here once you start playing music."
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
              />
            ) : (
              <div className="h-64">
                <Line data={chartData} options={chartOptions} />
              </div>
            )}
          </div>

          {/* Recently Played */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6 mb-6">
            <SectionHeader
              title="Recently Played"
              viewAllLink="/history"
              viewAllText="View History"
            />

            {isLoading ? (
              <LoadingState message="Loading your recently played tracks..." />
            ) : !recentlyPlayed || recentlyPlayed.length === 0 ? (
              <EmptyState
                title="No recently played tracks"
                message="Tracks you've recently listened to will appear here."
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                action={{
                  label: "Discover Music",
                  onClick: () => window.location.href = "/discover"
                }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {recentlyPlayed.map((track) => (
                  <MusicCard key={`recent-${track.id}`} music={track} />
                ))}
              </div>
            )}
          </div>

          {/* Most Played */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6 mb-6">
            <SectionHeader
              title="Most Played"
              viewAllLink="/most-played"
            />

            {isLoading ? (
              <LoadingState message="Loading your most played tracks..." />
            ) : !mostPlayed || mostPlayed.length === 0 ? (
              <EmptyState
                title="No most played tracks yet"
                message="Your most played tracks will appear here as you listen to music."
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mostPlayed.map((track) => (
                  <MusicCard key={`most-${track.id}`} music={track} />
                ))}
              </div>
            )}
          </div>

          {/* Favorite Tracks */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6 mb-6">
            <SectionHeader
              title="Your Favorites"
              viewAllLink="/favorites"
            />

            {isLoading ? (
              <LoadingState message="Loading your favorite tracks..." />
            ) : !favoriteTracks || favoriteTracks.length === 0 ? (
              <EmptyState
                title="No favorite tracks yet"
                message="Like tracks to add them to your favorites."
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                }
                action={{
                  label: "Discover Music",
                  onClick: () => window.location.href = "/discover"
                }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {favoriteTracks.map((track) => (
                  <MusicCard key={`fav-${track.id}`} music={track} />
                ))}
              </div>
            )}
          </div>

          {/* Followed Artists */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6 mb-6">
            <SectionHeader
              title="Artists You Follow"
              viewAllLink="/following"
            />

            {isLoading ? (
              <LoadingState message="Loading artists you follow..." />
            ) : !followedArtists || followedArtists.length === 0 ? (
              <EmptyState
                title="You're not following any artists yet"
                message="Follow artists to see their latest releases and updates."
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
                action={{
                  label: "Discover Artists",
                  onClick: () => window.location.href = "/artists"
                }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {followedArtists.map((artist) => (
                  <ArtistCard key={`artist-${artist.id}`} artist={artist} />
                ))}
              </div>
            )}
          </div>

          {/* Your Playlists */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6 mb-6">
            <SectionHeader
              title="Your Playlists"
              viewAllLink="/playlists"
            >
              <button
                onClick={() => window.location.href = "/playlists/create"}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New
              </button>
            </SectionHeader>

            {isLoading ? (
              <LoadingState message="Loading your playlists..." />
            ) : !playlists || playlists.length === 0 ? (
              <EmptyState
                title="No playlists yet"
                message="Create playlists to organize your favorite music."
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                }
                action={{
                  label: "Create Playlist",
                  onClick: () => window.location.href = "/playlists/create"
                }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {playlists.map((playlist) => (
                  <PlaylistCard key={`playlist-${playlist.id}`} playlist={playlist} />
                ))}
              </div>
            )}
          </div>

          {/* Recommended Tracks */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6 mb-6">
            <SectionHeader
              title="Recommended For You"
              viewAllLink="/discover"
              viewAllText="Discover More"
            />

            {isLoading ? (
              <LoadingState message="Finding recommendations for you..." />
            ) : !recommendedTracks || recommendedTracks.length === 0 ? (
              <EmptyState
                title="No recommendations yet"
                message="Listen to more music to get personalized recommendations."
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                }
                action={{
                  label: "Explore Genres",
                  onClick: () => window.location.href = "/genres"
                }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {recommendedTracks.map((track) => (
                  <MusicCard key={`rec-${track.id}`} music={track} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListenerDashboard;
