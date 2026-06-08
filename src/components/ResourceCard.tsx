import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { spacing } from '@/theme/spacing';
import { classify, autonomyDays } from '@/utils/criticality';
import { formatNumber } from '@/utils/format';
import type { Resource } from '@/types';
import { ThemedText } from './ThemedText';

interface Props {
  resource: Resource;
  onPress?: () => void;
  compact?: boolean;
}

const kindColor: Record<Resource['kind'], string> = {
  water: '#4A9EFF',
  energy: '#E8A838',
  oxygen: '#2ECC71',
  food: '#A78BFA',
};

const kindIcon: Record<Resource['kind'], keyof typeof Ionicons.glyphMap> = {
  water: 'water-outline',
  energy: 'flash-outline',
  oxygen: 'cloud-outline',
  food: 'restaurant-outline',
};

export function ResourceCard({ resource, onPress, compact = false }: Props) {
  const { colors } = useTheme();
  const crit = classify(resource);
  const autonomy = autonomyDays(resource);
  const ratio = resource.capacity > 0 ? resource.current / resource.capacity : 0;
  const tone = kindColor[resource.kind];
  const isWarning = crit === 'attention' || crit === 'critical' || crit === 'failure';

  if (compact) {
    return (
      <Pressable
        onPress={onPress}
        style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        <Ionicons name={kindIcon[resource.kind]} size={14} color={tone} />
        <View style={{ flex: 1 }}>
          <ThemedText style={{ fontWeight: '600', fontSize: 14 }}>{resource.name}</ThemedText>
          <ThemedText variant="caption" color="textMuted">{formatNumber(resource.current, 0)} / {formatNumber(resource.capacity, 0)} {resource.unit}</ThemedText>
        </View>
        {isWarning && <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.warning }} />}
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={{ paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      {/* Header: icon + name, value on right */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <View style={{ width: 30, height: 30, borderRadius: 6, backgroundColor: tone + '18', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name={kindIcon[resource.kind]} size={15} color={tone} />
          </View>
          <ThemedText style={{ fontWeight: '600', fontSize: 15 }}>{resource.name}</ThemedText>
        </View>
        {/* Current value — colored, prominent */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3 }}>
          <ThemedText style={{ fontSize: 26, fontWeight: '800', lineHeight: 28, color: isWarning ? colors.warning : tone }}>
            {formatNumber(resource.current, 0)}
          </ThemedText>
          <ThemedText variant="caption" color="textMuted" style={{ marginBottom: 3 }}>{resource.unit}</ThemedText>
        </View>
      </View>

      {/* Progress bar */}
      <View style={{ height: 3, backgroundColor: colors.surfaceAlt, borderRadius: 2, marginBottom: spacing.xs }}>
        <View style={{ width: `${Math.min(ratio * 100, 100)}%`, height: '100%', borderRadius: 2, backgroundColor: isWarning ? colors.warning : tone }} />
      </View>

      {/* Footer */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <ThemedText variant="caption" color="textMuted">
          {Number.isFinite(autonomy) ? `${autonomy.toFixed(0)}d left` : '—'}
        </ThemedText>
        <ThemedText variant="caption" color="textMuted">−{resource.dailyConsumption} {resource.unit}/day · {resource.source}</ThemedText>
      </View>
    </Pressable>
  );
}
