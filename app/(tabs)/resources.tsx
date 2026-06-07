import { useState } from 'react';
import { FlatList, StyleSheet, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useResources } from '@/context/ResourcesContext';
import { ResourceCard, ThemedText } from '@/components';
import { spacing } from '@/theme/spacing';
import type { ResourceKind } from '@/types';

const FILTERS: { label: string; value: ResourceKind | 'all' }[] = [
  { label: 'ALL', value: 'all' },
  { label: 'H2O', value: 'water' },
  { label: 'PWR', value: 'energy' },
  { label: 'O2', value: 'oxygen' },
  { label: 'FOOD', value: 'food' },
];

export default function ResourcesScreen() {
  const { colors } = useTheme();
  const { resources } = useResources();
  const router = useRouter();
  const [filter, setFilter] = useState<ResourceKind | 'all'>('all');

  const filtered = filter === 'all' ? resources : resources.filter((r) => r.kind === filter);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <ThemedText variant="h1">RESOURCES</ThemedText>
        <ThemedText variant="caption" color="textMuted">{resources.length} ACTIVE // {filtered.length} DISPLAYED</ThemedText>
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.xs, padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        {FILTERS.map((f) => (
          <Pressable
            key={f.value}
            onPress={() => setFilter(f.value)}
            style={{
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
              borderRadius: 3,
              backgroundColor: filter === f.value ? colors.primary : colors.surface,
              borderWidth: 1,
              borderColor: filter === f.value ? colors.primary : colors.border,
            }}
          >
            <ThemedText
              variant="label"
              style={{ color: filter === f.value ? '#000' : colors.textMuted }}
            >
              {f.label}
            </ThemedText>
          </Pressable>
        ))}
        <View style={{ flex: 1 }} />
        <Pressable
          onPress={() => router.push('/resource/new')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.xs,
            borderRadius: 3,
            backgroundColor: colors.surfaceAlt,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Ionicons name="add" size={14} color={colors.text} />
          <ThemedText variant="label" color="textMuted">ADD</ThemedText>
        </Pressable>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xxl }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ResourceCard resource={item} onPress={() => router.push(`/resource/${item.id}`)} />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', padding: spacing.xl }}>
            <Ionicons name="alert-circle-outline" size={40} color={colors.textDim} />
            <ThemedText variant="caption" color="textMuted" style={{ marginTop: spacing.md }}>
              NO RESOURCES MATCH FILTER
            </ThemedText>
          </View>
        }
      />
    </View>
  );
}

