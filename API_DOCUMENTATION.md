# Music Platform API Documentation

This document provides information about the Music Platform API endpoints, authentication, and usage.

## Base URL

All API endpoints are prefixed with `/api/v1`.

## Authentication

The API uses Laravel Sanctum for authentication. To authenticate:

1. Register a new user or login with existing credentials
2. Use the returned token in subsequent requests in the Authorization header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Authentication Endpoints

#### Register

```
POST /api/v1/register
```

**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password",
  "password_confirmation": "password",
  "role": "listener" // Optional, defaults to "listener"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "User Name",
      "email": "user@example.com",
      "role": "listener",
      ...
    },
    "token": "YOUR_API_TOKEN"
  }
}
```

#### Login

```
POST /api/v1/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password",
  "device_name": "iPhone 12" // Optional
}
```

**Response:**
```json
{
  "status": "success",
  "message": "User logged in successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "User Name",
      "email": "user@example.com",
      ...
    },
    "token": "YOUR_API_TOKEN"
  }
}
```

#### Logout

```
POST /api/v1/logout
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**
```json
{
  "status": "success",
  "message": "User logged out successfully",
  "data": null
}
```

## Music Endpoints

### Get All Tracks

```
GET /api/v1/tracks
```

**Query Parameters:**
- `published` (boolean): Filter by published status
- `featured` (boolean): Filter by featured status
- `artist_id` (integer): Filter by artist
- `genre_id` (integer): Filter by genre
- `album_id` (integer): Filter by album
- `search` (string): Search by title
- `sort_by` (string): Field to sort by (default: created_at)
- `sort_direction` (string): Sort direction (asc/desc, default: desc)
- `per_page` (integer): Number of results per page (default: 15)

**Response:**
```json
{
  "status": "success",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "title": "Track Title",
        "slug": "track-title",
        "artist_id": 1,
        "genre_id": 1,
        "album_id": 1,
        "file_url": "storage/music_files/file.mp3",
        "image_url": "storage/music_images/image.jpg",
        "duration": 180,
        "is_published": true,
        "download_counts": 0,
        "share_count": 0,
        "is_featured": false,
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z",
        "artist": {
          "id": 1,
          "name": "Artist Name",
          ...
        },
        "genre": {
          "id": 1,
          "name": "Genre Name",
          ...
        },
        "album": {
          "id": 1,
          "title": "Album Title",
          ...
        }
      },
      ...
    ],
    "first_page_url": "...",
    "from": 1,
    "last_page": 1,
    "last_page_url": "...",
    "links": [...],
    "next_page_url": null,
    "path": "...",
    "per_page": 15,
    "prev_page_url": null,
    "to": 1,
    "total": 1
  }
}
```

### Get Track Details

```
GET /api/v1/tracks/{id}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "Track Title",
    "slug": "track-title",
    "artist_id": 1,
    "genre_id": 1,
    "album_id": 1,
    "file_url": "storage/music_files/file.mp3",
    "image_url": "storage/music_images/image.jpg",
    "duration": 180,
    "is_published": true,
    "download_counts": 0,
    "share_count": 0,
    "view_count": 0,
    "like_count": 0,
    "is_featured": false,
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "artist": {
      "id": 1,
      "name": "Artist Name",
      ...
    },
    "genre": {
      "id": 1,
      "name": "Genre Name",
      ...
    },
    "album": {
      "id": 1,
      "title": "Album Title",
      ...
    }
  }
}
```

### Record a View for a Track (Authenticated)

```
POST /api/v1/tracks/{id}/view
```

**Request Body:**
```json
{
  "duration": 30 // Optional, duration in seconds
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "view_count": 1,
    "is_unique": true
  }
}
```

### Update View Duration (Authenticated)

```
PUT /api/v1/tracks/{id}/view-duration
```

**Request Body:**
```json
{
  "view_id": 1,
  "duration": 120
}
```

### Toggle Like for a Track (Authenticated)

```
POST /api/v1/tracks/{id}/like
```

**Response:**
```json
{
  "status": "success",
  "message": "Track liked successfully",
  "data": {
    "like_count": 1,
    "is_liked": true
  }
}
```

### Check if User Liked a Track (Authenticated)

```
GET /api/v1/tracks/{id}/like
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "is_liked": true,
    "like_count": 1
  }
}
```

### Get Track Statistics (Authenticated)

```
GET /api/v1/tracks/{id}/stats
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "views": {
      "total": 100,
      "unique": 80,
      "last_7_days": 20,
      "last_30_days": 50
    },
    "likes": {
      "total": 30,
      "last_7_days": 5,
      "last_30_days": 15
    },
    "downloads": 25,
    "shares": 10
  }
}
```

## Artist Endpoints

### Get All Artists

```
GET /api/v1/artists
```

**Query Parameters:**
- `search` (string): Search by name
- `sort_by` (string): Field to sort by (default: name)
- `sort_direction` (string): Sort direction (asc/desc, default: asc)
- `per_page` (integer): Number of results per page (default: 15)

### Get Artist Details

```
GET /api/v1/artists/{id}
```

### Get Artist's Music

```
GET /api/v1/artists/{id}/music
```

### Get Artist's Albums

```
GET /api/v1/artists/{id}/albums
```

### Toggle Follow for an Artist (Authenticated)

```
POST /api/v1/artists/{id}/follow
```

**Response:**
```json
{
  "status": "success",
  "message": "Artist followed successfully",
  "data": {
    "followers_count": 1,
    "is_following": true
  }
}
```

### Check if User is Following an Artist (Authenticated)

```
GET /api/v1/artists/{id}/follow
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "is_following": true,
    "followers_count": 1
  }
}
```

### Toggle Notifications for an Artist (Authenticated)

```
POST /api/v1/artists/{id}/notifications
```

**Response:**
```json
{
  "status": "success",
  "message": "Notifications enabled successfully",
  "data": {
    "notifications_enabled": true
  }
}
```

### Get Artist's Followers (Authenticated)

```
GET /api/v1/artists/{id}/followers
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "artist_id": 1,
        "user_id": 1,
        "notifications_enabled": true,
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z",
        "user": {
          "id": 1,
          "name": "User Name",
          "profile_photo_url": "https://example.com/photo.jpg"
        }
      },
      ...
    ],
    "first_page_url": "...",
    "from": 1,
    "last_page": 1,
    "last_page_url": "...",
    "links": [...],
    "next_page_url": null,
    "path": "...",
    "per_page": 20,
    "prev_page_url": null,
    "to": 1,
    "total": 1
  }
}
```

### Get Followed Artists (Authenticated)

```
GET /api/v1/followed-artists
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "artist_id": 1,
        "user_id": 1,
        "notifications_enabled": true,
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z",
        "artist": {
          "id": 1,
          "name": "Artist Name",
          "slug": "artist-name",
          "bio": "Artist bio",
          "image_url": "https://example.com/image.jpg",
          "followers_count": 1,
          "total_plays": 100,
          "popularity_score": 75,
          "is_verified": true
        }
      },
      ...
    ],
    "first_page_url": "...",
    "from": 1,
    "last_page": 1,
    "last_page_url": "...",
    "links": [...],
    "next_page_url": null,
    "path": "...",
    "per_page": 20,
    "prev_page_url": null,
    "to": 1,
    "total": 1
  }
}
```

## Album Endpoints

### Get All Albums

```
GET /api/v1/albums
```

**Query Parameters:**
- `published` (boolean): Filter by published status
- `artist_id` (integer): Filter by artist
- `genre_id` (integer): Filter by genre
- `search` (string): Search by title
- `sort_by` (string): Field to sort by (default: created_at)
- `sort_direction` (string): Sort direction (asc/desc, default: desc)
- `per_page` (integer): Number of results per page (default: 15)

### Get Album Details

```
GET /api/v1/albums/{id}
```

## Playlist Endpoints (Authenticated)

### Get User's Playlists

```
GET /api/v1/playlists
```

### Create Playlist

```
POST /api/v1/playlists
```

**Request Body:**
```json
{
  "name": "Playlist Name",
  "description": "Playlist Description",
  "is_public": true,
  "image": "file", // Optional, multipart form data
  "tracks": [1, 2, 3] // Optional, array of track IDs
}
```

### Get Playlist Details

```
GET /api/v1/playlists/{id}
```

### Update Playlist

```
PUT /api/v1/playlists/{id}
```

### Delete Playlist

```
DELETE /api/v1/playlists/{id}
```

### Add Track to Playlist

```
POST /api/v1/playlists/{id}/tracks
```

**Request Body:**
```json
{
  "track_id": 1
}
```

### Remove Track from Playlist

```
DELETE /api/v1/playlists/{id}/tracks/{trackId}
```

### Reorder Tracks in Playlist

```
PUT /api/v1/playlists/{id}/tracks/reorder
```

**Request Body:**
```json
{
  "tracks": [3, 1, 2] // Array of track IDs in the desired order
}
```

## Favorites Endpoints (Authenticated)

### Get User's Favorites

```
GET /api/v1/favorites
```

**Query Parameters:**
- `type` (string): Filter by type (tracks, albums, artists, all)

### Add to Favorites

```
POST /api/v1/favorites
```

**Request Body:**
```json
{
  "favorable_id": 1,
  "favorable_type": "music" // "music", "album", or "artist"
}
```

### Remove from Favorites

```
DELETE /api/v1/favorites
```

**Request Body:**
```json
{
  "favorable_id": 1,
  "favorable_type": "music" // "music", "album", or "artist"
}
```

### Check if Item is in Favorites

```
GET /api/v1/favorites/check
```

**Query Parameters:**
- `favorable_id` (integer): ID of the item
- `favorable_type` (string): Type of the item (music, album, artist)

## User Profile Endpoints (Authenticated)

### Get User Profile

```
GET /api/v1/profile
```

### Update User Profile

```
PUT /api/v1/profile
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "bio": "User bio",
  "phone": "1234567890",
  "location": "City, Country",
  "social_links": {
    "twitter": "https://twitter.com/username",
    "instagram": "https://instagram.com/username"
  },
  "profile_photo": "file" // Optional, multipart form data
}
```

### Update Password

```
PUT /api/v1/password
```

**Request Body:**
```json
{
  "current_password": "current_password",
  "password": "new_password",
  "password_confirmation": "new_password"
}
```

## Error Responses

All API endpoints return a consistent error format:

```json
{
  "status": "error",
  "message": "Error message",
  "data": {
    "field": [
      "Validation error message"
    ]
  }
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Server Error
