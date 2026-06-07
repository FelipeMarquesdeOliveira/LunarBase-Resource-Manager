import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { spacing } from '@/theme/spacing';
import { classify, autonomyDays, kindIcon, kindLabel } from '@/utils/criticality';
import { formatNumber } from '@/utils/format';
import type { Resource } from '@/types';
import { CriticalityBadge } from './CriticalityBadge';
import { ProgressBar } from './ProgressBar';
import { ThemedText } from './ThemedText';

interface Props {
  resource: Resource;
  onPress?: () => void;
  compact?: boolean;
}

const kindColor: Record<Resource['kind'], string> = {
  water: '#3498DB',
  energy: '#E8A838',
  oxygen: '#2ECC71',
  food: '#9B59B6',
};

export function ResourceCard({ resource, onPress, compact = false }: Props) {
  const { colors } = useTheme();
  const crit = classify(resource);
  const autonomy = autonomyDays(resource);
  const ratio = resource.capacity > 0 ? resource.current / resource.capacity : 0;
  const tone = kindColor[resource.kind];

  if (compact) {
    return (
      <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: tone }} />
        <View style={{ flex: 1 }}>
          <ThemedText variant="body">{resource.name}</ThemedText>
          <ThemedText variant="caption" color="textMuted">{formatNumber(resource.current, 0)} / {formatNumber(resource.capacity, 0)} {resource.unit}</ThemedText>
        </View>
        <CriticalityBadge level={crit} size="sm" />
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 5, padding: spacing.md, marginBottom: spacing.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: tone }} />
          <ThemedText variant="h3">{resource.name}</ThemedText>
        </View>
        <CriticalityBadge level={crit} size="sm" />
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.xl, marginBottom: spacing.md }}>
        <View>
          <ThemedText variant="label" color="textMuted">ATUAL</ThemedText>
          <ThemedText variant="data" style={{ color: tone }}>{formatNumber(resource.current)}</ThemedText>
          <ThemedText variant="caption" color="textMuted">{resource.unit}</ThemedText>
        </View>
        <View>
          <ThemedText variant="label" color="textMuted">MAX</ThemedText>
          <ThemedText variant="data">{formatNumber(resource.capacity, 0)}</ThemedText>
          <ThemedText variant="caption" color="textMuted">{resource.unit}</ThemedText>
        </View>
        <View>
          <ThemedText variant="label" color="textMuted">AUTONOMIA</ThemedText>
          <ThemedText variant="data" style={{ color: autonomy < 5 ? colors.warning : colors.success }}>
            {Number.isFinite(autonomy) ? `${autonomy.toFixed(0)}d` : '--'}
          </ThemedText>
          <ThemedText variant="caption" color="textMuted">dias</ThemedText>
        </View>
      </View>

      <ProgressBar value={ratio} color={tone} showLabel />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm }}>
        <ThemedText variant="caption" color="textMuted">{resource.source}</ThemedText>
        <ThemedText variant="mono" color="textMuted">{resource.dailyConsumption} {resource.unit}/dia</ThemedText>
      </View>
    </Pressable>
  );
}