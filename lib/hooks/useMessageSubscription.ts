"use client";

import { useCallback } from 'react';
import { Message } from '@/lib/types';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { supabase } from '@/lib/supabase';

export function useMessageSubscription(onNewMessage: (message: Message) => void) {
  const handleNewMessage = useCallback(async (payload: any) => {
    const newMessage = payload.new as Message;
    
    // Fetch full message data including user info
    const { data: messageData } = await supabase
      .from('messages')
      .select(`
        *,
        chat_users (
          id,
          nickname,
          avatar_url
        )
      `)
      .eq('id', newMessage.id)
      .single();

    if (messageData) {
      onNewMessage(messageData);
    }
  }, [onNewMessage]);

  useRealtimeSubscription(
    { table: 'messages', event: 'INSERT' },
    handleNewMessage
  );
}