import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import type { Criticality } from '@/types';
import { criticalityLabel } from '@/utils/criticality';
import { ThemedText } from './ThemedText';

interface Props {
  level: Criticality;
  size?: 'sm' | 'md';
}

const map: Record<Criticality, 'success' | 'warning' | 'danger'> = {
  safe: 'success',
  attention: 'warning',
  critical: 'warning',
  depleted: 'danger',
};

export function CriticalityBadge({ level, size = 'md' }: Props) {
  const { colors } = useTheme();
  const colorKey = map[level];
  const color = colors[colorKey];
  const dim = size === 'sm' ? styles.sm : styles.md;
  return (
    <View
      style={[
        styles.base,
        dim,
        { backgroundColor: `${color}22`, borderColor: `${color}55` },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <ThemedText variant="caption" style={{ color }}>
        {criticalityLabel[level]}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  sm: { paddingHorizontal: 8, paddingVertical: 2, gap: 4 },
  md: { paddingHorizontal: 10, paddingVertical: 4, gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
