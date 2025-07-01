import { useState, useCallback } from 'react';

type AsyncFunction<TParams extends any[], TResult> = (...args: TParams) => Promise<TResult>;

interface AsyncState<TResult, TParams extends any[]> {
  execute: (...args: TParams) => Promise<TResult | null>;
  loading: boolean;
  error: string | null;
}

export function useAsync<TParams extends any[], TResult>(
  asyncFunction: AsyncFunction<TParams, TResult>
): AsyncState<TResult, TParams> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...params: TParams): Promise<TResult | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await asyncFunction(...params);
        return result;
      } catch (err: any) {
        setError(err.message || 'Unexpected error');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction]
  );

  return { execute, loading, error };
}