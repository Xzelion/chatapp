import { format, formatDistanceToNow } from 'date-fns';

export function formatMessageDate(date: string | Date): string {
  const messageDate = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (messageDate.toDateString() === today.toDateString()) {
    return 'Today';
  }

  if (messageDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return format(messageDate, 'MMMM d, yyyy');
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatTime(date: string | Date): string {
  return format(new Date(date), 'h:mm a');
}