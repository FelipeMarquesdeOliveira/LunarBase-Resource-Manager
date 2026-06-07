import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ApiContextValue {
  apiUrl: string;
  isOnline: boolean;
  setApiUrl: (url: string) => void;
  checkConnection: () => Promise<boolean>;
}

const STORAGE_KEY = 'api_url';
const DEFAULT_URL = 'http://localhost:5001';

const ApiContext = createContext<ApiContextValue | undefined>(undefined);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [apiUrl, setApiUrlState] = useState(DEFAULT_URL);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setApiUrlState(stored);
    })();
  }, []);

  const setApiUrl = useCallback(async (url: string) => {
    setApiUrlState(url);
    await AsyncStorage.setItem(STORAGE_KEY, url);
  }, []);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch(`${apiUrl}/resources`, { method: 'GET', signal: AbortSignal.timeout(3000) });
      const online = res.ok;
      setIsOnline(online);
      return online;
    } catch {
      setIsOnline(false);
      return false;
    }
  }, [apiUrl]);

  useEffect(() => {
    const interval = setInterval(() => checkConnection(), 30000);
    return () => clearInterval(interval);
  }, [checkConnection]);

  const value = useMemo<ApiContextValue>(
    () => ({ apiUrl, isOnline, setApiUrl, checkConnection }),
    [apiUrl, isOnline, setApiUrl, checkConnection],
  );

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function useApi(): ApiContextValue {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error('useApi must be used within ApiProvider');
  return ctx;
}