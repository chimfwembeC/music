import React, { PropsWithChildren, useState, useEffect } from 'react';
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
import { Music } from '@/types';
import { ChevronDown, ChevronsDown, Clock3, Heart, LayoutDashboard, LogOut, Menu, Music4 as MusicIcon, Search, Settings, Tag, User, X } from 'lucide-react';

interface ListenerLayoutProps {
  title: string;
  renderHeader?: () => JSX.Element;
}

export default function ListenerLayout({
  title,
  renderHeader,
  children,
}: PropsWithChildren<ListenerLayoutProps>) {
  const page = useTypedPage();
  const user = page.props.auth.user;
  const route = useRoute();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
      const sidebar = document.getElementById('sidebar');
      if (
        isMobile &&
        sidebarOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node)
      ) {
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
      route: 'listener.dashboard',
      icon: <LayoutDashboard className="h-5 w-5 mr-2" />,
    },
    {
      name: 'Recently Played',
      route: 'history',
      fallback: 'dashboard',
      icon: <Clock3 className="h-5 w-5 mr-2" />,
    },
    {
      name: 'Favorites',
      route: 'favorites',
      fallback: 'dashboard',
      icon: <Heart className="h-5 w-5 mr-2" />,
    },
    {
      name: 'Playlists',
      route: 'playlists',
      fallback: 'dashboard',
      icon: <MusicIcon className="h-5 w-5 mr-2" />,
    },
    {
      name: 'Following',
      route: 'following',
      fallback: 'dashboard',
      icon: <User className="h-5 w-5 mr-2" />,
    },
    {
      name: 'Discover',
      route: 'discover',
      fallback: 'dashboard',
      icon: <Search className="h-5 w-5 mr-2" />,
    },
    {
      name: 'Genres',
      route: 'genres',
      fallback: 'dashboard',
      icon: <Tag className="h-5 w-5 mr-2" />,
    },
    {
      name: 'Settings',
      route: 'profile.show',
      fallback: 'dashboard',
      icon: <Settings className='h-5 w-5 mr-2' />,
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
      <nav
        className={classNames(
          'bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex-1 transition-all duration-300 ease-in-out',
          {
            'md:ml-64': !isMobile || sidebarOpen,
          },
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-gray-400 dark:border-purple-700">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo and Sidebar Toggle */}
              <div className="flex-shrink-0 flex items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out mr-2"
                >
                  { sidebarOpen
                          ? <Menu className="h-6 w-6" />
                          : <X className="h-6 w-6" />                                                       
                      }
                </button>
                <Link href={route('dashboard')}>
                  <ApplicationMark className="block h-9 w-auto" />
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                <Link
                  href={route('listener.dashboard')}
                  className={classNames(
                    'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out',
                    {
                      'border-indigo-400 dark:border-indigo-600 text-gray-900 dark:text-gray-100':
                        route().current('listener.dashboard'),
                      'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700':
                        !route().current('listener.dashboard'),
                    },
                  )}
                >
                  Dashboard
                </Link>
              </div>
            </div>

            <div className="hidden sm:flex sm:items-center sm:ml-6">
              <div className="flex items-center space-x-3">
                {/* Theme toggles */}
                <DarkModeToggle />
                {/* <AfricanThemeToggle /> */}
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
                        className="inline-flex items-center px-3 py-3 border border-purple-700 text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 active:bg-gray-50 dark:active:bg-gray-700 transition ease-in-out duration-150"
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

                  <div className="border-b border-gray-400 dark:border-purple-700" />

                  <DropdownLink href={route('profile.show')}>
                    <div className="flex">
                    <User className="h-4 w-4 mr-2" />
                      Profile
                    </div>
                  </DropdownLink>

                  <div className="border-b border-gray-400 dark:border-purple-700" />

                  {/* Authentication */}
                  <form onSubmit={logout}>
                    <DropdownLink as="button">
                        <div className="flex">
                            <LogOut className="h-4 w-4 mr-2" />
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
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
        {/* Page Heading */}
        {/* {renderHeader ? (
          <header className="bg-white dark:bg-gray-800 shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              {renderHeader()}
            </div>
          </header>
        ) : null} */}
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div
          id="sidebar"
          className={classNames(
            'fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 overflow-y-auto transition-transform duration-300 ease-in-out transform border-r border-gray-200 dark:border-purple-700',
            {
              'translate-x-0': sidebarOpen,
              '-translate-x-full': !sidebarOpen,
              'md:translate-x-0': !isMobile,
            },
          )}
        >
          <div className="px-4 py-4">
            {/* User Profile */}
            <div className="flex items-center mb-6 px-2">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white font-bold mr-3 shadow-md border-2 border-white dark:border-gray-700">
                {user?.name?.charAt(0) || 'L'}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  My Music
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.name || 'Listener'}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1 px-2 h-60 overflow-y-auto">
              {navigationItems.map(item => (
                <Link
                  key={item.name}
                  href={getRoute(item.route, item.fallback)}
                  className={`group flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isCurrentRoute(item.route)
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 relative px-2">
              {/* African pattern decoration */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-500 via-red-500 to-purple-500"></div>

              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Quick Actions
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    (window.location.href = getRoute(
                      'playlists.create',
                      'dashboard',
                    ))
                  }
                  className="flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  New Playlist
                </button>
                <button
                  onClick={() =>
                    (window.location.href = getRoute('discover', 'dashboard'))
                  }
                  className="flex items-center justify-center px-3 py-2 border border-indigo-300 dark:border-indigo-700 text-sm font-medium rounded-md shadow-sm text-indigo-700 dark:text-indigo-300 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Explore
                </button>
              </div>

              {/* Now Playing Preview */}
              <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Now Playing
                </h5>
                {page.props.currentlyPlaying ? (
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-md flex-shrink-0 mr-3 overflow-hidden">
                      <img
                        src={
                          page.props.currentlyPlaying.image_url ||
                          '/images/default-track.jpg'
                        }
                        alt={page.props.currentlyPlaying.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {page.props.currentlyPlaying.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {page.props.currentlyPlaying.artist?.name ||
                          'Unknown Artist'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        // This would be handled by a global audio player context in a real app
                        const audio = document.getElementById(
                          'global-audio-player',
                        ) as HTMLAudioElement;
                        if (audio) {
                          if (audio.paused) {
                            audio.play();
                          } else {
                            audio.pause();
                          }
                        }
                      }}
                      className="ml-2 p-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-md flex-shrink-0 mr-3"></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        Select a track
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        Start listening
                      </p>
                    </div>
                    <button className="ml-2 p-1.5 rounded-full bg-gray-400 text-white cursor-not-allowed opacity-50">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main
          className={classNames(
            'flex-1 transition-all duration-300 ease-in-out',
            {
              'md:ml-64': !isMobile || sidebarOpen,
            },
          )}
        >
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg border-t-4 border-indigo-600 relative">
                {/* African pattern decoration at the top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-red-500 to-purple-500"></div>

                {/* Content */}
                <div className="p-6">{children}</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
