import data from '@emoji-mart/data';

export interface EmojiResult {
  id: string;
  native: string;
  shortcode: string;
}

const FREQUENTLY_USED = ['👍', '❤️', '😊', '😂', '🎉', '👋', '🔥', '✨', '🙌', '👏'];

export async function getDefaultEmojis(): Promise<EmojiResult[]> {
  return FREQUENTLY_USED.map((emoji, index) => ({
    id: `frequent_${index}`,
    native: emoji,
    shortcode: `emoji_${index}`
  }));
}

export async function searchEmojis(query: string): Promise<EmojiResult[]> {
  if (!query.trim()) {
    return getDefaultEmojis();
  }

  try {
    const emojiMart = await import('emoji-mart');
    const results = await emojiMart.search(query, {
      data,
      maxResults: 24
    });
    
    return results.map((emoji: any) => ({
      id: emoji.id,
      native: emoji.native,
      shortcode: `:${emoji.id}:`
    }));
  } catch (error) {
    console.error('Error searching emojis:', error);
    return getDefaultEmojis();
  }
}