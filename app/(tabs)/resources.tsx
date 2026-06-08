import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useResources } from '@/context/ResourcesContext';
import { AnimatedCard, AnimatedPressable, ResourceCard, ThemedText } from '@/components';
import { spacing } from '@/theme/spacing';
import type { ResourceKind } from '@/types';

const FILTERS: { label: string; value: ResourceKind | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Water', value: 'water' },
  { label: 'Energy', value: 'energy' },
  { label: 'Oxygen', value: 'oxygen' },
  { label: 'Food', value: 'food' },
];

export default function ResourcesScreen() {
  const { colors } = useTheme();
  const { resources } = useResources();
  const router = useRouter();
  const [filter, setFilter] = useState<ResourceKind | 'all'>('all');

  const filtered = filter === 'all' ? resources : resources.filter((r) => r.kind === filter);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <AnimatedCard delay={0}>
        <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <View>
              <ThemedText variant="caption" color="textMuted" style={{ letterSpacing: 2 }}>INVENTORY</ThemedText>
              <ThemedText style={{ fontSize: 28, fontWeight: '800', letterSpacing: -0.5 }}>Resources</ThemedText>
            </View>
            <AnimatedPressable
              onPress={() => router.push('/resource/new')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.xs,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: 6,
                backgroundColor: colors.primary,
              }}
            >
              <Ionicons name="add" size={16} color="#000" />
              <ThemedText style={{ color: '#000', fontWeight: '700', fontSize: 13 }}>Add</ThemedText>
            </AnimatedPressable>
          </View>
        </View>
      </AnimatedCard>

      {/* Filter chips */}
      <AnimatedCard delay={50}>
        <View style={{ flexDirection: 'row', gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          {FILTERS.map((f) => (
            <AnimatedPressable
              key={f.value}
              onPress={() => setFilter(f.value)}
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
                borderRadius: 20,
                backgroundColor: filter === f.value ? colors.primary : 'transparent',
              }}
            >
              <ThemedText style={{ fontSize: 13, fontWeight: '600', color: filter === f.value ? '#000' : colors.textMuted }}>
                {f.label}
              </ThemedText>
            </AnimatedPressable>
          ))}
        </View>
      </AnimatedCard>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xxl }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <AnimatedCard delay={100 + index * 50}>
            <ResourceCard resource={item} onPress={() => router.push(`/resource/${item.id}`)} />
          </AnimatedCard>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: spacing.xxl }}>
            <Ionicons name="alert-circle-outline" size={36} color={colors.textDim} />
            <ThemedText variant="caption" color="textMuted" style={{ marginTop: spacing.md }}>
              No resources match this filter
            </ThemedText>
          </View>
        }
      />
    </View>
  );
}
