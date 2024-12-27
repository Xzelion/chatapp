import { supabase } from '../supabase';
import { Message } from '../types';
import { retryOperation } from '../utils/retry';
import { validateMessage } from '../types/messages';

export async function fetchMessages(limit = 50): Promise<Message[]> {
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
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  });
}

export async function sendMessage(
  content: string,
  userId: string,
  type: 'text' | 'system' | 'gif' = 'text'
): Promise<Message> {
  // Validate message content
  if (!validateMessage(content, type)) {
    throw new Error('Invalid message content');
  }

  const messageData = {
    content: content.trim(),
    user_id: userId,
    type,
    created_at: new Date().toISOString()
  };

  return retryOperation(async () => {
    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select(`
        *,
        chat_users (
          id,
          nickname,
          is_guest
        )
      `)
      .single();

    if (error) throw error;
    return data;
  });
}