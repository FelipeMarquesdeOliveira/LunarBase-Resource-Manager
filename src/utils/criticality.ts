import type { Criticality, Resource, ResourceKind } from '@/types';

const ORDER: Criticality[] = ['safe', 'attention', 'critical', 'depleted'];

export function classify(resource: Pick<Resource, 'current' | 'capacity' | 'dailyConsumption'>): Criticality {
  const ratio = resource.capacity > 0 ? resource.current / resource.capacity : 0;
  if (resource.current <= 0) return 'depleted';
  if (ratio < 0.15) return 'critical';
  if (ratio < 0.35) return 'attention';
  return 'safe';
}

export function autonomyDays(resource: Pick<Resource, 'current' | 'dailyConsumption'>): number {
  if (resource.dailyConsumption <= 0) return Infinity;
  return Math.max(0, resource.current / resource.dailyConsumption);
}

export function recommendReorder(resource: Resource): { shouldReorder: boolean; reason: string } {
  const days = autonomyDays(resource);
  const crit = classify(resource);
  if (crit === 'depleted') return { shouldReorder: true, reason: 'Resource depleted. Immediate resupply required.' };
  if (crit === 'critical') return { shouldReorder: true, reason: 'Critical level. Resupply within 24h.' };
  if (days < 3) return { shouldReorder: true, reason: `Autonomy of ${days.toFixed(1)} days. Schedule resupply.` };
  return { shouldReorder: false, reason: 'Level within expected range.' };
}

export const criticalityLabel: Record<Criticality, string> = {
  safe: 'Stable',
  attention: 'Attention',
  critical: 'Critical',
  depleted: 'Depleted',
};

export const kindLabel: Record<ResourceKind, string> = {
  water: 'Water',
  energy: 'Energy',
  oxygen: 'Oxygen',
  food: 'Food',
};

export const kindIcon: Record<ResourceKind, string> = {
  water: 'water',
  energy: 'flash',
  oxygen: 'cloud',
  food: 'restaurant',
};

export const severityRank: Record<Criticality, number> = {
  safe: 0,
  attention: 1,
  critical: 2,
  depleted: 3,
};

export function worst(...values: Criticality[]): Criticality {
  return values.reduce((acc, v) => (severityRank[v] > severityRank[acc] ? v : acc), 'safe' as Criticality);
}

export function isWorse(a: Criticality, b: Criticality): boolean {
  return severityRank[a] > severityRank[b];
}

export { ORDER as criticalityOrder };