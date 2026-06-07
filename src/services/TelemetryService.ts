import { ApiConfig, apiGet, apiPost } from './apiConfig';

export interface TelemetryReading {
  id: number;
  sensorType: string;
  value: number;
  unit: string;
  location: string;
  timestamp: string;
}

export interface CurrentTelemetry {
  temperature: number;
  pressure: number;
  radiation: number;
  oxygen: number;
  energy: number;
  timestamp: string;
}

export interface CreateTelemetryRequest {
  sensorType: string;
  value: number;
  unit: string;
  location: string;
}

export const TelemetryService = {
  sendReading: async (req: CreateTelemetryRequest): Promise<TelemetryReading | null> => {
    const res = await apiPost<CreateTelemetryRequest, TelemetryReading>(ApiConfig.getEndpoints().telemetry, req);
    return res.data;
  },

  getCurrent: async (): Promise<CurrentTelemetry | null> => {
    const res = await apiGet<CurrentTelemetry>(`${ApiConfig.getEndpoints().telemetry}/current`);
    return res.data;
  },

  getAll: async (): Promise<TelemetryReading[]> => {
    const res = await apiGet<TelemetryReading[]>(ApiConfig.getEndpoints().telemetry);
    return res.data || [];
  },
};