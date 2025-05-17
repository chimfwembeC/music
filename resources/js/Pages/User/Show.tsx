import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { User, Playlist, Music, Artist, Album } from '@/types';
import { Link } from '@inertiajs/react';
import { useRoute } from '@/Hooks/useRoute';
import { Edit, Calendar, Mail, Music2, Disc3, Users, Heart } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';
import MusicCard from '@/Components/MusicCard';
import PlaylistCard from '@/Components/PlaylistCard';
import AlbumCard from '@/Components/AlbumCard';

interface UserData {
  playlists?: Playlist[];
  favorites?: { music: Music }[];
  recentlyPlayed?: { music: Music }[];
  artist?: Artist;
  tracks?: Music[];
  albums?: Album[];
  followers?: number;
}

interface Props {
  user: User;
  userData: UserData;
}

export default function Show({ user, userData }: Props) {
  const route = useRoute();
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <AppLayout
      title={`${user.name}'s Profile`}
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          User Profile
        </h2>
      )}
    >
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
            {/* User Header */}
            <div className="flex flex-col md:flex-row p-6 gap-6">
              {/* User Avatar */}
              <div className="w-32 h-32 flex-shrink-0">
                {user.profile_photo_url ? (
                  <img
                    src={user.profile_photo_url}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover shadow-md"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shadow-md">
                    <span className="text-3xl font-bold text-gray-500 dark:text-gray-400">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              
              {/* User Info */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 uppercase font-semibold">
                    {user.role}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{user.name}</h1>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Mail size={16} className="mr-2" />
                      {user.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar size={16} className="mr-2" />
                      Joined {formatDate(user.created_at)}
                    </div>
                    
                    {user.role === 'listener' && (
                      <>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Music2 size={16} className="mr-2" />
                          {userData.playlists?.length || 0} Playlists
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Heart size={16} className="mr-2" />
                          {userData.favorites?.length || 0} Favorites
                        </div>
                      </>
                    )}
                    
                    {user.role === 'artist' && userData.artist && (
                      <>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Music2 size={16} className="mr-2" />
                          {userData.tracks?.length || 0} Tracks
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Disc3 size={16} className="mr-2" />
                          {userData.albums?.length || 0} Albums
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Users size={16} className="mr-2" />
                          {userData.followers || 0} Followers
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-6">
                  <Link href={route('users.edit', { id: user.id })}>
                    <PrimaryButton className="flex items-center gap-1">
                      <Edit size={16} />
                      Edit Profile
                    </PrimaryButton>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* User Content Sections */}
            <div className="px-6 pb-6">
              {/* Listener Content */}
              {user.role === 'listener' && (
                <>
                  {/* Playlists */}
                  {userData.playlists && userData.playlists.length > 0 && (
                    <div className="mt-8">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Playlists</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {userData.playlists.slice(0, 4).map(playlist => (
                          <PlaylistCard key={playlist.id} playlist={playlist} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Favorites */}
                  {userData.favorites && userData.favorites.length > 0 && (
                    <div className="mt-8">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Favorite Tracks</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {userData.favorites.slice(0, 4).map(favorite => (
                          <MusicCard key={favorite.music.id} music={favorite.music} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Recently Played */}
                  {userData.recentlyPlayed && userData.recentlyPlayed.length > 0 && (
                    <div className="mt-8">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recently Played</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {userData.recentlyPlayed.slice(0, 4).map(item => (
                          <MusicCard key={item.music.id} music={item.music} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {/* Artist Content */}
              {user.role === 'artist' && userData.artist && (
                <>
                  {/* Tracks */}
                  {userData.tracks && userData.tracks.length > 0 && (
                    <div className="mt-8">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tracks</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {userData.tracks.slice(0, 4).map(track => (
                          <MusicCard key={track.id} music={track} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Albums */}
                  {userData.albums && userData.albums.length > 0 && (
                    <div className="mt-8">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Albums</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {userData.albums.slice(0, 4).map(album => (
                          <AlbumCard key={album.id} album={album} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
