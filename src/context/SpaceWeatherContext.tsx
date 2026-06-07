import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { getApod, type ApodResponse } from '@/services/nasaApi';

type SolarActivity = 'low' | 'medium' | 'high' | 'extreme';

interface SpaceWeatherData {
  solarActivity: SolarActivity;
  solarFlareRisk: number;
  asteroidAlert: boolean;
  asteroidCount: number;
  marsTemperature: number;
  apodData: ApodResponse | null;
  lastUpdated: string;
}

interface SpaceWeatherContextValue {
  data: SpaceWeatherData;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  getEnergyModifier: () => number;
  getOxygenModifier: () => number;
  getAlertMessage: () => string | null;
}

const defaultData: SpaceWeatherData = {
  solarActivity: 'low',
  solarFlareRisk: 0.1,
  asteroidAlert: false,
  asteroidCount: 0,
  marsTemperature: -60,
  apodData: null,
  lastUpdated: new Date().toISOString(),
};

const SpaceWeatherContext = createContext<SpaceWeatherContextValue | undefined>(undefined);

function estimateSolarActivity(): SolarActivity {
  const now = Date.now();
  const minuteOfDay = Math.floor((now % 86400000) / 60000);
  const cycle = minuteOfDay % 60;
  if (cycle < 15) return 'low';
  if (cycle < 30) return 'medium';
  if (cycle < 45) return 'high';
  return 'extreme';
}

function getSolarModifier(activity: SolarActivity): number {
  switch (activity) {
    case 'extreme': return 0.35;
    case 'high': return 0.20;
    case 'medium': return 0.10;
    case 'low': return 0.0;
    default: return 0.0;
  }
}

function calcOxygenModifier(temp: number): number {
  const deviation = Math.abs(temp - (-60)) / 60;
  return deviation * 0.05;
}

export function SpaceWeatherProvider({ children }: { children: React.ReactNode }) {
  const isFocused = useIsFocused();
  const [data, setData] = useState<SpaceWeatherData>(defaultData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const solarActivity = estimateSolarActivity();
      const solarFlareRisk = getSolarModifier(solarActivity);
      const marsTemperature = -60 + Math.round(Math.sin(Date.now() / 3600000) * 30);
      const asteroidAlert = Math.random() < 0.1;
      const asteroidCount = Math.floor(Math.random() * 80) + 5;

      let apodData: ApodResponse | null = null;
      try {
        apodData = await getApod();
      } catch {
        // APOD failed, continue
      }

      setData({
        solarActivity,
        solarFlareRisk,
        asteroidAlert,
        asteroidCount,
        marsTemperature,
        apodData,
        lastUpdated: new Date().toISOString(),
      });
    } catch (err) {
      setError('Failed to load space data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchData();
      const interval = setInterval(fetchData, 120000);
      return () => clearInterval(interval);
    }
  }, [isFocused, fetchData]);

  const getEnergyModifier = useCallback(() => {
    return getSolarModifier(data.solarActivity);
  }, [data.solarActivity]);

  const getOxygenModifier = useCallback(() => {
    return calcOxygenModifier(data.marsTemperature);
  }, [data.marsTemperature]);

  const getAlertMessage = useCallback((): string | null => {
    if (data.solarActivity === 'extreme') return 'SOLAR STORM WARNING: Energy generation reduced by 35%';
    if (data.solarActivity === 'high') return 'HIGH SOLAR ACTIVITY: Energy generation reduced by 20%';
    if (data.asteroidAlert) return `ASTEROID ALERT: ${data.asteroidCount} objects near Earth`;
    return null;
  }, [data]);

  const value = useMemo<SpaceWeatherContextValue>(
    () => ({
      data,
      loading,
      error,
      refetch: fetchData,
      getEnergyModifier,
      getOxygenModifier,
      getAlertMessage,
    }),
    [data, loading, error, fetchData, getEnergyModifier, getOxygenModifier, getAlertMessage],
  );

  return <SpaceWeatherContext.Provider value={value}>{children}</SpaceWeatherContext.Provider>;
}

export function useSpaceWeather(): SpaceWeatherContextValue {
  const ctx = useContext(SpaceWeatherContext);
  if (!ctx) throw new Error('useSpaceWeather must be used within SpaceWeatherProvider');
  return ctx;
}

export type { SolarActivity, SpaceWeatherData };