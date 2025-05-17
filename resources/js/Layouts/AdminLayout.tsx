import React, { PropsWithChildren, ReactNode } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import useTypedPage from '@/Hooks/useTypedPage';

interface AdminLayoutProps {
  title: string;
  renderHeader?: () => ReactNode;
}

export default function AdminLayout({
  title,
  renderHeader,
  children,
}: PropsWithChildren<AdminLayoutProps>) {
  const page = useTypedPage();
  const user = page.props.auth.user;

  return (
    <AppLayout title={title} renderHeader={renderHeader}>
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Admin Sidebar */}
            <div className="w-full md:w-64 bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Admin Menu
              </h3>
              <nav className="space-y-2">
                <Link
                  href={route('admin.dashboard')}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    route().current('admin.dashboard')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href={route('dashboard')}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Users
                </Link>
                <Link
                  href={route('dashboard')}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Music
                </Link>
                <Link
                  href={route('dashboard')}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Albums
                </Link>
                <Link
                  href={route('dashboard')}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Artists
                </Link>
                <Link
                  href={route('dashboard')}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Genres
                </Link>
                <Link
                  href={route('dashboard')}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Reports
                </Link>
                <Link
                  href={route('dashboard')}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Settings
                </Link>
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
