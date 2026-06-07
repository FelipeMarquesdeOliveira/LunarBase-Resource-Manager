import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { colors, type ColorScheme, type ThemeColors } from '@/theme/colors';
import { readJson, StorageKeys, writeJson } from '@/services/storage';

type ThemePreference = 'system' | 'light' | 'dark';

interface ThemeContextValue {
  preference: ThemePreference;
  scheme: ColorScheme;
  colors: ThemeColors;
  setPreference: (p: ThemePreference) => void;
  toggle: () => void;
  ready: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const stored = await readJson<ThemePreference>(StorageKeys.theme, 'system');
      if (mounted) {
        setPreferenceState(stored);
        setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const setPreference = useCallback((p: ThemePreference) => {
    setPreferenceState(p);
    void writeJson(StorageKeys.theme, p);
  }, []);

  const scheme: ColorScheme = useMemo(() => {
    if (preference === 'light' || preference === 'dark') return preference;
    return systemScheme === 'light' ? 'light' : 'dark';
  }, [preference, systemScheme]);

  const toggle = useCallback(() => {
    setPreference(scheme === 'dark' ? 'light' : 'dark');
  }, [scheme, setPreference]);

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, scheme, colors: colors[scheme] as ThemeColors, setPreference, toggle, ready }),
    [preference, scheme, setPreference, toggle, ready],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
