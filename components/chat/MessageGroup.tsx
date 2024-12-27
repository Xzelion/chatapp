"use client";

import { Message } from '@/lib/types';
import ChatMessage from './Message';
import { format } from 'date-fns';

interface MessageGroupProps {
  date: string;
  messages: Message[];
  currentUserId: string;
}

export default function MessageGroup({
  date,
  messages,
  currentUserId
}: MessageGroupProps) {
  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 flex justify-center">
        <span className="px-3 py-1 text-xs bg-muted/50 rounded-full text-muted-foreground">
          {format(new Date(date), 'MMMM d, yyyy')}
        </span>
      </div>
      
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          isCurrentUser={message.user_id === currentUserId}
        />
      ))}
    </div>
  );
}