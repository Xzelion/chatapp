"use client";

import { Button } from '@/components/ui/button';
import { Search, MessageSquare, Users } from 'lucide-react';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';

interface MessageListHeaderProps {
  onSearchClick: () => void;
  onlineCount: number;
  onShowUsers?: () => void;
}

export default function MessageListHeader({
  onSearchClick,
  onlineCount,
  onShowUsers
}: MessageListHeaderProps) {
  return (
    <div className="p-4 border-b border-border bg-card/95">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold text-foreground">Main Chat Room</h1>
          <span className="text-sm text-muted-foreground">
            ({onlineCount} online)
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSearchClick}
          >
            <Search className="h-5 w-5" />
          </Button>

          {onShowUsers && (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={onShowUsers}
                >
                  <Users className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
          )}
        </div>
      </div>
    </div>
  );
}