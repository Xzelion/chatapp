"use client";

import { useEffect, useRef } from 'react';
import { Message } from '@/lib/types';
import ChatMessage from './Message';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  loading?: boolean;
  className?: string;
}

export default function MessageList({
  messages,
  currentUserId,
  loading = false,
  className
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("flex-1 overflow-y-auto p-4 space-y-4", className)}
    >
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          isCurrentUser={message.user_id === currentUserId}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}