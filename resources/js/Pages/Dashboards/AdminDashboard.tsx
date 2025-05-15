import { DailyListenersChart } from '@/Components/Charts/DailyListenersChart';
import { GenrePieChart } from '@/Components/Charts/GenrePieChart';
import ListenerChart from '@/Components/Charts/ListenerChart';
import { SessionsByHourChart } from '@/Components/Charts/SessionsByHourChart';
import { TopArtistsChart } from '@/Components/Charts/TopArtistsChart';
import PaginatedTable from '@/Components/PaginatedTable';
import StatCard from '@/Components/StatCard';
import { Link } from '@inertiajs/react';
import {
  Music,
  Pencil,
  Trash2,
  Users,
  ListMusic,
  UsersRound,
  AlertTriangle,
} from 'lucide-react';
import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-col-3  lg:grid-cols-5 gap-8">
          <StatCard icon={Music} value={156} label="Trending Artists (Weekly)" />
          <StatCard
            icon={Users}
            value={892}
            label="New Listeners"
            bgColor="bg-blue-200 dark:bg-blue-800"
            iconBgColor="bg-blue-600"
          />
          <StatCard
            icon={ListMusic}
            value={345}
            label="Total Tracks"
            bgColor="bg-green-200 dark:bg-green-800"
            iconBgColor="bg-green-600"
          />
          <StatCard
            icon={UsersRound}
            value={58}
            label="Total Artists"
            bgColor="bg-yellow-200 dark:bg-yellow-700"
            iconBgColor="bg-yellow-600"
          />
          <StatCard
            icon={AlertTriangle}
            value={5}
            label="Reported Content"
            bgColor="bg-red-200 dark:bg-red-800"
            iconBgColor="bg-red-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex gap-4">
          <Link
            href="/tracks/create"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            + New Track
          </Link>
          <Link
            href="/artists/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + New Artist
          </Link>
        </div>

        {/* Featured Music Table */}
        <div className="mt-10">
          <div className="text-lg font-semibold dark:text-purple-500 mb-2">
            Featured Music
          </div>
          <PaginatedTable
            items={[]}
            getRowId={(music) => music?.id}
            columns={[
              {
                label: 'Image',
                type: 'custom',
                render: (music) => (
                  <img
                    src={`/storage/${music?.image_url}`}
                    alt={music?.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                ),
              },
              { label: 'Title', key: 'title' },
              { label: 'Artist', key: 'artist.name' },
              { label: 'Genre', key: 'genre.name' },
              { label: 'Duration', key: 'duration' },
              {
                label: 'Actions',
                type: 'custom',
                render: (album) => (
                  <div className="flex gap-2 justify-center">
                    <Link
                      href={`/albums/${album?.slug}/edit`}
                      className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-600"
                    >
                      <Pencil size={18} />
                    </Link>
                    <button
                      onClick={() => console.log('Delete', album?.slug)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ),
              },
            ]}
          />
        </div>

        {/* Recent Uploads Table */}
        <div className="mt-10">
          <div className="text-lg font-semibold dark:text-purple-500 mb-2">
            Recent Uploads
          </div>
          <PaginatedTable
            items={[]}
            getRowId={(track) => track?.id}
            columns={[
              { label: 'Title', key: 'title' },
              { label: 'Artist', key: 'artist.name' },
              { label: 'Uploaded At', key: 'created_at' },
              {
                label: 'Actions',
                type: 'custom',
                render: (track) => (
                  <div className="flex gap-2 justify-center">
                    <Link href={`/tracks/${track?.slug}/edit`} className="text-indigo-600">
                      <Pencil size={18} />
                    </Link>
                    <button
                      onClick={() => console.log('Delete', track?.slug)}
                      className="text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ),
              },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
  <ListenerChart />
  <GenrePieChart />
  <DailyListenersChart />
  <SessionsByHourChart />
  <TopArtistsChart />
</div>

      </div>
    </div>
  );
}
