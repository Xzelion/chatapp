"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validateMessageLength } from '@/lib/utils/validation';
import MessageInputActions from './MessageInputActions';

interface MessageInputProps {
  onSendMessage: (content: string, type?: 'text' | 'gif') => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export default function MessageInput({
  onSendMessage,
  disabled,
  placeholder = "Type a message...",
  maxLength = 1000
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isValid = validateMessageLength(message, 'text');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || sending) return;

    setSending(true);
    try {
      await onSendMessage(message.trim());
      setMessage('');
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleGifSelect = async (url: string) => {
    if (sending) return;
    setSending(true);
    try {
      await onSendMessage(url, 'gif');
    } finally {
      setSending(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    if (message.length + emoji.length <= maxLength) {
      setMessage(prev => prev + emoji);
      inputRef.current?.focus();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <MessageInputActions
        onGifSelect={handleGifSelect}
        onEmojiSelect={handleEmojiSelect}
        disabled={disabled || sending}
      />

      <Input
        ref={inputRef}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        disabled={disabled || sending}
        maxLength={maxLength}
        className="flex-1"
      />

      <Button 
        type="submit" 
        disabled={disabled || sending || !isValid}
      >
        {sending ? 'Sending...' : 'Send'}
      </Button>
    </form>
  );
}