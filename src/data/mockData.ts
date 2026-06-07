import type { BaseEvent, Resource } from '@/types';

const now = new Date().toISOString();

export const initialResources: Resource[] = [
  {
    id: 'res-water',
    kind: 'water',
    name: 'Reserva de Agua',
    unit: 'L',
    current: 420,
    capacity: 800,
    dailyConsumption: 28,
    source: 'Reciclador ECLSS - Modulo A',
    updatedAt: now,
  },
  {
    id: 'res-energy',
    kind: 'energy',
    name: 'Banco de Energia',
    unit: 'kWh',
    current: 180,
    capacity: 320,
    dailyConsumption: 22,
    source: 'Painel solar + RTG',
    updatedAt: now,
  },
  {
    id: 'res-oxygen',
    kind: 'oxygen',
    name: 'Tanques de O2',
    unit: 'kg',
    current: 14.5,
    capacity: 60,
    dailyConsumption: 1.2,
    source: 'Eletrolise + tanques reserva',
    updatedAt: now,
  },
  {
    id: 'res-food',
    kind: 'food',
    name: 'Estoque de Alimentos',
    unit: 'kg',
    current: 86,
    capacity: 200,
    dailyConsumption: 4.2,
    source: 'Modulo de armazenamento pressurizado',
    updatedAt: now,
  },
];

export const sampleEvents: BaseEvent[] = [
  {
    id: 'evt-eva-01',
    kind: 'eva',
    title: 'EVA - Reparo do painel solar',
    description: 'Equipe realizou atividade extraveicular de 6h para realinhamento do painel sul.',
    day: 3,
    impact: { oxygen: -1.5, energy: -8, food: -1.2 },
    severity: 'medium',
  },
  {
    id: 'evt-storm-01',
    kind: 'solar-storm',
    title: 'Tempestade solar classe M2',
    description: 'Atividade geomagnetica reduziu geracao de energia em 35% por 12h.',
    day: 5,
    impact: { energy: -28, oxygen: -0.6 },
    severity: 'high',
  },
  {
    id: 'evt-supply-01',
    kind: 'supply',
    title: 'Reabastecimento orbital',
    description: 'Capsula de carga entregou 120L de agua e 40kg de alimentos.',
    day: 7,
    impact: { water: 120, food: 40 },
    severity: 'low',
  },
  {
    id: 'evt-maint-01',
    kind: 'maintenance',
    title: 'Manutencao do ECLSS',
    description: 'Calibracao dos filtros de ar e checagem do reciclador de agua.',
    day: 2,
    impact: { oxygen: 0.4, water: 0.6 },
    severity: 'low',
  },
  {
    id: 'evt-alert-01',
    kind: 'alert',
    title: 'Alerta de pressao no habitat',
    description: 'Variacao de pressao detectada - ventilacao em modo de emergencia.',
    day: 4,
    impact: { energy: -3 },
    severity: 'medium',
  },
];

export const dailyHistoryMock = Array.from({ length: 8 }).map((_, i) => ({
  day: i + 1,
  water: 600 - i * 22,
  energy: 280 - i * 12,
  oxygen: 55 - i * 4.5,
  food: 180 - i * 11,
}));
