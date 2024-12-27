"use client";

import { useState, useEffect } from 'react';
import { Message } from '@/lib/types';
import { fetchMessages } from '@/lib/services/messages';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    async function loadMessages() {
      try {
        const { messages: initialMessages } = await fetchMessages();
        if (mounted) {
          setMessages(initialMessages);
        }
      } catch (err) {
        console.error('Failed to load messages:', err);
        if (mounted) {
          setError(err as Error);
          toast({
            title: "Error",
            description: "Failed to load messages. Please refresh the page.",
            variant: "destructive"
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
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

          if (messageData && mounted) {
            setMessages(prev => [...prev, messageData]);
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  return { messages, loading, error };
}