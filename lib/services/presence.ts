import { supabase } from '../supabase';
import { ChatUser } from '../types';
import { retryOperation } from '../utils/retry';

const PRESENCE_TIMEOUT = 30000; // 30 seconds

export async function updatePresence(userId: string): Promise<void> {
  return retryOperation(async () => {
    const { error } = await supabase
      .from('presence')
      .upsert({
        user_id: userId,
        last_ping: new Date().toISOString()
      });

    if (error) throw error;
  });
}

export async function getOnlineUsers(): Promise<ChatUser[]> {
  return retryOperation(async () => {
    const cutoff = new Date(Date.now() - PRESENCE_TIMEOUT).toISOString();
    
    const { data, error } = await supabase
      .from('presence')
      .select(`
        chat_users (
          id,
          nickname,
          avatar_url,
          created_at,
          last_seen
        )
      `)
      .gt('last_ping', cutoff);

    if (error) throw error;
    return data?.map(p => p.chat_users).filter(Boolean) || [];
  });
}