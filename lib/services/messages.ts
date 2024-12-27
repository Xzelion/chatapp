import { supabase } from '../supabase';
import { Message } from '../types';
import { retryOperation } from '../utils/retry';

export async function fetchMessages(
  cursor?: string,
  limit = 50
): Promise<{ messages: Message[]; nextCursor?: string }> {
  return retryOperation(async () => {
    let query = supabase
      .from('messages')
      .select(`
        id,
        content,
        user_id,
        type,
        created_at,
        chat_users (
          id,
          nickname,
          avatar_url
        )
      `)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (cursor) {
      query = query.lt('created_at', cursor);
    }

    const { data, error } = await query;
    if (error) throw error;

    const messages = data || [];
    const nextCursor = messages.length === limit ? messages[messages.length - 1].created_at : undefined;

    return { messages, nextCursor };
  });
}

export async function sendMessage(
  content: string,
  userId: string,
  type: 'text' | 'gif' | 'system' = 'text'
): Promise<Message> {
  if (!content?.trim()) {
    throw new Error('Message content cannot be empty');
  }

  const messageData = {
    content: content.trim(),
    user_id: userId,
    type
  };

  const { data, error } = await supabase
    .from('messages')
    .insert([messageData])
    .select(`
      id,
      content,
      user_id,
      type,
      created_at,
      chat_users (
        id,
        nickname,
        avatar_url
      )
    `)
    .single();

  if (error) throw error;
  return data;
}