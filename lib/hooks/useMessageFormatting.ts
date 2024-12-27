"use client";

import { useMemo } from 'react';
import { ChatUser } from '@/lib/types';
import { parseMessageContent } from '@/lib/utils/formatting';

export function useMessageFormatting(content: string, users: ChatUser[] = []) {
  return useMemo(() => {
    return parseMessageContent(content, users);
  }, [content, users]);
}