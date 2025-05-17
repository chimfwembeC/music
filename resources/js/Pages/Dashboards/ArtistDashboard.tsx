import React from 'react';
import { Artist, Music, Album, TrackPerformance, Demographics, FollowersGrowth, RevenueStats, ArtistStats } from '@/types';
import MusicCard from '@/Components/MusicCard';
import AlbumCard from '@/Components/AlbumCard';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ArtistDashboardProps {
  artist: Artist;
  tracks: Music[];
  albums: Album[];
  trackPerformance: TrackPerformance[];
  demographics: Demographics;
  followersGrowth: FollowersGrowth[];
  topTracks: Music[];
  revenue: RevenueStats;
  stats: ArtistStats;
}

const ArtistDashboard: React.FC<ArtistDashboardProps> = ({
  artist,
  tracks,
  albums,
  trackPerformance,
  demographics,
  followersGrowth,
  topTracks,
  revenue,
  stats,
}) => {
  // Prepare data for the track performance chart
  const performanceChartData = {
    labels: trackPerformance?.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }) || [],
    datasets: [
      {
        label: 'Plays',
        data: trackPerformance?.map(item => item.plays) || [],
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Likes',
        data: trackPerformance?.map(item => item.likes) || [],
        fill: false,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  const performanceChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Track Performance (Last 30 Days)',
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Plays',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Likes',
        },
      },
    },
  };

  // Prepare data for the followers growth chart
  const followersChartData = {
    labels: followersGrowth?.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }) || [],
    datasets: [
      {
        label: 'New Followers',
        data: followersGrowth?.map(item => item.new_followers) || [],
        fill: false,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.4,
      },
      {
        label: 'Total Followers',
        data: followersGrowth?.map(item => item.total_followers) || [],
        fill: false,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  const followersChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Followers Growth (Last 30 Days)',
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'New Followers',
        },
        min: 0,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Total Followers',
        },
        min: 0,
      },
    },
  };

  // Prepare data for the demographics chart
  const demographicsChartData = {
    labels: demographics?.locations?.map((item: { location: string; count: number }) => item.location) || [],
    datasets: [
      {
        label: 'Listeners by Location',
        data: demographics?.locations?.map((item: { location: string; count: number }) => item.count) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const demographicsChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Audience Demographics',
      },
    },
  };

  return (
    <>
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Artist Profile Summary */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <img
                  src={artist.image_url || '/images/default-artist.jpg'}
                  alt={artist.name}
                  className="w-32 h-32 rounded-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                  {artist.name}
                  {artist.is_verified && (
                    <span className="ml-2 bg-blue-500 text-white rounded-full p-1" title="Verified Artist">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{artist.bio || 'No bio available'}</p>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Followers</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{stats?.total_followers || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Plays</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{stats?.total_plays || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tracks</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{stats?.total_tracks || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Albums</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{stats?.total_albums || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Track Performance Chart */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6">
              <Line data={performanceChartData} options={performanceChartOptions} />
            </div>

            {/* Followers Growth Chart */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6">
              <Line data={followersChartData} options={followersChartOptions} />
            </div>
          </div>

          {/* Top Tracks */}
          {topTracks?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Your Top Tracks
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {topTracks.map((track) => (
                  <MusicCard key={`top-${track.id}`} music={track} />
                ))}
              </div>
            </div>
          )}

          {/* Demographics */}
          {demographics?.locations?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Audience Demographics
              </h3>
              <div className="h-64">
                <Bar data={demographicsChartData} options={demographicsChartOptions} />
              </div>
            </div>
          )}

          {/* Recent Tracks */}
          {tracks?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Your Recent Tracks
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tracks.slice(0, 4).map((track) => (
                  <MusicCard key={`recent-${track.id}`} music={track} />
                ))}
              </div>
            </div>
          )}

          {/* Recent Albums */}
          {albums?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Your Albums
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {albums.slice(0, 4).map((album) => (
                  <AlbumCard key={`album-${album.id}`} album={album} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ArtistDashboard;
