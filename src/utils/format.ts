export function formatNumber(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return '∞';
  if (value >= 1000) return value.toFixed(0);
  return value.toFixed(digits);
}

export function formatPercent(ratio: number): string {
  return `${Math.round(Math.max(0, Math.min(1, ratio)) * 100)}%`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
