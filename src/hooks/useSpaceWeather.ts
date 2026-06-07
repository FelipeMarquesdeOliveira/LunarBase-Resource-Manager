import { useState, useEffect, useCallback } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { getApod, type ApodResponse } from '@/services/nasaApi';

interface SpaceWeatherData {
  solarActivity: 'low' | 'medium' | 'high' | 'extreme';
  solarFlareRisk: number;
  asteroidAlert: boolean;
  asteroidCount: number;
  marsTemperature: number;
  apodData: ApodResponse | null;
  lastUpdated: string;
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

function estimateSolarActivity(): 'low' | 'medium' | 'high' | 'extreme' {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const cycle = dayOfYear % 28;
  if (cycle < 7) return 'low';
  if (cycle < 14) return 'medium';
  if (cycle < 21) return 'high';
  return 'extreme';
}

function estimateSolarFlareRisk(activity: 'low' | 'medium' | 'high' | 'extreme'): number {
  switch (activity) {
    case 'extreme': return 0.9;
    case 'high': return 0.65;
    case 'medium': return 0.35;
    case 'low': return 0.1;
    default: return 0.1;
  }
}

function estimateMarsTemperature(): number {
  const hour = new Date().getHours();
  const baseTemp = -60;
  const variation = Math.sin((hour - 6) * Math.PI / 12) * 30;
  return Math.round(baseTemp + variation);
}

export function useSpaceWeather() {
  const isFocused = useIsFocused();
  const [data, setData] = useState<SpaceWeatherData>(defaultData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const solarActivity = estimateSolarActivity();
      const solarFlareRisk = estimateSolarFlareRisk(solarActivity);
      const marsTemperature = estimateMarsTemperature();
      const asteroidAlert = Math.random() < 0.08;
      const asteroidCount = Math.floor(Math.random() * 50) + 10;

      let apodData: ApodResponse | null = null;
      try {
        apodData = await getApod();
      } catch {
        // APOD failed, continue with other data
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
      const interval = setInterval(fetchData, 300000);
      return () => clearInterval(interval);
    }
  }, [isFocused, fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function getEnergyImpactFromSolar(activity: 'low' | 'medium' | 'high' | 'extreme'): number {
  switch (activity) {
    case 'extreme': return 0.35;
    case 'high': return 0.20;
    case 'medium': return 0.10;
    case 'low': return 0.0;
    default: return 0.0;
  }
}

export function getOxygenImpactFromMarsTemp(temp: number): number {
  const deviation = (temp - (-60)) / 60;
  return deviation * 0.05;
}

export type { SpaceWeatherData };