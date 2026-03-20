"use client";

import { useState, useEffect, useRef, type DependencyList } from "react";

/**
 * Async data-fetching hook. Runs queryFn on mount (and whenever deps change).
 * Uses a ref so the latest closure is always called without re-triggering the effect.
 */
export function useQuery<T>(
  queryFn: () => Promise<T>,
  deps: DependencyList = [],
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const fnRef = useRef(queryFn);
  fnRef.current = queryFn;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fnRef.current()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((e) => {
        if (!cancelled)
          setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
