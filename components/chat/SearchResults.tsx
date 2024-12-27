"use client";

import { Message } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './Message';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SearchResultsProps {
  results: Message[];
  total: number;
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  currentUserId: string;
}

export default function SearchResults({
  results,
  total,
  loading,
  hasMore,
  onLoadMore,
  currentUserId
}: SearchResultsProps) {
  if (loading && results.length === 0) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!loading && results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground">No messages found</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <p className="text-sm text-muted-foreground">
          Found {total} message{total !== 1 ? 's' : ''}
        </p>
        
        <div className="space-y-4">
          {results.map(message => (
            <ChatMessage
              key={message.id}
              message={message}
              isCurrentUser={message.user_id === currentUserId}
              showThread={false}
            />
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={onLoadMore}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </Button>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}