import { ReactionGroup } from '@/lib/types/reactions';

export function sortReactionsByCount(reactions: ReactionGroup[]): ReactionGroup[] {
  return [...reactions].sort((a, b) => b.count - a.count);
}

export function hasUserReacted(reaction: ReactionGroup, userId: string): boolean {
  return reaction.users.includes(userId);
}

export function getReactionStats(reactions: ReactionGroup[]): {
  total: number;
  unique: number;
} {
  return {
    total: reactions.reduce((sum, r) => sum + r.count, 0),
    unique: reactions.length
  };
}