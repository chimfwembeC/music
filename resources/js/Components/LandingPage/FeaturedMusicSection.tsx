import React, { useState } from 'react';
import { Music, Timer, X } from 'lucide-react';

interface Artist {
  id: number;
  name: string;
}

interface Genre {
  id: number;
  name: string;
}

interface MusicType {
  id: number;
  title: string;
  artist: Artist;
  genre: Genre;
  duration: number;
  created_at: string;
  image_url: string;
  file_url: string;
  original_filename: string;
}

const musicData: MusicType[] = [
  {
    id: 1,
    title: 'Summer Breeze (Extended Mix)',
    artist: { id: 1, name: 'Luna Ray' },
    genre: { id: 1, name: 'Indie Pop' },
    duration: 234,
    created_at: '2024-03-15',
    image_url:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80',
    file_url: 'https://example.com/music1.mp3',
    original_filename: 'summer_breeze.mp3',
  },
  {
    id: 2,
    title: 'Midnight Drive',
    artist: { id: 2, name: 'The Waves' },
    genre: { id: 2, name: 'Electronic' },
    duration: 198,
    created_at: '2024-03-14',
    image_url:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80',
    file_url: 'https://example.com/music2.mp3',
    original_filename: 'midnight_drive.mp3',
  },
  {
    id: 3,
    title: 'Urban Dreams',
    artist: { id: 3, name: 'City Lights' },
    genre: { id: 3, name: 'Hip Hop' },
    duration: 256,
    created_at: '2024-03-13',
    image_url:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&h=800',
    file_url: 'https://example.com/music3.mp3',
    original_filename: 'urban_dreams.mp3',
  },
  {
    id: 4,
    title: 'Ocean Waves',
    artist: { id: 4, name: 'Coastal Vibes' },
    genre: { id: 4, name: 'Ambient' },
    duration: 345,
    created_at: '2024-03-12',
    image_url:
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&h=600',
    file_url: 'https://example.com/music4.mp3',
    original_filename: 'ocean_waves.mp3',
  },
  {
    id: 5,
    title: 'City Nights',
    artist: { id: 5, name: 'Urban Echo' },
    genre: { id: 5, name: 'Lo-Fi' },
    duration: 289,
    created_at: '2024-03-11',
    image_url:
      'https://images.unsplash.com/photo-1513829596324-4bb2800c5efb?auto=format&fit=crop&q=80&h=900',
    file_url: 'https://example.com/music5.mp3',
    original_filename: 'city_nights.mp3',
  },
];


const MusicCard = ({ music }: { music: MusicType }) => (
  <div className="overflow-hidden transition-all transform border border-purple-600">
    <div className="relative">
      <img
        src={music.image_url}
        alt={music.title || 'Featured music'}
        className="w-full object-cover h-48"
        loading="lazy"
      />

      <div className="absolute inset-0 bg-black bg-opacity-50 hover:bg-opacity-0 transition-all duration-300"></div>
      {/* Music Info at the bottom */}
      <div className="group">
        <div className="absolute -bottom-4 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent p-4 transform translate-y-20 group-hover:translate-y-0 transition-transform duration-300">
        <p className="flex gap-2 items-center text-xs text-gray-400">
            <Timer className='h-4 w-4' />
            {music.created_at}
          </p>
          <h3 className="text-lg font-semibold text-white">{music.artist.name} - {music.title}</h3>        
          <p className=" text-xs text-gray-400 mb-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro ratione, eveniet accusamus ipsam.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const FeaturedMusicSection = () => (
  <div className="py-10 px-4 sm:px-6 lg:px-8">
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Music className="w-7 h-7 text-purple-600" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-purple-500 transition-all duration-300">Featured Music</h1>
      </div>

      {/* Music Cards Grid */}
      <div className="grid grid-cols-2">
        {musicData.slice(0, 2).map(music => (
          <MusicCard key={music.id} music={music} />
        ))}
      </div>

      <div className="grid grid-cols-3">
        {musicData.slice(2, 5).map(music => (
          <MusicCard key={music.id} music={music} />
        ))}
      </div>
    </div>
  </div>
);

export default FeaturedMusicSection;
