import { supabase } from '../supabase';
import { retryOperation } from '../utils/retry';
import { ReactionGroup } from '../types/reactions';

export async function addReaction(
  messageId: string,
  userId: string,
  emoji: string
): Promise<void> {
  return retryOperation(async () => {
    const { error } = await supabase
      .from('message_reactions')
      .insert([{
        message_id: messageId,
        user_id: userId,
        emoji
      }]);

    if (error) throw error;
  });
}

export async function removeReaction(
  messageId: string,
  userId: string,
  emoji: string
): Promise<void> {
  return retryOperation(async () => {
    const { error } = await supabase
      .from('message_reactions')
      .delete()
      .match({
        message_id: messageId,
        user_id: userId,
        emoji
      });

    if (error) throw error;
  });
}

export async function getMessageReactions(messageId: string): Promise<ReactionGroup[]> {
  return retryOperation(async () => {
    const { data, error } = await supabase
      .from('message_reactions')
      .select(`
        emoji,
        user_id,
        chat_users (
          nickname
        )
      `)
      .eq('message_id', messageId);

    if (error) throw error;

    // Group reactions by emoji
    const groups = data.reduce((acc: Record<string, ReactionGroup>, curr) => {
      if (!acc[curr.emoji]) {
        acc[curr.emoji] = {
          emoji: curr.emoji,
          count: 0,
          users: [],
          hasReacted: false
        };
      }
      acc[curr.emoji].count++;
      acc[curr.emoji].users.push(curr.user_id);
      return acc;
    }, {});

    return Object.values(groups);
  });
}