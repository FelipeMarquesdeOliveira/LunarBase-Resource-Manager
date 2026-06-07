import { ApiConfig, apiGet } from './apiConfig';

export interface SpaceWeather {
  solarActivity: string;
  solarFlareRisk: number;
  geomagneticIndex: number;
  uvIndex: number;
  timestamp: string;
}

export interface Asteroid {
  id: string;
  name: string;
  diameter: number;
  missDistance: number;
  velocity: number;
  hazardLevel: string;
}

export interface MarsWeather {
  temperature: number;
  pressure: number;
  windSpeed: number;
  season: string;
  timestamp: string;
}

export const SpaceService = {
  getWeather: async (): Promise<SpaceWeather | null> => {
    const res = await apiGet<SpaceWeather>(ApiConfig.getEndpoints().spaceWeather);
    return res.data;
  },

  getAsteroids: async (): Promise<{ asteroids: Asteroid[]; count: number } | null> => {
    const res = await apiGet<{ asteroids: Asteroid[]; count: number }>(ApiConfig.getEndpoints().spaceAsteroids);
    return res.data;
  },

  getMarsWeather: async (): Promise<MarsWeather | null> => {
    const res = await apiGet<MarsWeather>(ApiConfig.getEndpoints().spaceMars);
    return res.data;
  },
};