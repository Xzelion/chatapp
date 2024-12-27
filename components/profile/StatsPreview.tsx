"use client";

import { UserStats } from '@/lib/types/profile';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Heart, AtSign } from 'lucide-react';

interface StatsPreviewProps {
  stats: UserStats;
}

export default function StatsPreview({ stats }: StatsPreviewProps) {
  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <span className="text-sm">{stats.message_count} messages</span>
        </div>
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-primary" />
          <span className="text-sm">{stats.reaction_count} reactions</span>
        </div>
        <div className="flex items-center gap-2">
          <AtSign className="h-4 w-4 text-primary" />
          <span className="text-sm">{stats.mention_count} mentions</span>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        Last active {formatDistanceToNow(new Date(stats.last_active), { addSuffix: true })}
      </div>
    </div>
  );
}