"use client";

import { useState, useEffect } from 'react';
import { UserStats } from '@/lib/types/profile';
import { getUserStats } from '@/lib/services/profile/stats';
import { useToast } from '@/components/ui/use-toast';

export function useUserStats(userId: string) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function loadStats() {
      if (!userId) return;

      try {
        setLoading(true);
        const userStats = await getUserStats(userId);
        setStats(userStats);
        setError(null);
      } catch (err) {
        setError(err as Error);
        toast({
          title: "Error",
          description: "Failed to load user stats. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [userId, toast]);

  return { stats, loading, error };
}