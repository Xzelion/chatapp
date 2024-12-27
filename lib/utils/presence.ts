import { ChatUser } from '@/lib/types';

const PRESENCE_TIMEOUT = 60000; // 60 seconds

export function filterOnlineUsers(users: ChatUser[]): ChatUser[] {
  const cutoff = Date.now() - PRESENCE_TIMEOUT;
  return users.filter(user => {
    const lastSeen = new Date(user.last_seen).getTime();
    return lastSeen > cutoff;
  });
}

export function sortUsersByActivity(users: ChatUser[]): ChatUser[] {
  return [...users].sort((a, b) => {
    const aTime = new Date(a.last_seen).getTime();
    const bTime = new Date(b.last_seen).getTime();
    return bTime - aTime;
  });
}