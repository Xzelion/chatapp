import { supabase } from '../supabase';
import { ChatUser } from '../types';
import { retryOperation } from '../utils/retry';

const PRESENCE_TIMEOUT = 60000; // 60 seconds
const CLEANUP_INTERVAL = 30000; // 30 seconds

export async function setupPresence(
  user: ChatUser,
  onSync: (users: ChatUser[]) => void,
  onJoin?: (user: ChatUser) => void,
  onLeave?: (user: ChatUser) => void
) {
  // Create presence channel with user info
  const channel = supabase.channel(`presence:${user.id}`, {
    config: {
      presence: {
        key: user.id,
      },
    },
  });

  // Update user's last_seen timestamp
  const updatePresence = async () => {
    try {
      await retryOperation(() => 
        supabase
          .from('chat_users')
          .update({ last_seen: new Date().toISOString() })
          .eq('id', user.id)
      );
    } catch (error) {
      console.error('Failed to update presence:', error);
    }
  };

  // Set up presence handlers
  channel
    .on('presence', { event: 'sync' }, async () => {
      const state = channel.presenceState<ChatUser>();
      const presenceList = Object.values(state).flat();
      
      // Fetch all users who were active in the last minute
      const { data: activeUsers } = await supabase
        .from('chat_users')
        .select('*')
        .gt('last_seen', new Date(Date.now() - PRESENCE_TIMEOUT).toISOString());

      const onlineUsers = activeUsers || [];
      onSync(onlineUsers);
    })
    .on('presence', { event: 'join' }, ({ newPresences }) => {
      if (newPresences?.[0] && onJoin) {
        onJoin(newPresences[0]);
      }
    })
    .on('presence', { event: 'leave' }, ({ leftPresences }) => {
      if (leftPresences?.[0] && onLeave) {
        onLeave(leftPresences[0]);
      }
    });

  // Subscribe and track presence
  const status = await channel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track({
        id: user.id,
        nickname: user.nickname,
        online_at: new Date().toISOString(),
      });
      await updatePresence();
    }
  });

  // Set up periodic presence updates
  const presenceInterval = setInterval(updatePresence, CLEANUP_INTERVAL);

  // Clean up function
  return {
    unsubscribe: () => {
      clearInterval(presenceInterval);
      channel.unsubscribe();
    }
  };
}