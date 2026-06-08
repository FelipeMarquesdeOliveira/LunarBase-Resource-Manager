import { FlatList, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useSimulation } from '@/context/SimulationContext';
import { AnimatedCard, EventCard, ThemedText } from '@/components';
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
      {/* Header */}
      <AnimatedCard delay={0}>
        <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <ThemedText variant="caption" color="textMuted" style={{ letterSpacing: 2 }}>MISSION LOG</ThemedText>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 2 }}>
            <ThemedText style={{ fontSize: 28, fontWeight: '800', letterSpacing: -0.5 }}>Events</ThemedText>
            {/* Severity summary — inline, no boxes */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: 4 }}>
              {highCount > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.danger }} />
                  <ThemedText style={{ fontSize: 13, fontWeight: '700', color: colors.danger }}>{highCount}</ThemedText>
                </View>
              )}
              {medCount > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.warning }} />
                  <ThemedText style={{ fontSize: 13, fontWeight: '700', color: colors.warning }}>{medCount}</ThemedText>
                </View>
              )}
              {lowCount > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success }} />
                  <ThemedText style={{ fontSize: 13, fontWeight: '700', color: colors.success }}>{lowCount}</ThemedText>
                </View>
              )}
            </View>
          </View>
        </View>
      </AnimatedCard>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xxl }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <AnimatedCard delay={80 + index * 60}>
            <EventCard event={item} />
          </AnimatedCard>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: spacing.xxl }}>
            <Ionicons name="calendar-outline" size={36} color={colors.textDim} />
            <ThemedText variant="caption" color="textMuted" style={{ marginTop: spacing.md }}>
              No active events
            </ThemedText>
          </View>
        }
      />
    </View>
  );
}
