import { ChatUser } from './types';

export interface UserProfile extends ChatUser {
  bio?: string;
  theme_preference?: 'light' | 'dark' | 'system';
  notification_settings?: {
    sounds: boolean;
    desktop: boolean;
  };
}

export interface ProfileUpdateData {
  nickname?: string;
  avatar_url?: string;
  bio?: string;
  theme_preference?: 'light' | 'dark' | 'system';
  notification_settings?: {
    sounds: boolean;
    desktop: boolean;
  };
}