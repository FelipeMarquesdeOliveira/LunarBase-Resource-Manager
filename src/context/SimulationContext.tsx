import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { EventKind, SimulationConfig } from '@/types';
import { readJson, StorageKeys, writeJson } from '@/services/storage';

interface SimulationContextValue {
  config: SimulationConfig;
  ready: boolean;
  updateConfig: (partial: Partial<SimulationConfig>) => void;
  toggleEvent: (kind: EventKind) => void;
  reset: () => void;
}

const defaultConfig: SimulationConfig = {
  crewSize: 4,
  days: 14,
  startDate: new Date().toISOString(),
  activeEvents: ['eva', 'solar-storm', 'supply'],
};

const SimulationContext = createContext<SimulationContextValue | undefined>(undefined);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SimulationConfig>(defaultConfig);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const stored = await readJson<SimulationConfig | null>(StorageKeys.simulation, null);
      if (mounted) {
        if (stored) setConfig(stored);
        setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const updateConfig = useCallback((partial: Partial<SimulationConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...partial };
      void writeJson(StorageKeys.simulation, next);
      return next;
    });
  }, []);

  const toggleEvent = useCallback((kind: EventKind) => {
    setConfig((prev) => {
      const has = prev.activeEvents.includes(kind);
      const next = {
        ...prev,
        activeEvents: has ? prev.activeEvents.filter((k) => k !== kind) : [...prev.activeEvents, kind],
      };
      void writeJson(StorageKeys.simulation, next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setConfig(defaultConfig);
    void writeJson(StorageKeys.simulation, defaultConfig);
  }, []);

  const value = useMemo<SimulationContextValue>(
    () => ({ config, ready, updateConfig, toggleEvent, reset }),
    [config, ready, updateConfig, toggleEvent, reset],
  );

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}

export function useSimulation(): SimulationContextValue {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error('useSimulation must be used within SimulationContext');
  return ctx;
}
