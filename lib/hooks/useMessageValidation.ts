"use client";

import { useMemo } from 'react';
import { validateMessageLength } from '@/lib/utils/validation';

export function useMessageValidation(content: string, maxLength: number = 1000) {
  return useMemo(() => {
    const trimmed = content.trim();
    return {
      isValid: validateMessageLength(trimmed, 'text'),
      remaining: maxLength - trimmed.length
    };
  }, [content, maxLength]);
}