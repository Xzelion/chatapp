const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = MAX_RETRIES,
  delay = RETRY_DELAY
): Promise<T> {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      retries++;
      if (retries === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * retries));
    }
  }
  
  throw new Error('Operation failed after max retries');
}