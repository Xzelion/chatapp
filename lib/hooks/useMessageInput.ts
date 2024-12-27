"use client";

import { useState, useRef } from 'react';
import { useMessageValidation } from './useMessageValidation';

type SendMessageFunction = (content: string, type?: 'text' | 'gif') => Promise<void>;

export function useMessageInput(onSendMessage: SendMessageFunction) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isValid = useMessageValidation(message, 'text');

  const handleGifSelect = async (url: string) => {
    if (sending) return;
    setSending(true);
    try {
      await onSendMessage(url, 'gif');
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    inputRef.current?.focus();
  };

  return {
    message,
    setMessage,
    inputRef,
    sending,
    isValid,
    handleGifSelect,
    handleEmojiSelect
  };
}