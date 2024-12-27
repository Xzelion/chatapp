import { supabase } from '../supabase';
import { Message } from '../types';
import { retryOperation } from '../utils/retry';

const SUBSCRIPTION_TIMEOUT = 10000;
const RETRY_DELAY = 1000;

export function subscribeToMessages(callback: (message: Message) => void) {
  let retryCount = 0;
  let timeoutId: NodeJS.Timeout;
  
  function resetTimeout() {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(reconnect, SUBSCRIPTION_TIMEOUT);
  }

  function reconnect() {
    channel.unsubscribe();
    if (retryCount < 3) {
      retryCount++;
      setTimeout(setupSubscription, RETRY_DELAY * retryCount);
    }
  }

  function setupSubscription() {
    const channel = supabase.channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          if (!payload.new) return;
          resetTimeout();
          
          try {
            const message = await fetchMessageDetails(payload.new.id);
            if (message) callback(message);
          } catch (error) {
            console.error('Error fetching message details:', error);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          retryCount = 0;
          resetTimeout();
        }
      });

    return channel;
  }

  const channel = setupSubscription();
  
  return () => {
    if (timeoutId) clearTimeout(timeoutId);
    channel.unsubscribe();
  };
}

async function fetchMessageDetails(messageId: string): Promise<Message | null> {
  return retryOperation(async () => {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        chat_users (
          id,
          nickname,
          is_guest
        )
      `)
      .eq('id', messageId)
      .single();
      
    if (error) throw error;
    return data;
  });
}