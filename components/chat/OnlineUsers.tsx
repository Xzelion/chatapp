"use client";

import { Users } from 'lucide-react';
import { ChatUser } from '@/lib/types';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface OnlineUsersProps {
  currentUserId: string;
  className?: string;
  users: ChatUser[];
}

export default function OnlineUsers({ 
  currentUserId, 
  className,
  users = []
}: OnlineUsersProps) {
  return (
    <div className={cn("w-64 border-r border-border bg-card/95 flex flex-col", className)}>
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-foreground">
          <Users className="h-5 w-5 text-primary" />
          Online Users ({users.length})
        </h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {users.map((user) => (
            <Link
              key={user.id}
              href={`/profile/${user.id}`}
              className="flex items-center gap-3 py-2 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              <div className="relative">
                <Avatar className="h-8 w-8">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.nickname}
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center text-sm font-medium">
                      {user.nickname[0].toUpperCase()}
                    </div>
                  )}
                </Avatar>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-background" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-foreground truncate">
                  {user.nickname}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(user.last_seen), { addSuffix: true })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}