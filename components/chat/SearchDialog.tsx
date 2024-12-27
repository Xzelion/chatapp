"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Message } from '@/lib/types';
import { searchMessages, SearchResult } from '@/lib/services/search';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import { useToast } from '@/components/ui/use-toast';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: string;
}

export default function SearchDialog({
  open,
  onOpenChange,
  currentUserId
}: SearchDialogProps) {
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

  const handleLoadMore = async () => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Search Messages</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          <SearchBar onSearch={handleSearch} />
          
          <div className="flex-1 mt-4 overflow-hidden">
            <SearchResults
              results={results}
              total={total}
              loading={loading}
              hasMore={results.length < total}
              onLoadMore={handleLoadMore}
              currentUserId={currentUserId}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}