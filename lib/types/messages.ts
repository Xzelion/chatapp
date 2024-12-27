import { ChatUser } from './types';

export type MessageType = 'text' | 'system' | 'gif';

export interface Message {
  id: string;
  content: string;
  user_id: string;
  type: MessageType;
  created_at: string;
  parent_id?: string | null;
  reply_count?: number;
  chat_users?: ChatUser;
  status?: 'sending' | 'sent' | 'error';
}

export interface MessageContent {
  text: string;
  gif?: {
    url: string;
    preview: string;
  };
}

export function validateMessage(content: string, type: MessageType): boolean {
  switch (type) {
    case 'text':
      return content.trim().length > 0 && content.length <= 1000;
    case 'gif':
      return content.startsWith('http') && content.length <= 2000;
    case 'system':
      return content.length <= 200;
    default:
      return false;
  }
}