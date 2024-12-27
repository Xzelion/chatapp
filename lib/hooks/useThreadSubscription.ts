"use client";

import { useCallback } from 'react';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { getThread } from '@/lib/services/threads';

export function useThreadSubscription(
  messageId: string,
  onThreadUpdate: (thread: Thread) => void
) {
  const handleThreadUpdate = useCallback(async () => {
    const thread = await getThread(messageId);
    if (thread) {
      onThreadUpdate(thread);
    }
  }, [messageId, onThreadUpdate]);

  useRealtimeSubscription(
    {
      table: 'messages',
      event: '*',
      filter: `parent_id=eq.${messageId}`
    },
    handleThreadUpdate
  );
}