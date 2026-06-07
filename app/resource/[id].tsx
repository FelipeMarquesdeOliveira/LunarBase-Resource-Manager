import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useResources } from '@/context/ResourcesContext';
import {
  ThemedText,
  ThemedView,
  CriticalityBadge,
  ProgressBar,
  SectionHeader,
  PrimaryButton,
} from '@/components';
import { spacing } from '@/theme/spacing';
import { classify, autonomyDays, recommendReorder, kindLabel } from '@/utils/criticality';
import { formatNumber, formatPercent, formatDate } from '@/utils/format';
import { dailyHistoryMock } from '@/data/mockData';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const W = Dimensions.get('window').width;

export default function ResourceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { resources, adjustResource } = useResources();
  const router = useRouter();

  const resource = resources.find((r) => r.id === id);

  if (!resource) {
    return (
      <ThemedView variant="background" style={styles.centered}>
        <Ionicons name="alert-circle" size={64} color={colors.danger} />
        <ThemedText variant="h2" align="center" style={{ marginTop: spacing.lg }}>
          Recurso nao encontrado
        </ThemedText>
        <PrimaryButton title="Voltar" onPress={() => router.back()} />
      </ThemedView>
    );
  }

  const crit = classify(resource);
  const autonomy = autonomyDays(resource);
  const reorder = recommendReorder(resource);
  const ratio = resource.capacity > 0 ? resource.current / resource.capacity : 0;
  const tone = colors.chart[resource.kind];

  const history = dailyHistoryMock.map((d) => ({
    ...d,
    value: d[resource.kind as keyof typeof d] as number,
  }));

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxxl }}
    >
      <View style={styles.back}>
        <Ionicons name="arrow-back" size={24} color={colors.text} onPress={() => router.back()} />
      </View>

      <View style={styles.headerRow}>
        <ThemedText variant="h1">{resource.name}</ThemedText>
        <CriticalityBadge level={crit} />
      </View>

      <ThemedText variant="body" color="textMuted">
        {kindLabel[resource.kind]} - Atualizado em {formatDate(resource.updatedAt)}
      </ThemedText>

      <ThemedView variant="surface" padded="lg" rounded="lg" bordered>
        <View style={styles.bigMetric}>
          <ThemedText variant="h1" style={{ fontSize: 56 }}>
            {formatNumber(resource.current)}
          </ThemedText>
          <ThemedText variant="h3" color="textMuted">
            {resource.unit}
          </ThemedText>
        </View>
        <View style={styles.row}>
          <View style={styles.metric}>
            <ThemedText variant="caption" color="textMuted">Capacidade</ThemedText>
            <ThemedText variant="h3">{formatNumber(resource.capacity, 0)} {resource.unit}</ThemedText>
          </View>
          <View style={styles.metric}>
            <ThemedText variant="caption" color="textMuted">Nivel</ThemedText>
            <ThemedText variant="h3">{formatPercent(ratio)}</ThemedText>
          </View>
          <View style={styles.metric}>
            <ThemedText variant="caption" color="textMuted">Autonomia</ThemedText>
            <ThemedText variant="h3">
              {Number.isFinite(autonomy) ? `${autonomy.toFixed(1)} dias` : '∞'}
            </ThemedText>
          </View>
        </View>
        <ProgressBar value={ratio} color={tone} height={12} />
      </ThemedView>

      <ThemedView variant="surface" padded="lg" rounded="lg" bordered>
        <SectionHeader title="Consumo Diario" subtitle={`${resource.dailyConsumption} ${resource.unit}/dia`} />
        <View style={styles.row}>
          <View style={styles.metric}>
            <ThemedText variant="caption" color="textMuted">Fonte</ThemedText>
            <ThemedText variant="body">{resource.source}</ThemedText>
          </View>
        </View>
      </ThemedView>

      <ThemedView variant={reorder.shouldReorder ? 'surfaceAlt' : 'surface'} padded="lg" rounded="lg" bordered>
        <View style={styles.row}>
          <Ionicons
            name={reorder.shouldReorder ? 'alert-circle' : 'checkmark-circle'}
            size={24}
            color={reorder.shouldReorder ? colors.warning : colors.success}
          />
          <ThemedText variant="body" style={{ flex: 1 }}>
            {reorder.reason}
          </ThemedText>
        </View>
      </ThemedView>

      <ThemedView variant="surface" padded="lg" rounded="lg" bordered>
        <SectionHeader title="Historico" subtitle="Ultimos 7 dias" />
        <LineChart
          data={{
            labels: history.map((h) => `D${h.day}`),
            datasets: [{ data: history.map((h) => h.value) }],
          }}
          width={W - spacing.lg * 4}
          height={160}
          chartConfig={{
            backgroundColor: colors.surface,
            backgroundGradientFrom: colors.surface,
            backgroundGradientTo: colors.surface,
            decimalPlaces: 0,
            color: () => tone,
            labelColor: () => colors.textMuted,
            propsForBackgroundLines: { stroke: colors.chart.grid, strokeDasharray: '' },
          }}
          bezier
          style={{ marginLeft: -spacing.md }}
        />
      </ThemedView>

      <View style={styles.actions}>
        <PrimaryButton
          title="Ajustar -10"
          onPress={() => adjustResource(resource.id, -10)}
          variant="secondary"
          icon={<Ionicons name="remove" size={18} color={colors.text} />}
        />
        <PrimaryButton
          title="Ajustar +10"
          onPress={() => adjustResource(resource.id, 10)}
          variant="primary"
          icon={<Ionicons name="add" size={18} color={colors.background} />}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  back: { marginBottom: spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bigMetric: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginBottom: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.md },
  metric: { flex: 1, gap: 2 },
  actions: { flexDirection: 'row', gap: spacing.md },
});