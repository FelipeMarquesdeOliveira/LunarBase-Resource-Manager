import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { spacing } from '@/theme/spacing';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import type { BaseEvent } from '@/types';

interface Props {
  event: BaseEvent;
}

const iconMap: Record<BaseEvent['kind'], keyof typeof Ionicons.glyphMap> = {
  eva: 'walk',
  'solar-storm': 'thunderstorm',
  supply: 'rocket',
  maintenance: 'construct',
  alert: 'warning',
};

const labelMap: Record<BaseEvent['kind'], string> = {
  eva: 'EVA',
  'solar-storm': 'Tempestade Solar',
  supply: 'Reabastecimento',
  maintenance: 'Manutencao',
  alert: 'Alerta',
};

const toneMap: Record<BaseEvent['severity'], 'success' | 'warning' | 'danger'> = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
};

export function EventCard({ event }: Props) {
  const { colors } = useTheme();
  const tone = colors[toneMap[event.severity]];
  return (
    <ThemedView variant="surface" padded="lg" gap="sm" bordered>
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: `${tone}22` }]}>
          <Ionicons name={iconMap[event.kind]} size={18} color={tone} />
        </View>
        <View style={styles.title}>
          <ThemedText variant="h3">{event.title}</ThemedText>
          <ThemedText variant="caption" color="textMuted">
            {labelMap[event.kind]} - Dia {event.day}
          </ThemedText>
        </View>
        <View style={[styles.severityDot, { backgroundColor: tone }]} />
      </View>
      <ThemedText variant="body" color="textMuted">{event.description}</ThemedText>
      {Object.keys(event.impact).length ? (
        <View style={styles.impactRow}>
          {Object.entries(event.impact).map(([k, v]) => (
            <ThemedText
              key={k}
              variant="caption"
              color={(v ?? 0) >= 0 ? 'success' : 'warning'}
            >
              {k} {(v ?? 0) >= 0 ? '+' : ''}
              {v?.toFixed(1)}
            </ThemedText>
          ))}
        </View>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  title: { flex: 1, gap: 2 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  severityDot: { width: 10, height: 10, borderRadius: 5 },
  impactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.xs },
});
