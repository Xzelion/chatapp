"use client";

import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ThreadView from './ThreadView';
import { useState } from 'react';

interface MessageThreadProps {
  messageId: string;
  userId: string;
  replyCount: number;
}

export default function MessageThread({
  messageId,
  userId,
  replyCount
}: MessageThreadProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
        >
          <MessageCircle className="h-3 w-3 mr-1" />
          {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] p-0">
        <ThreadView
          messageId={messageId}
          userId={userId}
          onClose={() => setIsOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}