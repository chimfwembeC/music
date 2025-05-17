import React from 'react';
import WithLayout from '@/Components/WithLayout';
import AdminDashboard from './AdminDashboard';

interface AdminDashboardPageProps {
  platformStats: any;
  userGrowth: any[];
  contentGrowth: any[];
  engagementMetrics: any[];
  topContent: any;
  recentActivity: any;
  systemHealth: any;
}

export default function AdminDashboardPage({
  platformStats,
  userGrowth,
  contentGrowth,
  engagementMetrics,
  topContent,
  recentActivity,
  systemHealth,
}: AdminDashboardPageProps) {
  return (
    <WithLayout
      title="Admin Dashboard"
      allowedRoles={['admin']}
    >
      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6">
        <AdminDashboard
          platformStats={platformStats}
          userGrowth={userGrowth}
          contentGrowth={contentGrowth}
          engagementMetrics={engagementMetrics}
          topContent={topContent}
          recentActivity={recentActivity}
          systemHealth={systemHealth}
        />
      </div>
    </WithLayout>
  );
}
