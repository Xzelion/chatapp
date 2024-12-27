"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { ChatUser, Message } from './types';
import { fetchMessages, sendMessage } from './services/messages';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from './supabase';
import { getOnlineUsers, updatePresence } from './services/presence';

interface ChatContextType {
  messages: Message[];
  onlineUsers: ChatUser[];
  loading: boolean;
  error: Error | null;
  sendMessage: (content: string, type?: 'text' | 'gif') => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load initial messages and set up real-time subscription
  useEffect(() => {
    let mounted = true;
    let presenceInterval: NodeJS.Timeout;

    async function initialize() {
      try {
        // Load initial messages
        const { messages: initialMessages } = await fetchMessages();
        if (mounted) {
          setMessages(initialMessages);
        }

        // Load online users
        const users = await getOnlineUsers();
        if (mounted) {
          setOnlineUsers(users);
        }

        // Update presence for current user
        if (user) {
          await updatePresence(user.id);
          // Set up periodic presence updates
          presenceInterval = setInterval(() => {
            updatePresence(user.id).catch(console.error);
          }, 15000);
        }
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        if (mounted) {
          setError(error as Error);
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

    initialize();

    // Set up real-time subscriptions
    const messagesSubscription = supabase
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

    const presenceSubscription = supabase
      .channel('presence')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'presence' },
        async () => {
          const users = await getOnlineUsers();
          if (mounted) {
            setOnlineUsers(users);
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      if (presenceInterval) clearInterval(presenceInterval);
      messagesSubscription.unsubscribe();
      presenceSubscription.unsubscribe();
    };
  }, [toast, user]);

  const handleSendMessage = async (content: string, type: 'text' | 'gif' = 'text') => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to send messages",
        variant: "destructive"
      });
      return;
    }

    try {
      await sendMessage(content, user.id, type);
    } catch (error) {
      console.error('Send message error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <ChatContext.Provider value={{
      messages,
      onlineUsers,
      loading,
      error,
      sendMessage: handleSendMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}