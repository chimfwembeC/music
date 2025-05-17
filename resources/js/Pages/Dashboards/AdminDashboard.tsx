import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
  PlatformStats,
  UserGrowth,
  ContentGrowth,
  EngagementMetrics,
  TopContent,
  RecentActivity,
  SystemHealth,
  Music,
  Album,
  Artist,
  Genre,
  User,
  Blog
} from '@/types';
import MusicCard from '@/Components/MusicCard';
import AlbumCard from '@/Components/AlbumCard';
import ArtistCard from '@/Components/ArtistCard';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
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
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AdminDashboardProps {
  platformStats: PlatformStats;
  userGrowth: UserGrowth[];
  contentGrowth: ContentGrowth[];
  engagementMetrics: EngagementMetrics[];
  topContent: TopContent;
  recentActivity: RecentActivity;
  systemHealth: SystemHealth;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  platformStats,
  userGrowth,
  contentGrowth,
  engagementMetrics,
  topContent,
  recentActivity,
  systemHealth,
}) => {
  // Prepare data for the user growth chart
  const userGrowthChartData = {
    labels: userGrowth?.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Total Users',
        data: userGrowth?.map(item => item.total) || [],
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4,
      },
      {
        label: 'Listeners',
        data: userGrowth?.map(item => item.listeners) || [],
        fill: false,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.4,
      },
      {
        label: 'Artists',
        data: userGrowth?.map(item => item.artists) || [],
        fill: false,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.4,
      },
    ],
  };

  const userGrowthChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'User Growth (Last 30 Days)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Prepare data for the content growth chart
  const contentGrowthChartData = {
    labels: contentGrowth?.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }) || [],
    datasets: [
      {
        label: 'Tracks',
        data: contentGrowth?.map(item => item.tracks) || [],
        fill: false,
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        tension: 0.4,
      },
      {
        label: 'Albums',
        data: contentGrowth?.map(item => item.albums) || [],
        fill: false,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        tension: 0.4,
      },
    ],
  };

  const contentGrowthChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Content Growth (Last 30 Days)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Prepare data for the engagement metrics chart
  const engagementChartData = {
    labels: engagementMetrics?.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }) || [],
    datasets: [
      {
        label: 'Plays',
        data: engagementMetrics?.map(item => item.plays) || [],
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Likes',
        data: engagementMetrics?.map(item => item.likes) || [],
        fill: false,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.4,
        yAxisID: 'y1',
      },
      {
        label: 'Comments',
        data: engagementMetrics?.map(item => item.comments) || [],
        fill: false,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  const engagementChartOptions = {
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
        text: 'Engagement Metrics (Last 30 Days)',
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
          text: 'Likes & Comments',
        },
      },
    },
  };

  // Prepare data for the user distribution chart
  const userDistributionChartData = {
    labels: ['Listeners', 'Artists', 'Admins'],
    datasets: [
      {
        data: [
          platformStats?.listener_count || 0,
          platformStats?.artist_count || 0,
          (platformStats?.total_users || 0) - (platformStats?.listener_count || 0) - (platformStats?.artist_count || 0)
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const userDistributionChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'User Distribution',
      },
    },
  };

  return (
    <>    
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Platform Statistics */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Platform Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{platformStats?.total_users || 0}</p>
                <p className="text-xs text-green-600 dark:text-green-400">+{platformStats?.new_users_today || 0} today</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tracks</h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{platformStats?.total_tracks || 0}</p>
                <p className="text-xs text-green-600 dark:text-green-400">+{platformStats?.new_tracks_today || 0} today</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Albums</h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{platformStats?.total_albums || 0}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Artists</h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{platformStats?.total_artists || 0}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Plays</h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{platformStats?.total_plays || 0}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Likes</h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{platformStats?.total_likes || 0}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Playlists</h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{platformStats?.total_playlists || 0}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Comments</h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{platformStats?.total_comments || 0}</p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* User Growth Chart */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6">
              <Line data={userGrowthChartData} options={userGrowthChartOptions} />
            </div>

            {/* User Distribution Chart */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6">
              <Doughnut data={userDistributionChartData} options={userDistributionChartOptions} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Content Growth Chart */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6">
              <Line data={contentGrowthChartData} options={contentGrowthChartOptions} />
            </div>

            {/* Engagement Metrics Chart */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6">
              <Line data={engagementChartData} options={engagementChartOptions} />
            </div>
          </div>

          {/* Top Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Top Tracks */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Top Tracks
              </h3>
              <div className="space-y-4">
                {topContent?.top_tracks?.map((track, index) => (
                  <div key={`top-track-${track.id}`} className="flex items-center">
                    <span className="text-lg font-bold text-gray-500 dark:text-gray-400 w-8">{index + 1}</span>
                    <img
                      src={track.image_url || '/images/default-track.jpg'}
                      alt={track.title}
                      className="w-12 h-12 object-cover rounded mr-4"
                    />
                    <div className="flex-grow">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{track.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{track.artist?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{track.view_count} plays</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{track.like_count} likes</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Artists */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Top Artists
              </h3>
              <div className="space-y-4">
                {topContent?.top_artists?.map((artist, index) => (
                  <div key={`top-artist-${artist.id}`} className="flex items-center">
                    <span className="text-lg font-bold text-gray-500 dark:text-gray-400 w-8">{index + 1}</span>
                    <img
                      src={artist.image_url || '/images/default-artist.jpg'}
                      alt={artist.name}
                      className="w-12 h-12 object-cover rounded-full mr-4"
                    />
                    <div className="flex-grow">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{artist.name}</h4>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${artist.popularity_score}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{artist.followers_count} followers</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{artist.total_plays} plays</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Recent Users */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Recent Users
              </h3>
              <div className="space-y-4">
                {recentActivity?.recent_users?.map((user) => (
                  <div key={`recent-user-${user.id}`} className="flex items-center">
                    <img
                      src={user.profile_photo_url}
                      alt={user.name}
                      className="w-10 h-10 object-cover rounded-full mr-4"
                    />
                    <div className="flex-grow">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{user.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                        {user.role}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Tracks */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Recent Tracks
              </h3>
              <div className="space-y-4">
                {recentActivity?.recent_tracks?.map((track) => (
                  <div key={`recent-track-${track.id}`} className="flex items-center">
                    <img
                      src={track.image_url || '/images/default-track.jpg'}
                      alt={track.title}
                      className="w-10 h-10 object-cover rounded mr-4"
                    />
                    <div className="flex-grow">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{track.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{track.artist?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(track.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
