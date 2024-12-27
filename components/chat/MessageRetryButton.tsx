"use client";

import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface MessageRetryButtonProps {
  onRetry: () => void;
  disabled?: boolean;
}

export default function MessageRetryButton({
  onRetry,
  disabled
}: MessageRetryButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onRetry}
      disabled={disabled}
      className="h-6 px-2 text-xs text-destructive hover:text-destructive"
    >
      <RefreshCw className="h-3 w-3 mr-1" />
      Retry
    </Button>
  );
}