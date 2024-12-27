"use client";

import { useState } from 'react';
import { Message } from '@/lib/types';
import { searchMessages } from '@/lib/services/search';
import { useToast } from '@/components/ui/use-toast';
import { useDebounce } from './useDebounce';

export function useMessageSearch() {
  const [results, setResults] = useState<Message[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [currentQuery, setCurrentQuery] = useState('');
  const { toast } = useToast();
  const limit = 20;

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setTotal(0);
      setOffset(0);
      setCurrentQuery('');
      return;
    }

    setLoading(true);
    try {
      const { messages, total } = await searchMessages({
        query,
        limit,
        offset: 0
      });
      setResults(messages);
      setTotal(total);
      setOffset(limit);
      setCurrentQuery(query);
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Failed to search messages. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!currentQuery || loading) return;

    setLoading(true);
    try {
      const { messages } = await searchMessages({
        query: currentQuery,
        limit,
        offset
      });
      setResults(prev => [...prev, ...messages]);
      setOffset(prev => prev + limit);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load more results. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    total,
    loading,
    hasMore: results.length < total,
    handleSearch: useDebounce(handleSearch, 300),
    loadMore
  };
}