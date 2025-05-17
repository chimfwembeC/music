<?php

namespace App\Enums;

enum ActivityType: string
{
    case PLAY = 'play';
    case DOWNLOAD = 'download';
    case SHARE = 'share';
    case SEARCH = 'search';
    case FAVORITE = 'favorite';
    case PLAYLIST_ADD = 'playlist_add';
    case PLAYLIST_CREATE = 'playlist_create';
    case COMMENT = 'comment';
    case REACTION = 'reaction';
    case LOGIN = 'login';
    case REGISTER = 'register';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
