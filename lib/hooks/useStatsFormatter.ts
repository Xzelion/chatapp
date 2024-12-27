"use client";

import { UserStats } from '@/lib/types/profile';
import { formatDistanceToNow } from 'date-fns';

export function useStatsFormatter(stats: UserStats) {
  const memberSince = new Date(stats.chat_users?.created_at || '');
  const daysSinceMember = Math.max(1, Math.floor(
    (Date.now() - memberSince.getTime()) / (1000 * 60 * 60 * 24)
  ));
  
  return {
    messagesPerDay: Math.round((stats.message_count / daysSinceMember) * 10) / 10,
    memberSince: formatDistanceToNow(memberSince, { addSuffix: true }),
    lastActive: formatDistanceToNow(new Date(stats.last_active), { addSuffix: true })
  };
}