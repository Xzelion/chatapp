"use client";

import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { searchGifs, getTrendingGifs, GifResult } from '@/lib/services/tenor';
import { useDebounce } from '@/hooks/useDebounce';
import { Loader2 } from 'lucide-react';

interface GifPickerProps {
  onSelect: (url: string) => void;
}

export default function GifPicker({ onSelect }: GifPickerProps) {
  const [search, setSearch] = useState('');
  const [gifs, setGifs] = useState<GifResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(searchGifs, 300);

  useEffect(() => {
    const loadGifs = async () => {
      setLoading(true);
      try {
        if (search.trim()) {
          const results = await debouncedSearch(search);
          setGifs(results);
        } else {
          const trending = await getTrendingGifs();
          setGifs(trending);
        }
      } catch (error) {
        console.error('Error loading GIFs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGifs();
  }, [search, debouncedSearch]);

  return (
    <div className="p-2 space-y-4">
      <Input
        type="text"
        placeholder="Search GIFs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full"
      />
      
      <ScrollArea className="h-[300px]">
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {gifs.map((gif) => (
              <button
                key={gif.id}
                onClick={() => onSelect(gif.url)}
                className="relative aspect-video overflow-hidden rounded hover:ring-2 hover:ring-primary"
              >
                <img
                  src={gif.preview}
                  alt={gif.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}