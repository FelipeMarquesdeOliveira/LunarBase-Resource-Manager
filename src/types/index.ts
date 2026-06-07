export type ResourceKind = 'water' | 'energy' | 'oxygen' | 'food';

export type Criticality = 'safe' | 'attention' | 'critical' | 'depleted';

export interface Resource {
  id: string;
  kind: ResourceKind;
  name: string;
  unit: string;
  current: number;
  capacity: number;
  dailyConsumption: number;
  source: string;
  updatedAt: string;
}

export type EventKind = 'eva' | 'solar-storm' | 'supply' | 'maintenance' | 'alert';

export interface BaseEvent {
  id: string;
  kind: EventKind;
  title: string;
  description: string;
  day: number;
  impact: Partial<Record<ResourceKind, number>>;
  severity: 'low' | 'medium' | 'high';
}

export interface SimulationConfig {
  crewSize: number;
  days: number;
  startDate: string;
  activeEvents: EventKind[];
}

export interface DailySnapshot {
  day: number;
  water: number;
  energy: number;
  oxygen: number;
  food: number;
}

export interface FormErrors {
  [field: string]: string | undefined;
}

export type RootStackParamList = {
  Tabs: undefined;
  ResourceDetail: { id: string };
  NewResource: undefined;
  Simulation: undefined;
};
