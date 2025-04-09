import { Album, Music } from '@/types';
import { Link } from '@inertiajs/react';
import React from 'react';

interface LatestAlbumsProps {
  albums?: Album[];
  music?: Music[];
}

const staticAlbums: Album[] = [
  {
    id: 1,
    title: 'J Cole - Complete Discography',
    slug: 'complete-discography',
    //   artist: { id: 1, name: 'J. Cole' },
    //   genre: { id: 1, name: 'Hip Hop' },
    image_url:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80',
    download_counts: 5000,
    is_published: true,
    created_at: '2024-03-15',
    updated_at: '2024-03-15',
  },
  {
    id: 2,
    title: 'Drake – Best of the Best',
    slug: 'drake-best-of-the-best',
    //   artist: { id: 2, name: 'Drake' },
    //   genre: { id: 2, name: 'Hip Hop', slug: 'hip-hop' },
    image_url:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80',
    download_counts: 6000,
    is_published: true,
    created_at: '2024-03-14',
    updated_at: '2024-03-14',
  },
  {
    id: 3,
    title: 'The Weeknd – After Hours',
    slug: 'the-weeknd-after-hours',
    //   artist: { id: 3, name: 'The Weeknd' },
    //   genre: { id: 3, name: 'R&B' },
    image_url:
      'https://images.unsplash.com/photo-1492275174747-d7e79a2f72a2?auto=format&fit=crop&q=80',
    download_counts: 7000,
    is_published: true,
    created_at: '2024-03-13',
    updated_at: '2024-03-13',
  },
  {
    id: 4,
    title: 'Kendrick Lamar – DAMN.',
    slug: 'kendrick-lamar-damn',
    //   artist: { id: 4, name: 'Kendrick Lamar' },
    //   genre: { id: 4, name: 'Hip Hop' },
    image_url:
      'https://images.unsplash.com/photo-1589362519207-9908e8e92d04?auto=format&fit=crop&q=80',
    download_counts: 8000,
    is_published: true,
    created_at: '2024-03-12',
    updated_at: '2024-03-12',
  },
  {
    id: 5,
    title: 'Ariana Grande – Positions',
    slug: 'ariana-grande-positions',
    //   artist: { id: 5, name: 'Ariana Grande' },
    //   genre: { id: 5, name: 'Pop' },
    image_url:
      'https://images.unsplash.com/photo-1585300277841-4f6a6b58e746?auto=format&fit=crop&q=80',
    download_counts: 9000,
    is_published: true,
    created_at: '2024-03-11',
    updated_at: '2024-03-11',
  },
];

const musicData: Music[] = [
  {
    id: 1,
    title: 'Summer Breeze (Extended Mix)',
    slug: 'summer-breeze-extended-mix',
    artist_id: 1,
    genre_id: 1,
    album_id: 1,
    duration: 234,
    file_url: 'https://example.com/music1.mp3',
    original_filename: 'summer_breeze.mp3',
    image_url:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80',
    download_counts: 1200,
    is_published: true,
    created_at: '2024-03-15',
    updated_at: '2024-03-15',
  },
  {
    id: 2,
    title: 'Midnight Drive',
    slug: 'midnight-drive',
    artist_id: 2,
    genre_id: 2,
    album_id: 2,
    duration: 198,
    file_url: 'https://example.com/music2.mp3',
    original_filename: 'midnight_drive.mp3',
    image_url:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80',
    download_counts: 950,
    is_published: true,
    created_at: '2024-03-14',
    updated_at: '2024-03-14',
  },
  {
    id: 3,
    title: 'Urban Dreams',
    slug: 'urban-dreams',
    artist_id: 3,
    genre_id: 3,
    album_id: 2,
    duration: 256,
    file_url: 'https://example.com/music3.mp3',
    original_filename: 'urban_dreams.mp3',
    image_url:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&h=800',
    download_counts: 1100,
    is_published: true,
    created_at: '2024-03-13',
    updated_at: '2024-03-13',
  },
  {
    id: 4,
    title: 'Ocean Waves',
    slug: 'ocean-waves',
    artist_id: 4,
    genre_id: 4,
    album_id: 3,
    duration: 345,
    file_url: 'https://example.com/music4.mp3',
    original_filename: 'ocean_waves.mp3',
    image_url:
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&h=600',
    download_counts: 850,
    is_published: true,
    created_at: '2024-03-12',
    updated_at: '2024-03-12',
  },
  {
    id: 5,
    title: 'City Nights',
    slug: 'city-nights',
    artist_id: 5,
    genre_id: 5,
    album_id: 3,
    duration: 289,
    file_url: 'https://example.com/music5.mp3',
    original_filename: 'city_nights.mp3',
    image_url:
      'https://images.unsplash.com/photo-1513829596324-4bb2800c5efb?auto=format&fit=crop&q=80&h=900',
    download_counts: 1400,
    is_published: true,
    created_at: '2024-03-11',
    updated_at: '2024-03-11',
  },
];

export default function LatestAlbums({
  albums = staticAlbums,
  music = musicData,
}: LatestAlbumsProps) {
  // Sort albums by created_at DESC
  const latestAlbums = [...albums]
    .filter(a => a.is_published)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 3);

  // Top 3 trending music by download_counts
  const trendingMusic = [...music]
    .filter(m => m.is_published)
    .sort((a, b) => b.download_counts - a.download_counts)
    .slice(0, 3);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Latest Albums */}
        <h1 className="text-xl font-bold text-gray-800 dark:text-purple-500 mb-4">
          Latest Albums
        </h1>

        <div className="grid grid-cols-3 gap-8">
          {/* Highlight the latest album (first) */}
          <div className=" col-span-2 mb-6">
            {latestAlbums.length > 0 && (
              <div className="bg-gray-400/50 dark:bg-purple-800 border-b-4 border-gray-400/40 dark:border-purple-500 mb-2">
                <div className="flex gap-6">
                  <img
                    src={
                      latestAlbums[0].image_url ||
                      'https://via.placeholder.com/150'
                    }
                    alt={latestAlbums[0].title}
                    className="w-64 h-48 object-cover"
                  />
                  <div className="dark:text-white text-2xl font-semibold pt-4">
                    {latestAlbums[0].artist?.name
                      ? `${latestAlbums[0].artist.name} – `
                      : ''}
                    {latestAlbums[0].title}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-400/50 dark:bg-purple-800">
              {/* List the rest of the albums */}
              <div className="grid grid-cols-2 gap-6">
                {latestAlbums.slice(1).map(album => (
                  <div key={album.id} className="p-2 px-4">
                    <div className="dark:text-white text-lg hover:underline">
                      <Link href={`/albums/${album.slug}`}>
                        {album.artist?.name ? `${album.artist.name} – ` : ''}
                        {album.title}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trending Music */}
          <div className="col-span-1">
            <h2 className="text-xl font-bold text-gray-800 dark:text-purple-500 mb-2">
              Trending Music
            </h2>

            <div className="bg-gray-400/50 dark:bg-purple-800 p-4 border-b-4 border-gray-400/50 dark:border-purple-500 space-y-2">
              {trendingMusic.map(track => (
                <div key={track.id} className="hover:underline dark:text-white">
                  <Link href={`/music/${track.slug}`}>{track.title}</Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
