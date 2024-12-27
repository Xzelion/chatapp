"use client";

import { useState, useCallback } from 'react';
import { Message } from '@/lib/types';
import { sendMessage } from '@/lib/services/messages';
import { useToast } from '@/components/ui/use-toast';

interface QueuedMessage {
  id: string;
  content: string;
  type: 'text' | 'gif' | 'system';
  retries: number;
}

const MAX_RETRIES = 3;

export function useMessageQueue() {
  const [queue, setQueue] = useState<QueuedMessage[]>([]);
  const { toast } = useToast();

  const addToQueue = useCallback((message: Omit<QueuedMessage, 'retries'>) => {
    setQueue(prev => [...prev, { ...message, retries: 0 }]);
  }, []);

  const retryMessage = useCallback(async (messageId: string, userId: string) => {
    const message = queue.find(m => m.id === messageId);
    if (!message) return;

    try {
      const result = await sendMessage(message.content, userId, message.type);
      setQueue(prev => prev.filter(m => m.id !== messageId));
      return result;
    } catch (error) {
      message.retries++;
      if (message.retries >= MAX_RETRIES) {
        setQueue(prev => prev.filter(m => m.id !== messageId));
        toast({
          title: "Message Failed",
          description: "The message could not be sent after multiple attempts.",
          variant: "destructive"
        });
      }
      return null;
    }
  }, [queue, toast]);

  return {
    queue,
    addToQueue,
    retryMessage
  };
}