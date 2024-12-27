"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { UserStats } from '@/lib/types/profile';
import { supabase } from '@/lib/supabase';

interface StatsContextType {
  stats: Record<string, UserStats>;
  refreshStats: (userId: string) => Promise<void>;
}

const StatsContext = createContext<StatsContextType | null>(null);

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<Record<string, UserStats>>({});

  const refreshStats = async (userId: string) => {
    const { data } = await supabase
      .from('user_stats')
      .select(`
        message_count,
        mention_count,
        reaction_count,
        last_active,
        chat_users (
          nickname,
          avatar_url,
          created_at
        )
      `)
      .eq('user_id', userId)
      .single();

    if (data) {
      setStats(prev => ({
        ...prev,
        [userId]: data
      }));
    }
  };

  // Subscribe to stats changes
  useEffect(() => {
    const subscription = supabase
      .channel('user_stats_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_stats' },
        async (payload) => {
          if (payload.new?.user_id) {
            await refreshStats(payload.new.user_id);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <StatsContext.Provider value={{ stats, refreshStats }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
}