import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Resource } from '@/types';
import { readJson, StorageKeys, writeJson } from '@/services/storage';
import { initialResources } from '@/data/mockData';

interface ResourcesContextValue {
  resources: Resource[];
  ready: boolean;
  upsertResource: (r: Resource) => void;
  removeResource: (id: string) => void;
  adjustResource: (id: string, delta: number) => void;
  resetToDefault: () => void;
}

const ResourcesContext = createContext<ResourcesContextValue | undefined>(undefined);

export function ResourcesProvider({ children }: { children: React.ReactNode }) {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const stored = await readJson<Resource[] | null>(StorageKeys.resources, null);
      if (mounted) {
        if (stored && stored.length) setResources(stored);
        setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const persist = useCallback((next: Resource[]) => {
    setResources(next);
    void writeJson(StorageKeys.resources, next);
  }, []);

  const upsertResource = useCallback(
    (r: Resource) => {
      const exists = resources.some((item) => item.id === r.id);
      const next = exists ? resources.map((item) => (item.id === r.id ? r : item)) : [r, ...resources];
      persist(next);
    },
    [persist, resources],
  );

  const removeResource = useCallback(
    (id: string) => {
      persist(resources.filter((r) => r.id !== id));
    },
    [persist, resources],
  );

  const adjustResource = useCallback(
    (id: string, delta: number) => {
      const next = resources.map((r) =>
        r.id === id
          ? { ...r, current: Math.max(0, Math.min(r.capacity, r.current + delta)), updatedAt: new Date().toISOString() }
          : r,
      );
      persist(next);
    },
    [persist, resources],
  );

  const resetToDefault = useCallback(() => {
    persist(initialResources);
  }, [persist]);

  const value = useMemo<ResourcesContextValue>(
    () => ({ resources, ready, upsertResource, removeResource, adjustResource, resetToDefault }),
    [resources, ready, upsertResource, removeResource, adjustResource, resetToDefault],
  );

  return <ResourcesContext.Provider value={value}>{children}</ResourcesContext.Provider>;
}

export function useResources(): ResourcesContextValue {
  const ctx = useContext(ResourcesContext);
  if (!ctx) throw new Error('useResources must be used within ResourcesProvider');
  return ctx;
}
