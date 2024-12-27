"use client";

import { ChatUser } from '@/lib/types';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

interface MessageMentionsProps {
  mentions: ChatUser[];
}

export default function MessageMentions({ mentions }: MessageMentionsProps) {
  if (mentions.length === 0) return null;

  return (
    <ScrollArea className="max-h-24">
      <div className="flex flex-wrap gap-1 mt-1">
        {mentions.map((user) => (
          <Link
            key={user.id}
            href={`/profile/${user.id}`}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            <Avatar className="h-4 w-4">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.nickname}
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center text-xs font-medium">
                  {user.nickname[0].toUpperCase()}
                </div>
              )}
            </Avatar>
            <span className="text-xs font-medium">@{user.nickname}</span>
          </Link>
        ))}
      </div>
    </ScrollArea>
  );
}