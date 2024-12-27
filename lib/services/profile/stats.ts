import { supabase } from '@/lib/supabase';
import { UserStats } from '@/lib/types/profile';
import { retryOperation } from '@/lib/utils/retry';

export async function getUserStats(userId: string): Promise<UserStats | null> {
  if (!userId) return null;

  return retryOperation(async () => {
    const { data, error } = await supabase
      .from('user_stats')
      .select(`
        message_count,
        mention_count,
        reaction_count,
        last_active,
        chat_users!inner (
          nickname,
          avatar_url,
          created_at
        )
      `)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  });
}