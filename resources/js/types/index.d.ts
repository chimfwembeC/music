export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  bio?: string;
  phone?: string;
  location?: string;
  social_links?: Record<string, string>;
  profile_photo_url: string;
  created_at: string;
  updated_at: string;
}

export interface Music {
  id: number;
  title: string;
  slug: string;
  artist_id: number;
  genre_id: number;
  album_id?: number;
  file_url: string;
  image_url?: string;
  duration: number;
  is_published: boolean;
  download_counts: number;
  share_count: number;
  view_count: number;
  like_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  artist?: Artist;
  genre?: Genre;
  album?: Album;
  // Additional properties for dashboard
  last_played_at?: string;
  view_duration?: number;
  play_count?: number;
}

export interface Artist {
  id: number;
  name: string;
  slug: string;
  bio?: string;
  image_url?: string;
  followers_count: number;
  total_plays: number;
  popularity_score: number;
  is_verified: boolean;
  social_links?: Record<string, string>;
  website?: string;
  country?: string;
  city?: string;
  created_at: string;
  updated_at: string;
}

export interface Album {
  id: number;
  title: string;
  slug: string;
  artist_id: number;
  genre_id: number;
  image_url?: string;
  is_published: boolean;
  download_counts: number;
  created_at: string;
  updated_at: string;
  artist?: Artist;
  genre?: Genre;
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Playlist {
  id: number;
  name: string;
  slug: string;
  description?: string;
  user_id: number;
  is_public: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
  user?: User;
  tracks?: Music[];
  tracks_count?: number;
}

export interface Favorite {
  id: number;
  user_id: number;
  favorable_id: number;
  favorable_type: string;
  created_at: string;
  updated_at: string;
  favorable?: Music | Album | Artist;
}

export interface TrackView {
  id: number;
  music_id: number;
  user_id?: number;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  view_duration: number;
  is_unique: boolean;
  created_at: string;
  updated_at: string;
  music?: Music;
}

export interface TrackLike {
  id: number;
  music_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  music?: Music;
}

export interface ArtistFollower {
  id: number;
  artist_id: number;
  user_id: number;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
  artist?: Artist;
  user?: User;
}

export interface ListeningActivity {
  date: string;
  count: number;
}

export interface ListeningStats {
  total_plays: number;
  unique_tracks: number;
  total_listening_time: number;
  total_listening_time_formatted: string;
  most_listened_genre?: {
    id: number;
    name: string;
    listen_count: number;
  };
  most_listened_artist?: {
    id: number;
    name: string;
    listen_count: number;
  };
}

// Artist Dashboard Types
export interface TrackPerformance {
  date: string;
  plays: number;
  likes: number;
}

export interface Demographics {
  locations: {
    location: string;
    count: number;
  }[];
}

export interface FollowersGrowth {
  date: string;
  new_followers: number;
  total_followers: number;
}

export interface RevenueStats {
  total_revenue: number;
  revenue_this_month: number;
  revenue_last_month: number;
  revenue_growth: number;
}

export interface ArtistStats {
  total_tracks: number;
  total_albums: number;
  total_plays: number;
  total_likes: number;
  total_followers: number;
  average_plays: number;
  popularity_score: number;
}

// Admin Dashboard Types
export interface PlatformStats {
  total_users: number;
  listener_count: number;
  artist_count: number;
  total_tracks: number;
  total_albums: number;
  total_artists: number;
  total_genres: number;
  total_plays: number;
  total_likes: number;
  total_playlists: number;
  total_comments: number;
  new_users_today: number;
  new_tracks_today: number;
}

export interface UserGrowth {
  date: string;
  total: number;
  listeners: number;
  artists: number;
}

export interface ContentGrowth {
  date: string;
  tracks: number;
  albums: number;
}

export interface EngagementMetrics {
  date: string;
  plays: number;
  likes: number;
  comments: number;
}

export interface TopContent {
  top_tracks: Music[];
  top_albums: Album[];
  top_artists: Artist[];
  top_genres: Genre[];
}

export interface RecentActivity {
  recent_users: User[];
  recent_tracks: Music[];
  recent_albums: Album[];
  recent_blogs: Blog[];
}

export interface SystemHealth {
  disk_usage: {
    used: number;
    total: number;
    percentage: number;
  };
  memory_usage: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu_usage: number;
  queue_status: string;
  last_backup: string | null;
}
