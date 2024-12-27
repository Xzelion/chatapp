"use client";

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type SubscriptionCallback = (payload: any) => void;

interface SubscriptionConfig {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  schema?: string;
}

export function useRealtimeSubscription(
  config: SubscriptionConfig,
  callback: SubscriptionCallback
) {
  useEffect(() => {
    const subscription = supabase
      .channel(`${config.table}-changes`)
      .on(
        'postgres_changes',
        {
          event: config.event || '*',
          schema: config.schema || 'public',
          table: config.table,
          filter: config.filter
        },
        callback
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [config.table, config.event, config.schema, config.filter, callback]);
}