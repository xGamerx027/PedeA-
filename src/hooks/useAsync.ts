import { useCallback, useEffect, useState } from 'react';
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(() => { setLoading(true); setError(null); fn().then(setData).catch((e: Error) => setError(e.message || 'Erro ao carregar')).finally(() => setLoading(false)); }, deps);
  useEffect(run, [run]);
  return { data, loading, error, reload: run };
}
