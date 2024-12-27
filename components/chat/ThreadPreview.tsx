"use client";

import { Thread } from '@/lib/types/thread';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ThreadPreviewProps {
  thread: Thread;
}

export default function ThreadPreview({ thread }: ThreadPreviewProps) {
  const replyCount = thread.replies.length;
  if (replyCount === 0) return null;

  const lastReply = thread.replies[replyCount - 1];
  const uniqueParticipants = new Set(thread.replies.map(r => r.user_id)).size;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center gap-2 text-muted-foreground">
        <MessageCircle className="h-4 w-4" />
        <span className="text-xs">
          {replyCount} {replyCount === 1 ? 'reply' : 'replies'} ·{' '}
          {uniqueParticipants} {uniqueParticipants === 1 ? 'participant' : 'participants'}
        </span>
      </div>
      
      <div className="flex items-center gap-2 text-sm">
        <Avatar className="h-5 w-5">
          {lastReply.chat_users?.avatar_url ? (
            <img
              src={lastReply.chat_users.avatar_url}
              alt={lastReply.chat_users.nickname}
              className="h-full w-full object-cover rounded-full"
            />
          ) : (
            <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center text-xs font-medium">
              {lastReply.chat_users?.nickname[0].toUpperCase()}
            </div>
          )}
        </Avatar>
        <span className="font-medium">{lastReply.chat_users?.nickname}</span>
        <span className="text-muted-foreground">
          replied {formatDistanceToNow(new Date(lastReply.created_at), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}