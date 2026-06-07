import { View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import type { Criticality } from '@/types';
import { criticalityLabel } from '@/utils/criticality';
import { ThemedText } from './ThemedText';

interface Props {
  level: Criticality;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

const colorMap: Record<Criticality, 'success' | 'warning' | 'danger'> = {
  safe: 'success',
  attention: 'warning',
  critical: 'warning',
  depleted: 'danger',
};

const labelMap: Record<Criticality, string> = {
  safe: 'OK',
  attention: 'ATT',
  critical: 'CRIT',
  depleted: 'ERR',
};

export function CriticalityBadge({ level, size = 'md', showLabel = true }: Props) {
  const { colors } = useTheme();
  const colorKey = colorMap[level];
  const color = colors[colorKey];
  const isDot = size === 'sm' && !showLabel;

  if (isDot) {
    return (
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: color,
        }}
      />
    );
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.badge[level],
        paddingHorizontal: size === 'sm' ? 6 : 8,
        paddingVertical: size === 'sm' ? 2 : 4,
        borderRadius: 3,
      }}
    >
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }} />
      <ThemedText variant="label" style={{ color, fontSize: size === 'sm' ? 9 : 10 }}>
        {showLabel ? labelMap[level] : criticalityLabel[level]}
      </ThemedText>
    </View>
  );
}