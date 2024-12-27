"use client";

import { useState, useRef, useCallback } from 'react';
import { useMessageValidation } from './useMessageValidation';

interface UseMessageInputOptions {
  maxLength?: number;
  onSend: (content: string, type?: 'text' | 'gif') => Promise<void>;
}

export function useMessageInput({ maxLength = 1000, onSend }: UseMessageInputOptions) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isValid = useMessageValidation(message, 'text');

  const handleSend = useCallback(async () => {
    if (!isValid || sending) return;
    
    setSending(true);
    try {
      await onSend(message.trim(), 'text');
      setMessage('');
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }, [message, isValid, sending, onSend]);

  const handleGifSelect = useCallback(async (url: string) => {
    if (sending) return;
    setSending(true);
    try {
      await onSend(url, 'gif');
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }, [sending, onSend]);

  const handleEmojiSelect = useCallback((emoji: string) => {
    if (message.length + emoji.length <= maxLength) {
      setMessage(prev => prev + emoji);
      inputRef.current?.focus();
    }
  }, [message, maxLength]);

  return {
    message,
    setMessage,
    sending,
    isValid,
    inputRef,
    handleSend,
    handleGifSelect,
    handleEmojiSelect
  };
}