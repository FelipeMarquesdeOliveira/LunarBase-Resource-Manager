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
  if (crit === 'depleted') return { shouldReorder: true, reason: 'Recurso esgotado. Reabastecimento imediato.' };
  if (crit === 'critical') return { shouldReorder: true, reason: 'Nivel critico. Reabastecer em ate 24h.' };
  if (days < 3) return { shouldReorder: true, reason: `Autonomia de ${days.toFixed(1)} dias. Agendar reabastecimento.` };
  return { shouldReorder: false, reason: 'Nivel dentro do esperado.' };
}

export const criticalityLabel: Record<Criticality, string> = {
  safe: 'Estavel',
  attention: 'Atencao',
  critical: 'Critico',
  depleted: 'Esgotado',
};

export const kindLabel: Record<ResourceKind, string> = {
  water: 'Agua',
  energy: 'Energia',
  oxygen: 'Oxigenio',
  food: 'Alimento',
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
