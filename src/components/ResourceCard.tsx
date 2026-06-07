import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { radius, spacing } from '@/theme/spacing';
import { autonomyDays, classify, kindIcon, kindLabel, recommendReorder } from '@/utils/criticality';
import { formatNumber, formatPercent } from '@/utils/format';
import type { Resource } from '@/types';
import { CriticalityBadge } from './CriticalityBadge';
import { ProgressBar } from './ProgressBar';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface Props {
  resource: Resource;
  onPress?: () => void;
}

export function ResourceCard({ resource, onPress }: Props) {
  const { colors } = useTheme();
  const crit = classify(resource);
  const autonomy = autonomyDays(resource);
  const reorder = recommendReorder(resource);
  const ratio = resource.capacity > 0 ? resource.current / resource.capacity : 0;
  const tone = colors.chart[resource.kind];

  return (
    <Pressable onPress={onPress} android_ripple={{ color: colors.border }}>
      <ThemedView variant="surface" padded="lg" gap="md" rounded="lg" bordered>
        <View style={styles.headerRow}>
          <View style={[styles.iconWrap, { backgroundColor: `${tone}22` }]}>
            <Ionicons name={kindIcon[resource.kind] as any} size={20} color={tone} />
          </View>
          <View style={styles.headerText}>
            <ThemedText variant="h3">{resource.name}</ThemedText>
            <ThemedText variant="caption" color="textMuted">
              {kindLabel[resource.kind]} - {resource.source}
            </ThemedText>
          </View>
          <CriticalityBadge level={crit} size="sm" />
        </View>

        <View style={styles.row}>
          <View style={styles.metric}>
            <ThemedText variant="h2">{formatNumber(resource.current)}</ThemedText>
            <ThemedText variant="caption" color="textMuted">
              {resource.unit} de {formatNumber(resource.capacity, 0)}
            </ThemedText>
          </View>
          <View style={styles.metric}>
            <ThemedText variant="h2">{formatPercent(ratio)}</ThemedText>
            <ThemedText variant="caption" color="textMuted">Nivel atual</ThemedText>
          </View>
          <View style={styles.metric}>
            <ThemedText variant="h2">{Number.isFinite(autonomy) ? `${autonomy.toFixed(1)}d` : '∞'}</ThemedText>
            <ThemedText variant="caption" color="textMuted">Autonomia</ThemedText>
          </View>
        </View>

        <ProgressBar value={ratio} color={tone} />

        <View style={styles.footer}>
          <ThemedText variant="caption" color={reorder.shouldReorder ? 'warning' : 'textMuted'}>
            {reorder.reason}
          </ThemedText>
          {reorder.shouldReorder ? (
            <Ionicons name="alert-circle" size={16} color={colors.warning} />
          ) : (
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
          )}
        </View>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  headerText: { flex: 1, gap: 2 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', gap: spacing.lg },
  metric: { flex: 1, gap: 2 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
});
