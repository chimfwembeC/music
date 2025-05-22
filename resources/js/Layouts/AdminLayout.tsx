import React, { PropsWithChildren, ReactNode, useState, useEffect } from 'react';
import { Link, Head } from '@inertiajs/react';
import useTypedPage from '@/Hooks/useTypedPage';
import useRoute from '@/Hooks/useRoute';
import classNames from 'classnames';
import DarkModeToggle from '@/Components/DarkModeToggle';
import AfricanThemeToggle from '@/Components/AfricanThemeToggle';
import Dropdown from '@/Components/Dropdown';
import DropdownLink from '@/Components/DropdownLink';
import ApplicationMark from '@/Components/ApplicationMark';
import { router } from '@inertiajs/core';
import axios from 'axios';
import {
  LayoutDashboard, Users, Music, Disc, User, Tag, BarChart3, Settings,
  Menu, X, ChevronDown, LogOut, Bell, Search, Loader2
} from 'lucide-react';

interface PlatformStats {
  total_users: number;
  listener_count: number;
  artist_count: number;
  total_tracks: number;
  total_albums: number;
  total_artists: number;
  total_genres: number;
  total_plays: number;
  total_likes: number;
  total_playlists: number;
  total_comments: number;
  new_users_today: number;
  new_tracks_today: number;
}

interface AdminLayoutProps {
  title: string;
  renderHeader?: () => ReactNode;
  platformStats?: PlatformStats;
}

export default function AdminLayout({
  title,
  renderHeader,
  children,
  platformStats: propsPlatformStats,
}: PropsWithChildren<AdminLayoutProps>) {
  const page = useTypedPage();
  const user = page.props.auth.user;
  const route = useRoute();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(propsPlatformStats || null);
  const [loading, setLoading] = useState(!propsPlatformStats);

  // Fetch platform stats if not provided as props
  useEffect(() => {
    if (!propsPlatformStats) {
      fetchPlatformStats();
    }
  }, [propsPlatformStats]);

  // Fetch platform stats from API
  const fetchPlatformStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/admin-dashboard');
      setPlatformStats(response.data.data.platform_stats);
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      // Set some default values if the API call fails
      setPlatformStats({
        total_users: 0,
        listener_count: 0,
        artist_count: 0,
        total_tracks: 0,
        total_albums: 0,
        total_artists: 0,
        total_genres: 0,
        total_plays: 0,
        total_likes: 0,
        total_playlists: 0,
        total_comments: 0,
        new_users_today: 0,
        new_tracks_today: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('admin-sidebar');
      if (isMobile && sidebarOpen && sidebar && !sidebar.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, sidebarOpen]);

  function logout(e: React.FormEvent) {
    e.preventDefault();
    router.post(route('logout'));
  }

  // Navigation items with proper routes and icons
  const navigationItems = [
    {
      name: 'Dashboard',
      route: 'admin.dashboard',
      fallback: 'dashboard',
      icon: <LayoutDashboard className="h-5 w-5 mr-2" />
    },
    {
      name: 'Users',
      route: 'users.index',
      fallback: 'dashboard',
      icon: <Users className="h-5 w-5 mr-2" />
    },
    {
      name: 'Music',
      route: 'tracks.index',
      fallback: 'dashboard',
      icon: <Music className="h-5 w-5 mr-2" />
    },
    {
      name: 'Albums',
      route: 'albums.index',
      fallback: 'dashboard',
      icon: <Disc className="h-5 w-5 mr-2" />
    },
    {
      name: 'Artists',
      route: 'artists.index',
      fallback: 'dashboard',
      icon: <User className="h-5 w-5 mr-2" />
    },
    {
      name: 'Genres',
      route: 'genres.index',
      fallback: 'dashboard',
      icon: <Tag className="h-5 w-5 mr-2" />
    },
    {
      name: 'Blogs',
      route: 'blogs.index',
      fallback: 'dashboard',
      icon: <BarChart3 className="h-5 w-5 mr-2" />
    },
    {
      name: 'Profile',
      route: 'profile.show',
      fallback: 'dashboard',
      icon: <Settings className="h-5 w-5 mr-2" />
    },
  ];

  // Function to safely get route
  const getRoute = (routeName: string, fallback: string = 'dashboard') => {
    try {
      return route(routeName);
    } catch (error) {
      console.warn(`Route ${routeName} not found, using fallback`);
      return route(fallback);
    }
  };

  // Function to safely check current route
  const isCurrentRoute = (routeName: string) => {
    try {
      return route().current(routeName);
    } catch (error) {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Head title={title} />

      {/* Header */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo and Sidebar Toggle */}
              <div className="flex-shrink-0 flex items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out mr-2"
                >
                  {sidebarOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
                <Link href={route('dashboard')}>
                  <ApplicationMark className="block h-9 w-auto" />
                </Link>
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-gray-100">Admin</span>
              </div>
            </div>

            <div className="hidden sm:flex sm:items-center sm:ml-6">
              {/* Search */}
              <div className="relative mr-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-600 sm:text-sm"
                />
              </div>

              {/* Notifications */}
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
              </button>

              {/* Theme toggles */}
              <div className="flex items-center space-x-3 mr-3">
                <DarkModeToggle />
                <AfricanThemeToggle />
              </div>

              {/* Settings Dropdown */}
              <div className="ml-3 relative">
                <Dropdown
                  align="right"
                  width="48"
                  renderTrigger={() => (
                    <span className="inline-flex rounded-md">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 active:bg-gray-50 dark:active:bg-gray-700 transition ease-in-out duration-150"
                      >
                        {user?.name}

                        <ChevronDown className="ml-2 -mr-0.5 h-4 w-4" />
                      </button>
                    </span>
                  )}
                >
                  {/* Account Management */}
                  <div className="block px-4 py-2 text-xs text-gray-400">
                    Manage Account
                  </div>

                  <DropdownLink href={route('profile.show')}>
                    Profile
                  </DropdownLink>

                  <div className="border-t border-gray-200 dark:border-gray-600"></div>

                  {/* Authentication */}
                  <form onSubmit={logout}>
                    <DropdownLink as="button">
                      <div className="flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                      </div>
                    </DropdownLink>
                  </form>
                </Dropdown>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out"
              >
                {sidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Heading */}
      {renderHeader ? (
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {renderHeader()}
          </div>
        </header>
      ) : null}

      <div className="flex">
        {/* Sidebar */}
        <div
          id="admin-sidebar"
          className={classNames(
            'fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 overflow-y-auto transition-transform duration-300 ease-in-out transform border-r border-gray-200 dark:border-gray-700 pt-16',
            {
              'translate-x-0': sidebarOpen,
              '-translate-x-full': !sidebarOpen,
              'md:translate-x-0': !isMobile,
            }
          )}
        >
          <div className="px-4 py-4">
            {/* Admin Profile */}
            <div className="flex items-center mb-6 px-2">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white font-bold mr-3 shadow-md border-2 border-white dark:border-gray-700">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Admin Panel
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.name || 'Administrator'}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1 px-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={getRoute(item.route, item.fallback)}
                  className={`group flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isCurrentRoute(item.route)
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-purple-500 hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Quick Stats */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 relative px-2">
              {/* African pattern decoration */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-500 via-red-500 to-purple-500"></div>

              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Quick Stats
              </h4>

              <div className="grid grid-cols-2 gap-2">
                {loading ? (
                  <>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Users</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {platformStats?.total_users?.toLocaleString() || '0'}
                      </div>
                      {platformStats?.new_users_today && platformStats.new_users_today > 0 && (
                        <div className="text-xs text-green-500">
                          +{platformStats.new_users_today} today
                        </div>
                      )}
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Tracks</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {platformStats?.total_tracks?.toLocaleString() || '0'}
                      </div>
                      {platformStats?.new_tracks_today && platformStats.new_tracks_today > 0 && (
                        <div className="text-xs text-green-500">
                          +{platformStats.new_tracks_today} today
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                {loading ? (
                  <>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Artists</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {platformStats?.artist_count?.toLocaleString() || '0'}
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Plays</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {platformStats?.total_plays?.toLocaleString() || '0'}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className={classNames(
          'flex-1 transition-all duration-300 ease-in-out',
          {
            'md:ml-64': !isMobile || sidebarOpen,
          }
        )}>
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg border-t-4 border-purple-600 relative">
                {/* African pattern decoration at the top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-red-500 to-purple-500"></div>

                {/* Content */}
                <div className="p-6">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
