import { useState, useEffect } from 'react';
import { ConnectionStatus, setupConnectionMonitoring } from '../chat/connection';

export function useConnection() {
  const [status, setStatus] = useState<ConnectionStatus>('connecting');

  useEffect(() => {
    const cleanup = setupConnectionMonitoring(setStatus);
    return cleanup;
  }, []);

  return status;
}