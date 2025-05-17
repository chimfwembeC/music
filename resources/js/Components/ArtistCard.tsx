import React from 'react';
import { Link } from '@inertiajs/react';
import { Artist } from '@/types';

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link href={`/artists/${artist.slug}`}>
        <div className="relative pb-[100%]">
          <img
            src={artist.image_url || '/images/default-artist.jpg'}
            alt={artist.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {artist.is_verified && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1" title="Verified Artist">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/artists/${artist.slug}`}>
          <h3 className="font-medium text-gray-900 dark:text-white truncate">{artist.name}</h3>
        </Link>
        {artist.country && (
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
            {artist.city ? `${artist.city}, ` : ''}{artist.country}
          </p>
        )}
        <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {artist.followers_count} {artist.followers_count === 1 ? 'follower' : 'followers'}
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {artist.total_plays} plays
          </div>
        </div>
        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
          <div 
            className="bg-blue-600 h-1.5 rounded-full" 
            style={{ width: `${artist.popularity_score}%` }}
            title={`Popularity: ${artist.popularity_score}%`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
