"use client";

import { useState, useEffect } from 'react';
import { ChatUser } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';

interface MentionListProps {
  users: ChatUser[];
  searchTerm: string;
  onSelect: (user: ChatUser) => void;
  className?: string;
}

export default function MentionList({
  users,
  searchTerm,
  onSelect,
  className
}: MentionListProps) {
  const [filteredUsers, setFilteredUsers] = useState<ChatUser[]>([]);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  if (!searchTerm || filteredUsers.length === 0) return null;

  return (
    <ScrollArea className={className}>
      <div className="p-1">
        {filteredUsers.map(user => (
          <button
            key={user.id}
            onClick={() => onSelect(user)}
            className="w-full flex items-center gap-2 p-2 hover:bg-muted rounded-md"
          >
            <Avatar className="h-6 w-6">
              <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center text-xs font-medium">
                {user.nickname[0].toUpperCase()}
              </div>
            </Avatar>
            <span className="text-sm font-medium">{user.nickname}</span>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}