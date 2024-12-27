import { retryOperation } from '../utils/retry';

const API_TIMEOUT = 5000;

export async function fetchWithTimeout<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  return retryOperation(() => fetchWithTimeout<T>(url, options));
}