import { supabase } from '../supabase';
import { Message } from '../types';

export class MessageHandler {
  static async send(content: string, userId: string, type: 'text' | 'system' = 'text'): Promise<Message> {
    if (!content?.trim()) {
      throw new Error('Message content cannot be empty');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    const messageData = {
      content: content.trim(),
      user_id: userId,
      type,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select(`
        *,
        chat_users (
          id,
          nickname,
          avatar_url,
          is_guest
        )
      `)
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }

    return data;
  }

  static async fetch(limit = 50): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        chat_users (
          id,
          nickname,
          avatar_url,
          is_guest
        )
      `)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching messages:', error);
      throw new Error('Failed to fetch messages');
    }

    return data || [];
  }
}