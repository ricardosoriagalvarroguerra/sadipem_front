import { useCallback, useEffect, useMemo, useState } from 'react';

const responseCache = new Map();

/**
 * Simple fetch hook with in-memory caching to avoid refetching the same GET requests.
 * Returns the cached value immediately when available and keeps track of the loading state.
 */
export default function useCachedFetch(url, { enabled = true, initialData = null } = {}) {
  const cacheKey = useMemo(() => (url && enabled ? url : null), [url, enabled]);
  const [data, setData] = useState(() => {
    if (cacheKey && responseCache.has(cacheKey)) {
      return responseCache.get(cacheKey);
    }
    return initialData ?? null;
  });
  const [loading, setLoading] = useState(() => Boolean(cacheKey && !responseCache.has(cacheKey) && initialData === null));
  const [error, setError] = useState(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  useEffect(() => {
    if (!cacheKey) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      if (responseCache.has(cacheKey)) {
        setData(responseCache.get(cacheKey));
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(cacheKey);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const json = await response.json();
        responseCache.set(cacheKey, json);
        if (isMounted) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [cacheKey, reloadIndex]);

  const refetch = useCallback((force = false) => {
    if (!cacheKey) return;
    if (force) {
      responseCache.delete(cacheKey);
    }
    setReloadIndex(index => index + 1);
  }, [cacheKey]);

  return { data, loading, error, refetch };
}
