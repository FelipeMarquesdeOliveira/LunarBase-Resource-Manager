import { useMemo } from 'react';
import { useTheme } from '@/context/ThemeContext';
import type { Resource } from '@/types';
import { autonomyDays, classify, recommendReorder, worst } from '@/utils/criticality';

export function useResourceStats(resources: Resource[]) {
  return useMemo(() => {
    const totalAutonomy = Math.min(
      ...resources.map((r) => (Number.isFinite(autonomyDays(r)) ? autonomyDays(r) : 9999)),
    );
    const overall = worst(...resources.map((r) => classify(r)));
    const reorderList = resources
      .map((r) => ({ resource: r, ...recommendReorder(r) }))
      .filter((entry) => entry.shouldReorder);
    return { totalAutonomy, overall, reorderList };
  }, [resources]);
}

export function useThemeColor<T extends string>(light: T, dark: T): T {
  const { scheme } = useTheme();
  return scheme === 'dark' ? dark : light;
}
