"use client";

import { useState, useEffect } from 'react';
import { Thread } from '@/lib/types/thread';
import { getThread, replyToMessage } from '@/lib/services/threads';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import Message from './Message';
import MessageInput from './MessageInput';
import { useToast } from '@/components/ui/use-toast';

interface ThreadViewProps {
  messageId: string;
  userId: string;
  onClose: () => void;
}

export default function ThreadView({
  messageId,
  userId,
  onClose
}: ThreadViewProps) {
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadThread();
  }, [messageId]);

  const loadThread = async () => {
    try {
      const threadData = await getThread(messageId);
      setThread(threadData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load thread. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (content: string, type: 'text' | 'gif' = 'text') => {
    try {
      const reply = await replyToMessage(content, userId, messageId, type);
      setThread(prev => prev ? {
        ...prev,
        replies: [...prev.replies, reply]
      } : null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="p-4">Loading thread...</div>;
  }

  if (!thread) {
    return <div className="p-4">Thread not found</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Thread</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <Message
            message={thread.parent_message}
            isCurrentUser={thread.parent_message.user_id === userId}
          />

          <div className="pl-8 space-y-4">
            {thread.replies.map(reply => (
              <Message
                key={reply.id}
                message={reply}
                isCurrentUser={reply.user_id === userId}
              />
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <MessageInput
          onSendMessage={handleReply}
          placeholder="Reply to thread..."
        />
      </div>
    </div>
  );
}