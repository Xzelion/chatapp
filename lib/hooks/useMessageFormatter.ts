"use client";

import { useState, useEffect } from 'react';
import { FormattedSegment, parseMessageContent } from '@/lib/utils/formatting';
import { ChatUser } from '@/lib/types';

export function useMessageFormatter(content: string, users: ChatUser[]) {
  const [segments, setSegments] = useState<FormattedSegment[]>([{ 
    type: 'text', 
    content: content 
  }]);

  useEffect(() => {
    const formatted = parseMessageContent(content, users);
    setSegments(formatted);
  }, [content, users]);

  return segments;
}