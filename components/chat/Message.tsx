"use client";

import { Message as MessageType } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import MessageContent from './MessageContent';
import MessageReactions from './MessageReactions';

interface ChatMessageProps {
  message: MessageType;
  isCurrentUser: boolean;
}

export default function ChatMessage({ message, isCurrentUser }: ChatMessageProps) {
  const isSystem = message.type === 'system';
  const isGif = message.type === 'gif';
  const formattedDate = formatDistanceToNow(new Date(message.created_at), { addSuffix: true });

  if (isSystem) {
    return (
      <div className="flex flex-col items-center gap-1 my-3">
        <span className="text-sm px-3 py-1 rounded-full bg-muted/50 text-muted-foreground">
          {message.content}
        </span>
        <span className="text-xs text-muted-foreground">{formattedDate}</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "group flex items-start gap-2",
      isCurrentUser && "flex-row-reverse"
    )}>
      <Avatar className="h-8 w-8">
        <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center text-sm font-medium">
          {message.chat_users?.nickname?.[0]?.toUpperCase() || '?'}
        </div>
      </Avatar>
      
      <div className={cn("flex flex-col", isCurrentUser && "items-end")}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {message.chat_users?.nickname || 'Unknown'}
          </span>
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </div>
        
        <div className={cn(
          "mt-1 rounded-lg",
          isCurrentUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground",
          isGif ? "p-0 overflow-hidden" : "px-3 py-2"
        )}>
          {isGif ? (
            <img 
              src={message.content} 
              alt="GIF"
              className="max-w-[300px] w-full h-auto rounded"
              loading="lazy"
            />
          ) : (
            <MessageContent content={message.content} />
          )}
        </div>

        <MessageReactions
          messageId={message.id}
          userId={message.user_id}
        />
      </div>
    </div>
  );
}