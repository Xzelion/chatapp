import { supabase } from '../supabase';
import { retryOperation } from '../utils/retry';

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

const RETRY_INTERVALS = [1000, 2000, 5000, 10000];
const CONNECTION_TIMEOUT = 5000;

export function setupConnectionMonitoring(
  onStatusChange: (status: ConnectionStatus) => void
) {
  let retryCount = 0;
  let retryTimeout: NodeJS.Timeout | null = null;
  let lastPingTime = Date.now();

  const checkConnection = async () => {
    try {
      const start = Date.now();
      const result = await retryOperation(async () => {
        const { error } = await supabase.from('messages').select('id').limit(1);
        return !error;
      });
      
      const latency = Date.now() - start;
      if (result && latency < CONNECTION_TIMEOUT) {
        lastPingTime = Date.now();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const tryReconnect = async () => {
    onStatusChange('connecting');
    
    const isConnected = await checkConnection();
    
    if (isConnected) {
      retryCount = 0;
      onStatusChange('connected');
    } else {
      const interval = RETRY_INTERVALS[Math.min(retryCount, RETRY_INTERVALS.length - 1)];
      retryCount++;
      
      retryTimeout = setTimeout(tryReconnect, interval);
      onStatusChange('disconnected');
    }
  };

  const connectionCheck = setInterval(async () => {
    if (Date.now() - lastPingTime > CONNECTION_TIMEOUT) {
      tryReconnect();
    }
  }, 10000);

  tryReconnect();

  return () => {
    if (retryTimeout) clearTimeout(retryTimeout);
    clearInterval(connectionCheck);
  };
}