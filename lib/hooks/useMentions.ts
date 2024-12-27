"use client";

import { useState, useEffect } from 'react';
import { ChatUser } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export function useMentions(messageId: string) {
  const [mentions, setMentions] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadMentions() {
      try {
        const { data, error } = await supabase
          .from('user_mentions')
          .select(`
            mentioned_user_id,
            chat_users!inner (
              id,
              nickname,
              avatar_url
            )
          `)
          .eq('message_id', messageId);

        if (error) throw error;
        if (mounted) {
          setMentions(data.map(m => m.chat_users));
        }
      } catch (error) {
        console.error('Error loading mentions:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadMentions();

    return () => {
      mounted = false;
    };
  }, [messageId]);

  return { mentions, loading };
}