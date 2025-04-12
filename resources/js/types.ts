type DateTime = string;

export type Nullable<T> = T | null;

export interface Team {
    id: number;
    name: string;
    personal_team: boolean;
    created_at: DateTime;
    updated_at: DateTime;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    current_team_id: Nullable<number>;
    profile_photo_path: Nullable<string>;
    profile_photo_url: string;
    two_factor_enabled: boolean;
    email_verified_at: Nullable<DateTime>;
    created_at: DateTime;
    updated_at: DateTime;
}

export interface Auth {
    user: Nullable<
        User & {
            all_teams?: Team[];
            current_team?: Team;
        }
    >;
}

export type InertiaSharedProps<T = {}> = T & {
    jetstream: {
        canCreateTeams: boolean;
        canManageTwoFactorAuthentication: boolean;
        canUpdatePassword: boolean;
        canUpdateProfileInformation: boolean;
        flash: any;
        hasAccountDeletionFeatures: boolean;
        hasApiFeatures: boolean;
        hasTeamFeatures: boolean;
        hasTermsAndPrivacyPolicyFeature: boolean;
        managesProfilePhotos: boolean;
        hasEmailVerification: boolean;
    };
    auth: Auth;
    errorBags: any;
    errors: any;
};

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