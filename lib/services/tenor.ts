import { fetchWithRetry } from './api';

const TENOR_API_KEY = 'AIzaSyCsLgIrIqz191XPtBCrjR8JKHP9c8DlKWk';
const TENOR_API_URL = 'https://tenor.googleapis.com/v2';

export interface GifResult {
  id: string;
  title: string;
  url: string;
  preview: string;
}

export async function getTrendingGifs(limit = 20): Promise<GifResult[]> {
  try {
    const data = await fetchWithRetry<any>(
      `${TENOR_API_URL}/featured?key=${TENOR_API_KEY}&limit=${limit}&media_filter=minimal`
    );
    
    return data.results.map((result: any) => ({
      id: result.id,
      title: result.title,
      url: result.media_formats.gif.url,
      preview: result.media_formats.tinygif.url
    }));
  } catch (error) {
    console.error('Error fetching trending GIFs:', error);
    return [];
  }
}

export async function searchGifs(query: string, limit = 20): Promise<GifResult[]> {
  if (!query.trim()) return getTrendingGifs(limit);
  
  try {
    const data = await fetchWithRetry<any>(
      `${TENOR_API_URL}/search?q=${encodeURIComponent(query)}&key=${TENOR_API_KEY}&limit=${limit}&media_filter=minimal`
    );
    
    return data.results.map((result: any) => ({
      id: result.id,
      title: result.title,
      url: result.media_formats.gif.url,
      preview: result.media_formats.tinygif.url
    }));
  } catch (error) {
    console.error('Error searching GIFs:', error);
    return [];
  }
}