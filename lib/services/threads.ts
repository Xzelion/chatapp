import { supabase } from '../supabase';
import { Thread, ThreadMessage } from '../types/thread';
import { retryOperation } from '../utils/retry';

export async function getThread(messageId: string): Promise<Thread | null> {
  return retryOperation(async () => {
    const [parentResult, repliesResult] = await Promise.all([
      supabase
        .from('messages')
        .select(`
          *,
          chat_users (
            id,
            nickname,
            avatar_url
          )
        `)
        .eq('id', messageId)
        .single(),
      
      supabase
        .from('messages')
        .select(`
          *,
          chat_users (
            id,
            nickname,
            avatar_url
          )
        `)
        .eq('parent_id', messageId)
        .order('created_at', { ascending: true })
    ]);

    if (parentResult.error || !parentResult.data) throw parentResult.error;

    const participants = new Set();
    participants.add(parentResult.data.chat_users);
    repliesResult.data?.forEach(reply => participants.add(reply.chat_users));

    return {
      id: messageId,
      parent_message: parentResult.data,
      replies: repliesResult.data || [],
      participants: Array.from(participants)
    };
  });
}

export async function replyToMessage(
  content: string,
  userId: string,
  parentId: string,
  type: 'text' | 'gif' = 'text'
): Promise<ThreadMessage> {
  return retryOperation(async () => {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        content,
        user_id: userId,
        parent_id: parentId,
        type
      }])
      .select(`
        *,
        chat_users (
          id,
          nickname,
          avatar_url
        )
      `)
      .single();

    if (error) throw error;
    return data;
  });
}