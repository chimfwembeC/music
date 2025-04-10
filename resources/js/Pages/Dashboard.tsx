import React from 'react';
import Welcome from '@/Components/Welcome';
import AppLayout from '@/Layouts/AppLayout';
import useTypedPage from '@/Hooks/useTypedPage';
import ListenerDashboard from './Dashboards/ListenerDashboard';

export default function Dashboard() {
  const page = useTypedPage();
  const user = page.props.auth.user;
  return (
    <AppLayout
      title={user && user.role === 'listener' ? 'Listener' : user && user.role === 'artist' ? 'Artist' : user && user.role === 'admin' ? 'Admin' : 'Dashboard' }
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {user && user.role === 'listener' ? 'Listener' : user && user.role === 'artist' ? 'Artist' : user && user.role === 'admin' ? 'Admin' : null }
          {" "}Dashboard
        </h2>
      )}
    >
    

      <div className="py-4">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

            {user && user.role === 'listener' ? <ListenerDashboard user={user}  /> : null}
        </div>
      </div>
    </AppLayout>
  );
}
