import { ApiConfig, apiGet, apiPost } from './apiConfig';

export interface Simulation {
  id: number;
  name: string;
  crewSize: number;
  days: number;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  finalResources?: {
    water: number;
    energy: number;
    oxygen: number;
    food: number;
  };
  createdAt: string;
}

export interface CreateSimulationRequest {
  name: string;
  crewSize: number;
  days: number;
}

export const SimulationService = {
  create: async (req: CreateSimulationRequest): Promise<Simulation | null> => {
    const res = await apiPost<CreateSimulationRequest, Simulation>(ApiConfig.getEndpoints().simulation, req);
    return res.data;
  },

  run: async (id: number): Promise<Simulation | null> => {
    const res = await apiPost<null, Simulation>(`${ApiConfig.getEndpoints().simulation}/${id}/run`, null);
    return res.data;
  },

  getById: async (id: number): Promise<Simulation | null> => {
    const res = await apiGet<Simulation>(`${ApiConfig.getEndpoints().simulation}/${id}`);
    return res.data;
  },

  getHistory: async (): Promise<Simulation[]> => {
    const res = await apiGet<Simulation[]>(`${ApiConfig.getEndpoints().simulation}/history`);
    return res.data || [];
  },
};