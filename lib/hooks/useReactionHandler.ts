"use client";

import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { addReaction, removeReaction } from '@/lib/services/reactions';

export function useReactionHandler(messageId: string, userId: string) {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handleReaction = async (emoji: string, hasReacted: boolean) => {
    if (processing) return;

    setProcessing(true);
    try {
      if (hasReacted) {
        await removeReaction(messageId, userId, emoji);
      } else {
        await addReaction(messageId, userId, emoji);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reaction. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  return { processing, handleReaction };
}