"use client";

import { Button } from '@/components/ui/button';
import { Smile, Image } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import GifPicker from './GifPicker';
import EmojiPicker from './EmojiPicker';

interface MessageInputActionsProps {
  onGifSelect: (url: string) => void;
  onEmojiSelect: (emoji: string) => void;
  disabled?: boolean;
}

export default function MessageInputActions({
  onGifSelect,
  onEmojiSelect,
  disabled
}: MessageInputActionsProps) {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            disabled={disabled}
          >
            <Image className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <GifPicker onSelect={onGifSelect} />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            disabled={disabled}
          >
            <Smile className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <EmojiPicker onSelect={onEmojiSelect} />
        </PopoverContent>
      </Popover>
    </>
  );
}