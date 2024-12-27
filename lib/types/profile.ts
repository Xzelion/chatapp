export interface UserStats {
  message_count: number;
  mention_count: number;
  reaction_count: number;
  last_active: string;
  chat_users?: {
    nickname: string;
    avatar_url?: string;
    created_at: string;
  };
}

export interface ProfileStats {
  messagesPerDay: number;
  totalReactions: number;
  totalMentions: number;
  memberSince: string;
  lastActive: string;
}