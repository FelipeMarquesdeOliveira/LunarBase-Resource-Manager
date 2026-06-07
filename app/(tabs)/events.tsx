import { FlatList, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useSimulation } from '@/context/SimulationContext';
import { SectionHeader, EventCard, ThemedView, ThemedText } from '@/components';
import { spacing } from '@/theme/spacing';
import { sampleEvents } from '@/data/mockData';

export default function EventsScreen() {
  const { colors } = useTheme();
  const { config } = useSimulation();

  const filtered = sampleEvents.filter((e) => config.activeEvents.includes(e.kind));

  const highEvents = filtered.filter((e) => e.severity === 'high').length;
  const mediumEvents = filtered.filter((e) => e.severity === 'medium').length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <ThemedText variant="h1">Eventos</ThemedText>
        <ThemedText variant="caption" color="textMuted">
          {filtered.length} eventos ativos
        </ThemedText>
      </View>

      <View style={styles.statsRow}>
        <ThemedView variant="surface" padded="md" rounded="md" style={{ flex: 1 }}>
          <View style={styles.stat}>
            <Ionicons name="warning" size={20} color={colors.danger} />
            <ThemedText variant="h3">{highEvents}</ThemedText>
            <ThemedText variant="caption" color="textMuted">Criticos</ThemedText>
          </View>
        </ThemedView>
        <ThemedView variant="surface" padded="md" rounded="md" style={{ flex: 1 }}>
          <View style={styles.stat}>
            <Ionicons name="alert-circle" size={20} color={colors.warning} />
            <ThemedText variant="h3">{mediumEvents}</ThemedText>
            <ThemedText variant="caption" color="textMuted">Moderados</ThemedText>
          </View>
        </ThemedView>
        <ThemedView variant="surface" padded="md" rounded="md" style={{ flex: 1 }}>
          <View style={styles.stat}>
            <Ionicons name="radio-button-on" size={20} color={colors.success} />
            <ThemedText variant="h3">{config.activeEvents.length}</ThemedText>
            <ThemedText variant="caption" color="textMuted">Ativos</ThemedText>
          </View>
        </ThemedView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <EventCard event={item} />}
        ListEmptyComponent={
          <ThemedView variant="surface" padded="xl" align="center">
            <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
            <ThemedText variant="body" color="textMuted" align="center" style={{ marginTop: spacing.md }}>
              Nenhum evento ativo
            </ThemedText>
          </ThemedView>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, gap: spacing.xs },
  statsRow: { flexDirection: 'row', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  stat: { alignItems: 'center', gap: 2 },
});