import { supabase } from '../supabase';
import { Message } from '../types';
import { retryOperation } from '../utils/retry';

export interface SearchOptions {
  query: string;
  userId?: string;
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  messages: Message[];
  total: number;
}

export async function searchMessages({
  query,
  userId,
  limit = 20,
  offset = 0
}: SearchOptions): Promise<SearchResult> {
  return retryOperation(async () => {
    let queryBuilder = supabase
      .from('messages')
      .select(`
        *,
        chat_users (
          id,
          nickname,
          avatar_url
        )
      `, { count: 'exact' })
      .textSearch('content', query)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (userId) {
      queryBuilder = queryBuilder.eq('user_id', userId);
    }

    const { data, count, error } = await queryBuilder;

    if (error) throw error;

    return {
      messages: data || [],
      total: count || 0
    };
  });
}