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
  eva: 'walk-outline',
  'solar-storm': 'thunderstorm-outline',
  supply: 'rocket-outline',
  maintenance: 'construct-outline',
  alert: 'warning-outline',
};

const labelMap: Record<BaseEvent['kind'], string> = {
  eva: 'EVA',
  'solar-storm': 'Storm',
  supply: 'Supply',
  maintenance: 'Maintenance',
  alert: 'Alert',
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
    <View style={{ paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      {/* Header: colored icon + label + day */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
        <View style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: tone + '18', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={iconMap[event.kind]} size={14} color={tone} />
        </View>
        <ThemedText style={{ fontWeight: '700', fontSize: 11, color: tone, letterSpacing: 0.5 }}>
          {labelMap[event.kind].toUpperCase()}
        </ThemedText>
        <ThemedText variant="caption" color="textMuted">· Dia {event.day}</ThemedText>
      </View>

      <ThemedText style={{ fontWeight: '700', fontSize: 15, marginBottom: 4 }}>{event.title}</ThemedText>
      <ThemedText variant="caption" color="textMuted" style={{ lineHeight: 17 }}>{event.description}</ThemedText>

      {Object.keys(event.impact).length > 0 && (
        <View style={{ flexDirection: 'row', gap: spacing.xl, marginTop: spacing.sm }}>
          {Object.entries(event.impact).map(([k, v]) => (
            <View key={k}>
              <ThemedText variant="caption" color="textMuted">{k}</ThemedText>
              <ThemedText style={{ fontWeight: '700', fontSize: 13, color: (v ?? 0) >= 0 ? colors.success : colors.danger }}>
                {(v ?? 0) >= 0 ? '+' : ''}{v?.toFixed(1)}
              </ThemedText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
