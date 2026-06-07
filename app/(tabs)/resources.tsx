import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useResources } from '@/context/ResourcesContext';
import { SectionHeader, ResourceCard, ThemedView, ThemedText } from '@/components';
import { spacing } from '@/theme/spacing';
import type { ResourceKind } from '@/types';

const FILTERS: { label: string; value: ResourceKind | 'all' }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Agua', value: 'water' },
  { label: 'Energia', value: 'energy' },
  { label: 'Oxigenio', value: 'oxygen' },
  { label: 'Alimento', value: 'food' },
];

export default function ResourcesScreen() {
  const { colors } = useTheme();
  const { resources } = useResources();
  const [filter, setFilter] = useState<ResourceKind | 'all'>('all');

  const filtered = filter === 'all' ? resources : resources.filter((r) => r.kind === filter);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <ThemedText variant="h1">Recursos</ThemedText>
        <ThemedText variant="caption" color="textMuted">
          {resources.length} itens monitorados
        </ThemedText>
      </View>

      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <ThemedView
            key={f.value}
            variant={filter === f.value ? 'surfaceAlt' : 'surface'}
            rounded="pill"
            padded={{ xs: 8, sm: 12 }}
            onTouchEnd={() => setFilter(f.value)}
            style={{ opacity: filter === f.value ? 1 : 0.6 }}
          >
            <ThemedText variant="caption" color={filter === f.value ? 'primary' : 'textMuted'}>
              {f.label}
            </ThemedText>
          </ThemedView>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ResourceCard resource={item} onPress={() => {}} />
        )}
        ListEmptyComponent={
          <ThemedView variant="surface" padded="xl" align="center">
            <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
            <ThemedText variant="body" color="textMuted" align="center" style={{ marginTop: spacing.md }}>
              Nenhum recurso encontrado
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
  filters: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, flexWrap: 'wrap' },
});