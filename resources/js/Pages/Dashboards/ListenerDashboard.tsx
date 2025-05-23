import React, { useState, useEffect } from 'react';
import { Music, Artist } from '@/types';
import MusicCard from '@/Components/MusicCard';
import ArtistCard from '@/Components/ArtistCard';
import PlaylistCard from '@/Components/PlaylistCard';
import EmptyState from '@/Components/EmptyState';
import LoadingState from '@/Components/LoadingState';
import SectionHeader from '@/Components/SectionHeader';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Define types that are not exported from @/types
export interface Playlist {
  id: number;
  name: string;
  slug: string;
  description?: string;
  user_id: number;
  is_public: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
  user?: any;
  tracks?: Music[];
  tracks_count?: number;
}

export interface ListeningActivity {
  date: string;
  count: number;
}

export interface ListeningStats {
  total_plays: number;
  unique_tracks: number;
  total_listening_time: number;
  total_listening_time_formatted: string;
  most_listened_genre?: {
    id: number;
    name: string;
    listen_count: number;
  };
  most_listened_artist?: {
    id: number;
    name: string;
    listen_count: number;
  };
}
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
  recentlyPlayed: initialRecentlyPlayed,
  mostPlayed: initialMostPlayed,
  favoriteTracks: initialFavoriteTracks,
  followedArtists: initialFollowedArtists,
  playlists: initialPlaylists,
  listeningActivity: initialListeningActivity,
  recommendedTracks: initialRecommendedTracks,
  listeningStats: initialListeningStats,
}) => {
  // State for data
  const [recentlyPlayed, setRecentlyPlayed] = useState<Music[]>(initialRecentlyPlayed || []);
  const [mostPlayed, setMostPlayed] = useState<Music[]>(initialMostPlayed || []);
  const [favoriteTracks, setFavoriteTracks] = useState<Music[]>(initialFavoriteTracks || []);
  const [followedArtists, setFollowedArtists] = useState<Artist[]>(initialFollowedArtists || []);
  const [playlists, setPlaylists] = useState<Playlist[]>(initialPlaylists || []);
  const [listeningActivity, setListeningActivity] = useState<ListeningActivity[]>(initialListeningActivity || []);
  const [recommendedTracks, setRecommendedTracks] = useState<Music[]>(initialRecommendedTracks || []);
  const [listeningStats, setListeningStats] = useState<ListeningStats | null>(initialListeningStats || null);

  // Loading states
  const [isLoading, setIsLoading] = useState({
    recentlyPlayed: !initialRecentlyPlayed || initialRecentlyPlayed.length === 0,
    mostPlayed: !initialMostPlayed || initialMostPlayed.length === 0,
    favorites: !initialFavoriteTracks || initialFavoriteTracks.length === 0,
    artists: !initialFollowedArtists || initialFollowedArtists.length === 0,
    playlists: !initialPlaylists || initialPlaylists.length === 0,
    activity: !initialListeningActivity || initialListeningActivity.length === 0,
    recommendations: !initialRecommendedTracks || initialRecommendedTracks.length === 0,
    stats: !initialListeningStats
  });

  // Currently playing track
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Music | null>(null);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

  // Initialize audio player
  useEffect(() => {
    const player = new Audio();
    player.addEventListener('ended', handlePlaybackEnded);
    setAudioPlayer(player);

    return () => {
      player.pause();
      player.removeEventListener('ended', handlePlaybackEnded);
    };
  }, []);

  // Handle playback ended
  const handlePlaybackEnded = () => {
    setCurrentlyPlaying(null);
  };

  // Play a track
  const playTrack = (track: Music) => {
    if (audioPlayer) {
      // Stop current playback if any
      audioPlayer.pause();

      // Set the new track
      setCurrentlyPlaying(track);

      // Update the audio source and play
      audioPlayer.src = `/storage/${track.file_url}`;
      audioPlayer.play().catch(error => {
        console.error('Error playing track:', error);
        toast.error('Failed to play track. Please try again.');
      });

      // Update recently played list if not already in the first position
      if (!recentlyPlayed.length || recentlyPlayed[0].id !== track.id) {
        const updatedRecentlyPlayed = [track, ...recentlyPlayed.filter(t => t.id !== track.id)].slice(0, 8);
        setRecentlyPlayed(updatedRecentlyPlayed);

        // Update the backend
        updateRecentlyPlayed(track.id);
      }
    }
  };

  // Fetch data functions
  const fetchRecentlyPlayed = async () => {
    setIsLoading(prev => ({ ...prev, recentlyPlayed: true }));
    try {
      const response = await axios.get('/listener/recently-played');
      if (response.data && response.data.data) {
        setRecentlyPlayed(response.data.data);
        console.log('Fetched recently played tracks:', response.data.data.length);
      } else {
        console.error('Invalid response format for recently played tracks:', response.data);
        setRecentlyPlayed([]);
      }
    } catch (error) {
      console.error('Error fetching recently played tracks:', error);
      toast.error('Failed to load recently played tracks');
      setRecentlyPlayed([]);
    } finally {
      setIsLoading(prev => ({ ...prev, recentlyPlayed: false }));
    }
  };

  const fetchMostPlayed = async () => {
    setIsLoading(prev => ({ ...prev, mostPlayed: true }));
    try {
      const response = await axios.get('/listener/most-played');
      if (response.data && response.data.data) {
        setMostPlayed(response.data.data);
        console.log('Fetched most played tracks:', response.data.data.length);
      } else {
        console.error('Invalid response format for most played tracks:', response.data);
        setMostPlayed([]);
      }
    } catch (error) {
      console.error('Error fetching most played tracks:', error);
      toast.error('Failed to load most played tracks');
      setMostPlayed([]);
    } finally {
      setIsLoading(prev => ({ ...prev, mostPlayed: false }));
    }
  };

  const fetchFavorites = async () => {
    setIsLoading(prev => ({ ...prev, favorites: true }));
    try {
      const response = await axios.get('/listener/favorites');
      if (response.data && response.data.data) {
        setFavoriteTracks(response.data.data);
        console.log('Fetched favorite tracks:', response.data.data.length);
      } else {
        console.error('Invalid response format for favorite tracks:', response.data);
        setFavoriteTracks([]);
      }
    } catch (error) {
      console.error('Error fetching favorite tracks:', error);
      toast.error('Failed to load favorite tracks');
      setFavoriteTracks([]);
    } finally {
      setIsLoading(prev => ({ ...prev, favorites: false }));
    }
  };

  const fetchFollowedArtists = async () => {
    setIsLoading(prev => ({ ...prev, artists: true }));
    try {
      const response = await axios.get('/listener/followed-artists');
      if (response.data && response.data.data) {
        setFollowedArtists(response.data.data);
        console.log('Fetched followed artists:', response.data.data.length);
      } else {
        console.error('Invalid response format for followed artists:', response.data);
        setFollowedArtists([]);
      }
    } catch (error) {
      console.error('Error fetching followed artists:', error);
      toast.error('Failed to load followed artists');
      setFollowedArtists([]);
    } finally {
      setIsLoading(prev => ({ ...prev, artists: false }));
    }
  };

  const fetchPlaylists = async () => {
    setIsLoading(prev => ({ ...prev, playlists: true }));
    try {
      const response = await axios.get('/listener/playlists');
      if (response.data && response.data.data) {
        setPlaylists(response.data.data);
        console.log('Fetched playlists:', response.data.data.length);
      } else {
        console.error('Invalid response format for playlists:', response.data);
        setPlaylists([]);
      }
    } catch (error) {
      console.error('Error fetching playlists:', error);
      toast.error('Failed to load playlists');
      setPlaylists([]);
    } finally {
      setIsLoading(prev => ({ ...prev, playlists: false }));
    }
  };

  const fetchListeningActivity = async () => {
    setIsLoading(prev => ({ ...prev, activity: true }));
    try {
      const response = await axios.get('/listener/activity');
      if (response.data && response.data.data) {
        setListeningActivity(response.data.data);
        console.log('Fetched listening activity:', response.data.data.length, 'days');
      } else {
        console.error('Invalid response format for listening activity:', response.data);
        setListeningActivity([]);
      }
    } catch (error) {
      console.error('Error fetching listening activity:', error);
      toast.error('Failed to load listening activity');
      setListeningActivity([]);
    } finally {
      setIsLoading(prev => ({ ...prev, activity: false }));
    }
  };

  const fetchRecommendations = async () => {
    setIsLoading(prev => ({ ...prev, recommendations: true }));
    try {
      const response = await axios.get('/listener/recommendations');
      if (response.data && response.data.data) {
        setRecommendedTracks(response.data.data);
        console.log('Fetched recommendations:', response.data.data.length);
      } else {
        console.error('Invalid response format for recommendations:', response.data);
        setRecommendedTracks([]);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast.error('Failed to load recommendations');
      setRecommendedTracks([]);
    } finally {
      setIsLoading(prev => ({ ...prev, recommendations: false }));
    }
  };

  const fetchListeningStats = async () => {
    setIsLoading(prev => ({ ...prev, stats: true }));
    try {
      const response = await axios.get('/listener/stats');
      if (response.data && response.data.data) {
        setListeningStats(response.data.data);
        console.log('Fetched listening stats');
      } else {
        console.error('Invalid response format for listening stats:', response.data);
        setListeningStats(null);
      }
    } catch (error) {
      console.error('Error fetching listening stats:', error);
      toast.error('Failed to load listening stats');
      setListeningStats(null);
    } finally {
      setIsLoading(prev => ({ ...prev, stats: false }));
    }
  };

  // Update recently played in the backend
  const updateRecentlyPlayed = async (trackId: number) => {
    try {
      const response = await axios.post('/listener/recently-played', { track_id: trackId });
      console.log('Updated recently played track:', trackId, response.data.data.message);
      return response.data.data;
    } catch (error) {
      console.error('Error updating recently played:', error);
      toast.error('Failed to update recently played');
      throw error;
    }
  };

  // Refresh all data
  const refreshData = () => {
    fetchRecentlyPlayed();
    fetchMostPlayed();
    fetchFavorites();
    fetchFollowedArtists();
    fetchPlaylists();
    fetchListeningActivity();
    fetchRecommendations();
    fetchListeningStats();
  };

  // Fetch data on component mount if not provided
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Create an array of fetch promises
        const fetchPromises = [];

        if (!initialRecentlyPlayed || initialRecentlyPlayed.length === 0) {
          fetchPromises.push(fetchRecentlyPlayed());
        }

        if (!initialMostPlayed || initialMostPlayed.length === 0) {
          fetchPromises.push(fetchMostPlayed());
        }

        if (!initialFavoriteTracks || initialFavoriteTracks.length === 0) {
          fetchPromises.push(fetchFavorites());
        }

        if (!initialFollowedArtists || initialFollowedArtists.length === 0) {
          fetchPromises.push(fetchFollowedArtists());
        }

        if (!initialPlaylists || initialPlaylists.length === 0) {
          fetchPromises.push(fetchPlaylists());
        }

        if (!initialListeningActivity || initialListeningActivity.length === 0) {
          fetchPromises.push(fetchListeningActivity());
        }

        if (!initialRecommendedTracks || initialRecommendedTracks.length === 0) {
          fetchPromises.push(fetchRecommendations());
        }

        if (!initialListeningStats) {
          fetchPromises.push(fetchListeningStats());
        }

        // Execute all fetch promises in parallel
        await Promise.allSettled(fetchPromises);
        console.log('All data fetch operations completed');
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();

    // Set a timeout to clear any stuck loading states after 10 seconds
    const loadingTimeout = setTimeout(() => {
      setIsLoading({
        recentlyPlayed: false,
        mostPlayed: false,
        favorites: false,
        artists: false,
        playlists: false,
        activity: false,
        recommendations: false,
        stats: false
      });
      console.log('Loading timeout reached, clearing all loading states');
    }, 10000);

    // Clean up the timeout when component unmounts
    return () => clearTimeout(loadingTimeout);
  }, []);
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

  // Update the currently playing track in the global state
  useEffect(() => {
    if (currentlyPlaying) {
      // In a real app, this would update a global state or context
      // For now, we'll just log it
      console.log('Currently playing:', currentlyPlaying);

      // You would typically dispatch an action or update context here
      // For example: dispatch({ type: 'SET_CURRENTLY_PLAYING', payload: currentlyPlaying });
    }
  }, [currentlyPlaying]);

  return (
    <div>
      {/* Toast notifications */}
      <div id="toast-container" className="fixed top-4 right-4 z-50">
        {/* Toast notifications will be rendered here by react-hot-toast */}
      </div>

      {/* Audio player (hidden) */}
      {currentlyPlaying && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2 z-40 flex items-center">
          <div className="flex items-center flex-1">
            <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
              <img
                src={currentlyPlaying.image_url || '/images/default-track.jpg'}
                alt={currentlyPlaying.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{currentlyPlaying.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{currentlyPlaying.artist?.name}</p>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => {
                if (audioPlayer) {
                  if (audioPlayer.paused) {
                    audioPlayer.play();
                  } else {
                    audioPlayer.pause();
                  }
                }
              }}
              className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Refresh button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={refreshData}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Data
            </button>
          </div>
          {/* Listening Stats */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6 mb-6">
            <SectionHeader title="Your Listening Stats" />

            {isLoading.stats ? (
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

            {isLoading.activity ? (
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

            {isLoading.recentlyPlayed ? (
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
                {recentlyPlayed?.map((track) => (
                  <MusicCard
                    key={`recent-${track.id}`}
                    music={track}
                    onPlay={playTrack}
                  />
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

            {isLoading.mostPlayed ? (
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
                  <MusicCard
                    key={`most-${track.id}`}
                    music={track}
                    onPlay={playTrack}
                  />
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

            {isLoading.favorites ? (
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
                  <MusicCard
                    key={`fav-${track.id}`}
                    music={track}
                    onPlay={playTrack}
                  />
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

            {isLoading.artists ? (
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

            {isLoading.playlists ? (
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

            {isLoading.recommendations ? (
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
                  <MusicCard
                    key={`rec-${track.id}`}
                    music={track}
                    onPlay={playTrack}
                  />
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
