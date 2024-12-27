"use client";

import { useState, useCallback } from 'react';

export type MessageStatus = 'sending' | 'sent' | 'error';

export function useMessageStatus() {
  const [messageStatus, setMessageStatus] = useState<Record<string, MessageStatus>>({});

  const updateStatus = useCallback((messageId: string, status: MessageStatus) => {
    setMessageStatus(prev => ({
      ...prev,
      [messageId]: status
    }));
  }, []);

  const clearStatus = useCallback((messageId: string) => {
    setMessageStatus(prev => {
      const { [messageId]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  return {
    messageStatus,
    updateStatus,
    clearStatus
  };
}