import { useEffect, useState } from 'react';
import { readJson, writeJson, type StorageKey } from '@/services/storage';

export function useAsyncStorage<T>(key: StorageKey, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const stored = await readJson<T>(key, initial);
      if (mounted) {
        setValue(stored);
        setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = (next: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
      void writeJson(key, resolved);
      return resolved;
    });
  };

  return { value, setValue: update, ready };
}
