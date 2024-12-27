"use client";

import { useState, useEffect } from 'react';
import { Thread } from '@/lib/types/thread';
import { getThread } from '@/lib/services/threads';
import { supabase } from '@/lib/supabase';

export function useThread(messageId: string) {
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadThread() {
      try {
        const threadData = await getThread(messageId);
        if (mounted) {
          setThread(threadData);
        }
      } catch (error) {
        console.error('Error loading thread:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadThread();

    // Subscribe to thread updates
    const subscription = supabase
      .channel(`thread:${messageId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `parent_id=eq.${messageId}`
        },
        () => {
          loadThread();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [messageId]);

  return { thread, loading };
}