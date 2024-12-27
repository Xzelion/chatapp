import { Message } from '@/lib/types';

export function sortMessagesByDate(messages: Message[]): Message[] {
  return [...messages].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
}

export function groupMessagesByDate(messages: Message[]): Record<string, Message[]> {
  return messages.reduce((groups, message) => {
    const date = new Date(message.created_at).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);
}

export function isSystemMessage(message: Message): boolean {
  return message.type === 'system';
}

export function isGifMessage(message: Message): boolean {
  return message.type === 'gif';
}

export function validateMessageContent(content: string, type: Message['type']): boolean {
  if (!content.trim()) return false;
  
  switch (type) {
    case 'text':
      return content.length <= 1000;
    case 'gif':
      return content.startsWith('http') && content.length <= 2000;
    case 'system':
      return content.length <= 200;
    default:
      return false;
  }
}