"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Smile } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { addReaction, removeReaction } from '@/lib/services/reactions';
import { useToast } from '@/components/ui/use-toast';
import { useReactions } from '@/hooks/useReactions';

const QUICK_REACTIONS = ['👍', '❤️', '😊', '😂', '🎉', '👋'];

interface MessageReactionsProps {
  messageId: string;
  userId: string;
}

export default function MessageReactions({
  messageId,
  userId
}: MessageReactionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { reactions, loading } = useReactions(messageId, userId);
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

  if (loading) return null;

  return (
    <div className="flex items-center gap-1">
      {reactions.map(reaction => (
        <Button
          key={reaction.emoji}
          variant="ghost"
          size="sm"
          onClick={() => handleReaction(reaction.emoji, reaction.hasReacted)}
          disabled={processing}
          className={cn(
            "px-2 py-1 h-auto text-xs hover:bg-muted transition-colors",
            reaction.hasReacted && "bg-primary/10"
          )}
        >
          <span className="mr-1">{reaction.emoji}</span>
          <span>{reaction.count}</span>
        </Button>
      ))}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Smile className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-2" align="start">
          <div className="grid grid-cols-6 gap-1">
            {QUICK_REACTIONS.map(emoji => (
              <button
                key={emoji}
                onClick={() => {
                  const existing = reactions.find(r => r.emoji === emoji);
                  handleReaction(emoji, existing?.hasReacted || false);
                  setIsOpen(false);
                }}
                className="p-2 hover:bg-muted rounded text-lg"
                disabled={processing}
              >
                {emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}