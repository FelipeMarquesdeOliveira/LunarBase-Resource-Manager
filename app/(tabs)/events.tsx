import { FlatList, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useSimulation } from '@/context/SimulationContext';
import { EventCard, ThemedText } from '@/components';
import { spacing } from '@/theme/spacing';
import { sampleEvents } from '@/data/mockData';

export default function EventsScreen() {
  const { colors } = useTheme();
  const { config } = useSimulation();

  const filtered = sampleEvents.filter((e) => config.activeEvents.includes(e.kind));
  const highCount = filtered.filter((e) => e.severity === 'high').length;
  const medCount = filtered.filter((e) => e.severity === 'medium').length;
  const lowCount = filtered.filter((e) => e.severity === 'low').length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <ThemedText variant="h1">EVENTS</ThemedText>
        <ThemedText variant="caption" color="textMuted">{filtered.length} ACTIVE // {config.activeEvents.length} CONFIGURED</ThemedText>
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.sm, padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={[styles.counterBox, { backgroundColor: colors.danger + '22', borderColor: colors.danger + '44' }]}>
          <ThemedText variant="data" style={{ color: colors.danger }}>{highCount}</ThemedText>
          <ThemedText variant="label" color="textMuted">HIGH</ThemedText>
        </View>
        <View style={[styles.counterBox, { backgroundColor: colors.warning + '22', borderColor: colors.warning + '44' }]}>
          <ThemedText variant="data" style={{ color: colors.warning }}>{medCount}</ThemedText>
          <ThemedText variant="label" color="textMuted">MED</ThemedText>
        </View>
        <View style={[styles.counterBox, { backgroundColor: colors.success + '22', borderColor: colors.success + '44' }]}>
          <ThemedText variant="data" style={{ color: colors.success }}>{lowCount}</ThemedText>
          <ThemedText variant="label" color="textMuted">LOW</ThemedText>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xxl }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <EventCard event={item} />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', padding: spacing.xl }}>
            <Ionicons name="calendar-outline" size={40} color={colors.textDim} />
            <ThemedText variant="caption" color="textMuted" style={{ marginTop: spacing.md }}>
              NO ACTIVE EVENTS
            </ThemedText>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  counterBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderRadius: 5,
  },
});