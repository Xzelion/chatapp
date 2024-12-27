"use client";

import { useRouter } from 'next/router';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import UserStatsComponent from '@/components/profile/UserStats';
import { useUserStats } from '@/hooks/useUserStats';

export default function UserProfile() {
  const router = useRouter();
  const { id } = router.query;
  const { stats, loading, error } = useUserStats(id as string);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">
          {error ? 'Failed to load profile' : 'User not found'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            {stats.chat_users?.avatar_url ? (
              <img
                src={stats.chat_users.avatar_url}
                alt={stats.chat_users.nickname}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-primary flex items-center justify-center text-2xl text-primary-foreground font-semibold">
                {stats.chat_users?.nickname[0].toUpperCase()}
              </div>
            )}
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{stats.chat_users?.nickname}</h1>
            <p className="text-muted-foreground">User Profile</p>
          </div>
        </div>

        <UserStatsComponent stats={stats} />
      </div>
    </div>
  );
}