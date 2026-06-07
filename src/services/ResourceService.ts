import { ApiConfig, apiGet, apiPost, apiPut } from './apiConfig';

export type ResourceType = 'OXYGEN' | 'WATER' | 'ENERGY' | 'FOOD' | 'FUEL';
export type ResourceStatus = 'STABLE' | 'WARNING' | 'CRITICAL' | 'OFFLINE';

export interface ResourceResponse {
  id: number;
  name: string;
  type: ResourceType;
  currentAmount: number;
  maxCapacity: number;
  usagePercentage: number;
  status: ResourceStatus;
  location: string;
  createdAt: string;
}

export interface CreateResourceRequest {
  name: string;
  type: ResourceType;
  maxCapacity: number;
  location: string;
}

export interface UpdateResourceRequest {
  currentAmount: number;
}

export interface ResourceStats {
  total: number;
  stable: number;
  warning: number;
  critical: number;
  offline: number;
}

export const ResourceService = {
  getAll: async (): Promise<ResourceResponse[]> => {
    const res = await apiGet<ResourceResponse[]>(ApiConfig.getEndpoints().resources);
    return res.data || [];
  },

  getById: async (id: number): Promise<ResourceResponse | null> => {
    const res = await apiGet<ResourceResponse>(`${ApiConfig.getEndpoints().resources}/${id}`);
    return res.data;
  },

  create: async (req: CreateResourceRequest): Promise<ResourceResponse | null> => {
    const res = await apiPost<CreateResourceRequest, ResourceResponse>(ApiConfig.getEndpoints().resources, req);
    return res.data;
  },

  update: async (id: number, req: UpdateResourceRequest): Promise<ResourceResponse | null> => {
    const res = await apiPut<UpdateResourceRequest, ResourceResponse>(`${ApiConfig.getEndpoints().resources}/${id}`, req);
    return res.data;
  },

  consume: async (id: number, amount: number): Promise<ResourceResponse | null> => {
    const res = await apiPost<{ amount: number }, ResourceResponse>(`${ApiConfig.getEndpoints().resources}/${id}/consume`, { amount });
    return res.data;
  },

  replenish: async (id: number, amount: number): Promise<ResourceResponse | null> => {
    const res = await apiPost<{ amount: number }, ResourceResponse>(`${ApiConfig.getEndpoints().resources}/${id}/replenish`, { amount });
    return res.data;
  },

  getStats: async (): Promise<ResourceStats | null> => {
    const res = await apiGet<ResourceStats>(`${ApiConfig.getEndpoints().resources}/stats`);
    return res.data;
  },

  getHistory: async (id: number): Promise<unknown[]> => {
    const res = await apiGet<unknown[]>(`${ApiConfig.getEndpoints().resources}/${id}/history`);
    return res.data || [];
  },
};