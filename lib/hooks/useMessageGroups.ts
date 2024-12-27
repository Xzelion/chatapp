"use client";

import { useMemo } from 'react';
import { Message } from '@/lib/types';
import { groupMessagesByDate } from '@/lib/utils/message';

export function useMessageGroups(messages: Message[]) {
  return useMemo(() => {
    return groupMessagesByDate(messages);
  }, [messages]);
}