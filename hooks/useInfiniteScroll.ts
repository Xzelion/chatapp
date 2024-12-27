"use client";

import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
  loading: boolean;
  threshold?: number;
}

export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  loading,
  threshold = 100
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver>();
  const loadingRef = useRef(loading);

  const lastElementRef = useCallback((node: HTMLElement | null) => {
    if (observerRef.current) observerRef.current.disconnect();
    if (loading || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && hasMore && !loadingRef.current) {
          await onLoadMore();
        }
      },
      { rootMargin: `${threshold}px` }
    );

    if (node) observerRef.current.observe(node);
  }, [onLoadMore, hasMore, loading, threshold]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { lastElementRef };
}