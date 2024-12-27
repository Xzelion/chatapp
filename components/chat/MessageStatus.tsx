"use client";

import { MessageStatus } from '@/lib/hooks/useMessageStatus';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageStatusIndicatorProps {
  status: MessageStatus;
  className?: string;
}

export default function MessageStatusIndicator({
  status,
  className
}: MessageStatusIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-1 text-xs", className)}>
      {status === 'sending' && (
        <>
          <Clock className="h-3 w-3 text-muted-foreground animate-pulse" />
          <span className="text-muted-foreground">Sending...</span>
        </>
      )}
      {status === 'sent' && (
        <Check className="h-3 w-3 text-green-500" />
      )}
      {status === 'error' && (
        <>
          <AlertCircle className="h-3 w-3 text-destructive" />
          <span className="text-destructive">Failed to send</span>
        </>
      )}
    </div>
  );
}