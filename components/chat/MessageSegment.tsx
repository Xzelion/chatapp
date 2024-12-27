"use client";

import { FormattedSegment } from '@/lib/utils/formatting';
import Link from 'next/link';

interface MessageSegmentProps {
  segment: FormattedSegment;
}

export default function MessageSegment({ segment }: MessageSegmentProps) {
  switch (segment.type) {
    case 'mention':
      return (
        <Link
          href={`/profile/${segment.metadata?.userId}`}
          className="text-primary hover:underline font-medium"
        >
          {segment.content}
        </Link>
      );
    case 'url':
      return (
        <a
          href={segment.metadata?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {segment.content}
        </a>
      );
    default:
      return <span>{segment.content}</span>;
  }
}