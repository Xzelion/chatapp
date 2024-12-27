"use client";

import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { searchEmojis, getDefaultEmojis, EmojiResult } from '@/lib/services/emoji';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDebounce } from '@/hooks/useDebounce';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export default function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [search, setSearch] = useState('');
  const [emojis, setEmojis] = useState<EmojiResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(searchEmojis, 300);

  useEffect(() => {
    const loadEmojis = async () => {
      setLoading(true);
      try {
        if (search.trim()) {
          const results = await debouncedSearch(search);
          setEmojis(results);
        } else {
          const defaults = await getDefaultEmojis();
          setEmojis(defaults);
        }
      } catch (error) {
        console.error('Error loading emojis:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEmojis();
  }, [search, debouncedSearch]);

  return (
    <div className="p-2 space-y-4">
      <Input
        type="text"
        placeholder="Search emojis..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full"
      />
      
      <ScrollArea className="h-[300px]">
        <div className="grid grid-cols-8 gap-1">
          {emojis.map((emoji) => (
            <button
              key={emoji.id}
              onClick={() => onSelect(emoji.native)}
              className="p-1 text-xl hover:bg-muted rounded"
            >
              {emoji.native}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}