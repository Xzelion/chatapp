"use client";

import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { setupConnectionMonitoring, ConnectionStatus } from '@/lib/chat/connection';

export default function ConnectionStatusIndicator() {
  const [status, setStatus] = useState<ConnectionStatus>('connecting');

  useEffect(() => {
    const cleanup = setupConnectionMonitoring(setStatus);
    return cleanup;
  }, []);

  if (status === 'connected') return null;

  return (
    <div className={cn(
      "fixed bottom-4 right-4 px-4 py-2 rounded-lg flex items-center gap-2",
      "animate-in slide-in-from-bottom-2",
      status === 'connecting' ? 'bg-yellow-500/90' : 'bg-destructive',
      'text-white'
    )}>
      {status === 'connecting' ? (
        <Wifi className="h-4 w-4 animate-pulse" />
      ) : (
        <WifiOff className="h-4 w-4" />
      )}
      <span>
        {status === 'connecting' 
          ? 'Reconnecting...' 
          : 'Connection lost. Check your internet.'}
      </span>
    </div>
  );
}