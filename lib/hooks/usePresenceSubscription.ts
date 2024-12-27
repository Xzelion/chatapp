"use client";

import { useCallback } from 'react';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { getOnlineUsers } from '@/lib/services/presence';

export function usePresenceSubscription(
  onPresenceChange: (users: ChatUser[]) => void
) {
  const handlePresenceChange = useCallback(async () => {
    const users = await getOnlineUsers();
    onPresenceChange(users);
  }, [onPresenceChange]);

  useRealtimeSubscription(
    { table: 'presence', event: '*' },
    handlePresenceChange
  );
}