export function validateMessageLength(content: string, type: 'text' | 'gif' | 'system'): boolean {
  const trimmed = content.trim();
  switch (type) {
    case 'text':
      return trimmed.length > 0 && trimmed.length <= 1000;
    case 'gif':
      return trimmed.length <= 2000;
    case 'system':
      return trimmed.length <= 200;
    default:
      return false;
  }
}