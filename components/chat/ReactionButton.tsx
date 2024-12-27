"use client";

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ReactionButtonProps {
  emoji: string;
  count: number;
  hasReacted: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function ReactionButton({
  emoji,
  count,
  hasReacted,
  onClick,
  disabled
}: ReactionButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-2 py-1 h-auto text-xs hover:bg-muted transition-colors",
        hasReacted && "bg-primary/10"
      )}
    >
      <span className="mr-1">{emoji}</span>
      <span>{count}</span>
    </Button>
  );
}