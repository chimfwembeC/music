import React, { ReactNode, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
// @ts-ignore
import route from 'ziggy-js';
import useTypedPage from '@/Hooks/useTypedPage';
import AppLayout from '@/Layouts/AppLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import ArtistLayout from '@/Layouts/ArtistLayout';
import ListenerLayout from '@/Layouts/ListenerLayout';
import { Head } from '@inertiajs/react';

interface WithLayoutProps {
  title?: string;
  requireAuth?: boolean;
  allowedRoles?: string[];
  children: ReactNode;
  renderHeader?: () => ReactNode;
}

/**
 * A component that wraps content with the appropriate layout based on user role
 */
const WithLayout: React.FC<WithLayoutProps> = ({
  title = 'Page',
  requireAuth = true,
  allowedRoles = ['admin', 'artist', 'listener'],
  children,
  renderHeader,
}) => {
  const page = useTypedPage();
  const user = page.props.auth.user;

  // If authentication is required and user is not authenticated, redirect to login
  useEffect(() => {
    if (requireAuth && !user) {
      Inertia.visit(route('login'));
    }

    // If user is authenticated but not allowed to access this page, redirect to dashboard
    if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      Inertia.visit(route('dashboard'));
    }
  }, [user, requireAuth, allowedRoles]);

  // If authentication is required but user is not authenticated, return null
  if (requireAuth && !user) {
    return null;
  }

  // If user is authenticated but not allowed to access this page, return null
  if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null;
  }

  // Choose the appropriate layout based on user role
  const Layout = user ? (
    user.role === 'admin' ? AdminLayout :
    user.role === 'artist' ? ArtistLayout :
    user.role === 'listener' ? ListenerLayout :
    AppLayout
  ) : AppLayout;

  // Default header if none is provided
  const defaultHeader = () => (
    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
      {title}
    </h2>
  );

  return (
    <Layout
      title={title}
      renderHeader={renderHeader || defaultHeader}
    >
      <Head title={title} />
      {children}
    </Layout>
  );
};

export default WithLayout;
