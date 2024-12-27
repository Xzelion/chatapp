"use client";

import { useState, useEffect } from 'react';
import { ReactionGroup } from '@/lib/types/reactions';
import { getMessageReactions } from '@/lib/services/reactions';
import { supabase } from '@/lib/supabase';

export function useReactions(messageId: string, userId: string) {
  const [reactions, setReactions] = useState<ReactionGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadReactions() {
      try {
        const data = await getMessageReactions(messageId);
        if (mounted) {
          setReactions(data.map(group => ({
            ...group,
            hasReacted: group.users.includes(userId)
          })));
        }
      } catch (error) {
        console.error('Error loading reactions:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadReactions();

    // Subscribe to reaction changes
    const subscription = supabase
      .channel(`message:${messageId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions',
          filter: `message_id=eq.${messageId}`
        },
        () => {
          loadReactions();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [messageId, userId]);

  return { reactions, loading };
}