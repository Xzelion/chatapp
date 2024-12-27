"use client";

import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { sendMessage } from '@/lib/services/messages';

export function useMessageActions(userId: string) {
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (content: string, type: 'text' | 'gif' = 'text') => {
    if (!content.trim() || sending) return;

    setSending(true);
    try {
      await sendMessage(content.trim(), userId, type);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  return {
    sending,
    sendMessage: handleSendMessage
  };
}