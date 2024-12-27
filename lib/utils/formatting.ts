import { ChatUser } from '../types';

export interface FormattedSegment {
  type: 'text' | 'mention' | 'url';
  content: string;
  metadata?: {
    userId?: string;
    url?: string;
  };
}

const URL_REGEX = /(https?:\/\/[^\s]+)/g;
const MENTION_REGEX = /@(\w+)/g;

export function parseMessageContent(
  content: string,
  users: ChatUser[] = []
): FormattedSegment[] {
  if (!content) {
    return [{ type: 'text', content: '' }];
  }

  const segments: FormattedSegment[] = [];
  let lastIndex = 0;

  // Find URLs
  content.replace(URL_REGEX, (match, url, index) => {
    if (index > lastIndex) {
      segments.push({
        type: 'text',
        content: content.slice(lastIndex, index)
      });
    }
    segments.push({
      type: 'url',
      content: url,
      metadata: { url }
    });
    lastIndex = index + match.length;
    return match;
  });

  // Add remaining text
  if (lastIndex < content.length) {
    segments.push({
      type: 'text',
      content: content.slice(lastIndex)
    });
  }

  return segments.length > 0 ? segments : [{ type: 'text', content }];
}