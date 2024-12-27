"use client";

import { useState, useEffect } from 'react';
import { ChatUser } from '@/lib/types';
import { updatePresence, getOnlineUsers } from '@/lib/services/presence';
import { supabase } from '@/lib/supabase';

export function usePresence(userId?: string) {
  const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>([]);

  useEffect(() => {
    if (!userId) return;

    let mounted = true;
    let interval: NodeJS.Timeout;

    async function loadOnlineUsers() {
      try {
        const users = await getOnlineUsers();
        if (mounted) {
          setOnlineUsers(users);
        }
      } catch (error) {
        console.error('Error loading online users:', error);
      }
    }

    async function updateUserPresence() {
      try {
        await updatePresence(userId);
      } catch (error) {
        console.error('Error updating presence:', error);
      }
    }

    // Initial load and setup
    loadOnlineUsers();
    updateUserPresence();

    // Set up periodic presence updates
    interval = setInterval(() => {
      updateUserPresence();
      loadOnlineUsers();
    }, 15000); // Every 15 seconds

    // Subscribe to presence changes
    const subscription = supabase
      .channel('presence_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'presence' 
        },
        () => {
          loadOnlineUsers();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      clearInterval(interval);
      subscription.unsubscribe();
    };
  }, [userId]);

  return onlineUsers;
}