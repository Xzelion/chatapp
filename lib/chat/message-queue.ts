import { Message } from '../types';
import { retryOperation } from '../utils/retry';
import { supabase } from '../supabase';

interface QueuedMessage {
  id: string;
  content: string;
  type: 'text' | 'gif' | 'system';
  userId: string;
  retries: number;
}

export class MessageQueue {
  private static queue: QueuedMessage[] = [];
  private static readonly MAX_RETRIES = 3;

  static add(message: QueuedMessage) {
    this.queue.push(message);
  }

  static async retry(messageId: string): Promise<Message | null> {
    const message = this.queue.find(m => m.id === messageId);
    if (!message) return null;

    try {
      const result = await retryOperation(async () => {
        const { data, error } = await supabase
          .from('messages')
          .insert([{
            content: message.content,
            user_id: message.userId,
            type: message.type
          }])
          .select('*, chat_users(*)')
          .single();

        if (error) throw error;
        return data;
      });

      this.queue = this.queue.filter(m => m.id !== messageId);
      return result;
    } catch (error) {
      message.retries++;
      if (message.retries >= this.MAX_RETRIES) {
        this.queue = this.queue.filter(m => m.id !== messageId);
      }
      return null;
    }
  }

  static getQueue() {
    return [...this.queue];
  }
}