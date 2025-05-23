// This file is deprecated. Use types from types/inertia.d.ts and types/index.d.ts instead.
// Keeping this file for backward compatibility.

import { Nullable, Team, User, Auth, InertiaSharedProps } from './types/inertia';

export { Nullable, Team, User, Auth, InertiaSharedProps };

export interface Session {
    id: number;
    ip_address: string;
    is_current_device: boolean;
    agent: {
        is_desktop: boolean;
        platform: string;
        browser: string;
    };
    last_active: DateTime;
}

export interface ApiToken {
    id: number;
    name: string;
    abilities: string[];
    last_used_ago: Nullable<DateTime>;
    created_at: DateTime;
    updated_at: DateTime;
}

export interface JetstreamTeamPermissions {
    canAddTeamMembers: boolean;
    canDeleteTeam: boolean;
    canRemoveTeamMembers: boolean;
    canUpdateTeam: boolean;
}

export interface Role {
    key: string;
    name: string;
    permissions: string[];
    description: string;
}

export interface TeamInvitation {
    id: number;
    team_id: number;
    email: string;
    role: Nullable<string>;
    created_at: DateTime;
    updated_at: DateTime;
}


// Types
export interface Genre {
    id: number;
    name: string;
    slug: string;
    description: string;
}

export interface Artist {
    id: number;
    name: string;
    slug?: string;
    bio: string;
    image_url: string;
}

export interface Music {
    id: number;
    title: string;
    slug: string;
    artist_id: number;
    genre_id: number;
    album_id?: number | null;
    file_url: string;
    original_filename?: string | null;
    image_url?: string | null;
    download_counts: number;
    duration: number;
    is_published: boolean;
    is_featured: boolean;
    created_at: string;
    updated_at: string;

    // Optional related models (if eager-loaded from backend)
    artist?: Artist;
    genre?: Genre;
    album?: Album;
  }

export interface Blog {
    id: number;
    title: string;
    slug: string;
    content: string;
    is_published: boolean;
    image_url: string;
    created_at: string;
    reaction_counts: Record<string, number>;
    user_reaction: string | null;
}

export interface SearchResults {
    musics: Music[];
    artists: Artist[];
    genres: Genre[];
    blogs: Blog[];
}

export interface Album {
    id: number;
    title: string;
    slug: string;
    artist?: Artist | null; // Nullable in case there is no artist
    genre?: Genre | null;
    image_url: string | null;
    download_counts: number;
    is_published: boolean;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
  }