"use client";

import { useCallback } from 'react';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { getMessageReactions } from '@/lib/services/reactions';

export function useReactionSubscription(
  messageId: string,
  onReactionsChange: (reactions: ReactionGroup[]) => void
) {
  const handleReactionChange = useCallback(async () => {
    const reactions = await getMessageReactions(messageId);
    onReactionsChange(reactions);
  }, [messageId, onReactionsChange]);

  useRealtimeSubscription(
    {
      table: 'message_reactions',
      event: '*',
      filter: `message_id=eq.${messageId}`
    },
    handleReactionChange
  );
}