import React, { useEffect, useState } from 'react';
import useTypedPage from '@/Hooks/useTypedPage';
import { Head, Link } from '@inertiajs/react';
import WithLayout from '@/Components/WithLayout';
import ListenerDashboard from './Dashboards/ListenerDashboard';
import ArtistDashboard from './Dashboards/ArtistDashboard';
import AdminDashboard from './Dashboards/AdminDashboard';
import LoadingState from '@/Components/LoadingState';
import EmptyState from '@/Components/EmptyState';
import ArtistLayout from '@/Layouts/ArtistLayout';

interface DashboardProps {
  userRole?: string;
  // Dashboard data props
  recentlyPlayed?: any[];
  mostPlayed?: any[];
  favoriteTracks?: any[];
  followedArtists?: any[];
  playlists?: any[];
  recommendedTracks?: any[];
  listeningStats?: any;
  listeningActivity?: any[];
  // Artist dashboard props
  artist?: any;
  tracks?: any[];
  albums?: any[];
  trackPerformance?: any[];
  demographics?: any;
  followersGrowth?: any[];
  topTracks?: any[];
  revenue?: any;
  stats?: any;
  // Admin dashboard props
  platformStats?: any;
  userGrowth?: any[];
  contentGrowth?: any[];
  engagementMetrics?: any[];
  topContent?: any;
  recentActivity?: any;
  systemHealth?: any;
}

export default function Dashboard({
  userRole,
  // Pass all props to the appropriate dashboard component
  ...dashboardProps
}: DashboardProps) {
  const page = useTypedPage();
  const user = page.props.auth.user;
  const [isLoading, setIsLoading] = useState(true);
  // We'll keep error state for future use
  const [error] = useState<string | null>(null);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Get the role from props or from the authenticated user
  const role = userRole || user?.role;

  // Determine the dashboard title based on role
  const dashboardTitle = role ? `${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard` : 'Dashboard';

  // Render the appropriate dashboard based on user role
  const renderDashboard = () => {
    if (isLoading) {
      return <LoadingState message={`Loading your ${role} dashboard...`} />;
    }

    if (error) {
      return (
        <EmptyState
          title="Something went wrong"
          message={error}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
          action={{
            label: "Refresh",
            onClick: () => window.location.reload()
          }}
        />
      );
    }

    switch (role) {
      case 'listener':
        return <ListenerDashboard
          // Type assertion to satisfy TypeScript
          recentlyPlayed={dashboardProps.recentlyPlayed || []}
          mostPlayed={dashboardProps.mostPlayed || []}
          favoriteTracks={dashboardProps.favoriteTracks || []}
          followedArtists={dashboardProps.followedArtists || []}
          playlists={dashboardProps.playlists || []}
          recommendedTracks={dashboardProps.recommendedTracks || []}
          listeningStats={dashboardProps.listeningStats || {}}
          listeningActivity={dashboardProps.listeningActivity || []}
        />;
      case 'artist':
        // Check if artist profile exists
        if (!dashboardProps.artist) {
          return (
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Artist Profile Not Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You don't have an artist profile yet. Create one to start managing your music.
              </p>
              <Link href="/artists/create" className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150">
                Create Artist Profile
              </Link>
            </div>
          );
        }

        return <ArtistDashboard
          artist={dashboardProps.artist}
          tracks={dashboardProps.tracks || []}
          albums={dashboardProps.albums || []}
          trackPerformance={dashboardProps.trackPerformance || []}
          demographics={dashboardProps.demographics || {}}
          followersGrowth={dashboardProps.followersGrowth || []}
          topTracks={dashboardProps.topTracks || []}
          revenue={dashboardProps.revenue || {}}
          stats={dashboardProps.stats || {}}
        />;
      case 'admin':
        return <AdminDashboard
          platformStats={dashboardProps.platformStats || {}}
          userGrowth={dashboardProps.userGrowth || []}
          contentGrowth={dashboardProps.contentGrowth || []}
          engagementMetrics={dashboardProps.engagementMetrics || []}
          topContent={dashboardProps.topContent || {}}
          recentActivity={dashboardProps.recentActivity || {}}
          systemHealth={dashboardProps.systemHealth || {}}
        />;
      default:
        return (
          <EmptyState
            title="Welcome to Your Dashboard"
            message="Please select a role to continue."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          />
        );
    }
  };

  // For artist users, use the ArtistLayout
  if (role === 'artist') {
    // If artist profile doesn't exist, still use WithLayout
    if (!dashboardProps.artist) {
      return (
        <WithLayout
          title={dashboardTitle}
          renderHeader={() => (
            <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
              {dashboardTitle}
            </h2>
          )}
        >
          <Head title={dashboardTitle} />
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Artist Profile Not Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You don't have an artist profile yet. Create one to start managing your music.
            </p>
            <Link href="/artists/create" className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150">
              Create Artist Profile
            </Link>
          </div>
        </WithLayout>
      );
    }

    // Use ArtistLayout for artists with a profile
    return (
      <ArtistLayout
        title={dashboardTitle}
        renderHeader={() => (
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {dashboardTitle}
          </h2>
        )}
      >
        <Head title={dashboardTitle} />
        <ArtistDashboard
          artist={dashboardProps.artist}
          tracks={dashboardProps.tracks || []}
          albums={dashboardProps.albums || []}
          trackPerformance={dashboardProps.trackPerformance || []}
          demographics={dashboardProps.demographics || {}}
          followersGrowth={dashboardProps.followersGrowth || []}
          topTracks={dashboardProps.topTracks || []}
          revenue={dashboardProps.revenue || {}}
          stats={dashboardProps.stats || {}}
        />
      </ArtistLayout>
    );
  }

  // For other users, use the standard WithLayout
  return (
    <WithLayout
      title={dashboardTitle}
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {dashboardTitle}
        </h2>
      )}
    >
      <Head title={dashboardTitle} />
      {renderDashboard()}
    </WithLayout>
  );
}
