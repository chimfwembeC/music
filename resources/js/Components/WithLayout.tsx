import React, { ReactNode, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
// @ts-ignore
import useTypedPage from '@/Hooks/useTypedPage';
import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import useRoute from '@/Hooks/useRoute';
import AdminLayout from '@/Layouts/AdminLayout';
import ArtistLayout from '@/Layouts/ArtistLayout';
import ListenerLayout from '@/Layouts/ListenerLayout';

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
const route = useRoute();
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
  let Layout = AppLayout;

  if (user) {
    // Dynamically import the layout based on user role
    try {
      if (user.role === 'admin') {
        // We'll use AppLayout as a fallback if the specific layout isn't available
        Layout = AdminLayout;
      } else if (user.role === 'artist') {
        Layout = ArtistLayout;
      } else if (user.role === 'listener') {
        Layout = ListenerLayout;
      }
    } catch (error) {
      console.error('Failed to load layout:', error);
      // Fallback to AppLayout if there's an error
      Layout = AppLayout;
    }
  }

//   console.log('Layout',Layout);

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
