import { ApiConfig, apiGet, apiPost } from './apiConfig';

export type EventSeverity = 'INFO' | 'WARNING' | 'CRITICAL' | 'EMERGENCY';
export type EventStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED' | 'ARCHIVED';

export interface SpaceEvent {
  id: number;
  title: string;
  description: string;
  severity: EventSeverity;
  status: EventStatus;
  resourceId?: number;
  createdAt: string;
  acknowledgedAt?: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  severity: EventSeverity;
}

export const EventService = {
  getAll: async (): Promise<SpaceEvent[]> => {
    const res = await apiGet<SpaceEvent[]>(ApiConfig.getEndpoints().events);
    return res.data || [];
  },

  getActive: async (): Promise<SpaceEvent[]> => {
    const res = await apiGet<SpaceEvent[]>(`${ApiConfig.getEndpoints().events}/active`);
    return res.data || [];
  },

  create: async (req: CreateEventRequest): Promise<SpaceEvent | null> => {
    const res = await apiPost<CreateEventRequest, SpaceEvent>(ApiConfig.getEndpoints().events, req);
    return res.data;
  },

  acknowledge: async (id: number): Promise<SpaceEvent | null> => {
    const res = await apiPost<null, SpaceEvent>(`${ApiConfig.getEndpoints().events}/${id}/ack`, null);
    return res.data;
  },

  linkResource: async (eventId: number, resourceId: number): Promise<SpaceEvent | null> => {
    const res = await apiPost<{ resourceId: number }, SpaceEvent>(`${ApiConfig.getEndpoints().events}/${eventId}/link-resource`, { resourceId });
    return res.data;
  },
};