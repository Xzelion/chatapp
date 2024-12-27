"use client";

import { cn } from '@/lib/utils';
import { FormattedSegment, parseMessageContent } from '@/lib/utils/formatting';
import { ChatUser } from '@/lib/types';

interface MessageContentProps {
  content: string;
  users?: ChatUser[];
  className?: string;
}

export default function MessageContent({
  content,
  users = [],
  className
}: MessageContentProps) {
  const segments = parseMessageContent(content, users);

  return (
    <span className={cn("break-words whitespace-pre-wrap", className)}>
      {segments.map((segment, index) => {
        switch (segment.type) {
          case 'mention':
            return (
              <a
                key={index}
                href={`/profile/${segment.metadata?.userId}`}
                className="text-primary hover:underline font-medium"
              >
                {segment.content}
              </a>
            );
          case 'url':
            return (
              <a
                key={index}
                href={segment.metadata?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {segment.content}
              </a>
            );
          default:
            return <span key={index}>{segment.content}</span>;
        }
      })}
    </span>
  );
}