"use client";

import { UserStats } from '@/lib/types/profile';
import { Card } from '@/components/ui/card';
import { MessageSquare, Heart, AtSign, Calendar, Clock } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface UserStatsProps {
  stats: UserStats;
}

export default function UserStats({ stats }: UserStatsProps) {
  const memberSince = new Date(stats.chat_users?.created_at || '');
  const daysSinceMember = Math.max(1, Math.floor(
    (Date.now() - memberSince.getTime()) / (1000 * 60 * 60 * 24)
  ));
  const messagesPerDay = Math.round((stats.message_count / daysSinceMember) * 10) / 10;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-2 text-primary">
          <MessageSquare className="h-4 w-4" />
          <h3 className="font-medium">Messages</h3>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold">{stats.message_count}</p>
          <p className="text-sm text-muted-foreground">
            ~{messagesPerDay} messages per day
          </p>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 text-primary">
          <Heart className="h-4 w-4" />
          <h3 className="font-medium">Reactions</h3>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold">{stats.reaction_count}</p>
          <p className="text-sm text-muted-foreground">
            Total reactions received
          </p>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 text-primary">
          <AtSign className="h-4 w-4" />
          <h3 className="font-medium">Mentions</h3>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold">{stats.mention_count}</p>
          <p className="text-sm text-muted-foreground">
            Times mentioned by others
          </p>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 text-primary">
          <Calendar className="h-4 w-4" />
          <h3 className="font-medium">Member Since</h3>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold">
            {format(memberSince, 'MMM d, yyyy')}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(memberSince, { addSuffix: true })}
          </p>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 text-primary">
          <Clock className="h-4 w-4" />
          <h3 className="font-medium">Last Active</h3>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold">
            {formatDistanceToNow(new Date(stats.last_active), { addSuffix: true })}
          </p>
        </div>
      </Card>
    </div>
  );
}