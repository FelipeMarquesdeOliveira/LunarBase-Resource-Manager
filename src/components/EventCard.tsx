import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { spacing } from '@/theme/spacing';
import { ThemedText } from './ThemedText';
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
  'solar-storm': 'STORM',
  supply: 'SUPPLY',
  maintenance: 'MAINT',
  alert: 'ALERT',
};

const severityColor: Record<BaseEvent['severity'], 'success' | 'warning' | 'danger'> = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
};

export function EventCard({ event }: Props) {
  const { colors } = useTheme();
  const tone = colors[severityColor[event.severity]];

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 5,
        padding: spacing.md,
        marginBottom: spacing.sm,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
        <Ionicons name={iconMap[event.kind]} size={16} color={tone} />
        <ThemedText variant="label" style={{ color: tone }}>
          {labelMap[event.kind]}
        </ThemedText>
        <View style={{ width: 1, height: 12, backgroundColor: colors.border }} />
        <ThemedText variant="label" color="textMuted">DIA {event.day}</ThemedText>
        <View style={{ flex: 1 }} />
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: tone }} />
      </View>

      <ThemedText variant="h3" style={{ marginBottom: spacing.xs }}>{event.title}</ThemedText>
      <ThemedText variant="caption" color="textMuted" style={{ lineHeight: 16 }}>{event.description}</ThemedText>

      {Object.keys(event.impact).length > 0 && (
        <View style={{ flexDirection: 'row', gap: spacing.lg, marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border }}>
          {Object.entries(event.impact).map(([k, v]) => (
            <View key={k}>
              <ThemedText variant="label" color="textMuted">{k.toUpperCase()}</ThemedText>
              <ThemedText variant="mono" style={{ color: (v ?? 0) >= 0 ? colors.success : colors.danger }}>
                {(v ?? 0) >= 0 ? '+' : ''}{v?.toFixed(1)}
              </ThemedText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}