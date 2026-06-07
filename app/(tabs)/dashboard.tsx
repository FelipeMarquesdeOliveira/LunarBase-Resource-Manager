import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useResources } from '@/context/ResourcesContext';
import { useResourceStats } from '@/hooks/useResourceStats';
import { SectionHeader, StatCard, ResourceCard, ThemedText, ThemedView, CriticalityBadge } from '@/components';
import { spacing } from '@/theme/spacing';
import { worst } from '@/utils/criticality';
import { formatNumber } from '@/utils/format';
import { dailyHistoryMock } from '@/data/mockData';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const W = Dimensions.get('window').width;

export default function DashboardScreen() {
  const { colors } = useTheme();
  const { resources } = useResources();
  const { overall, totalAutonomy } = useResourceStats(resources);
  const router = useRouter();

  const overallLabel = overall === 'safe' ? 'NOMINAL' : overall === 'attention' ? 'ATTENTION' : overall === 'critical' ? 'CRITICAL' : 'FAILURE';
  const overallTone: 'success' | 'warning' | 'danger' = overall === 'safe' ? 'success' : overall === 'attention' ? 'warning' : 'danger';

  const chartData = {
    labels: dailyHistoryMock.slice(-5).map((d) => `D${d.day}`),
    datasets: [
      {
        data: dailyHistoryMock.slice(-5).map((d) => d.water),
        color: () => colors.chart.water,
        strokeWidth: 1.5,
      },
      {
        data: dailyHistoryMock.slice(-5).map((d) => d.energy),
        color: () => colors.chart.energy,
        strokeWidth: 1.5,
      },
    ],
    legend: ['H2O', 'PWR'],
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xxl }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <ThemedText variant="label" color="textMuted">LUNAR BASE ALPHA</ThemedText>
          <ThemedText variant="h1">SYSTEM STATUS</ThemedText>
        </View>
        <CriticalityBadge level={overall} />
      </View>

      {/* Status Row */}
      <View style={styles.statusRow}>
        <View style={[styles.statusBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <ThemedText variant="label" color="textMuted">OVERALL</ThemedText>
          <ThemedText variant="data" style={{ color: colors[overallTone] }}>{overallLabel}</ThemedText>
        </View>
        <View style={[styles.statusBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <ThemedText variant="label" color="textMuted">AUTONOMY</ThemedText>
          <ThemedText variant="data" style={{ color: totalAutonomy < 5 ? colors.warning : colors.success }}>
            {formatNumber(totalAutonomy, 0)}
            <ThemedText variant="caption" color="textMuted"> DAYS</ThemedText>
          </ThemedText>
        </View>
        <View style={[styles.statusBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <ThemedText variant="label" color="textMuted">CREW</ThemedText>
          <ThemedText variant="data">4</ThemedText>
        </View>
      </View>

      {/* Chart */}
      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 5, padding: spacing.md }}>
        <SectionHeader title="RESOURCE TRENDS" subtitle="5-DAY HISTORY" dense />
        <LineChart
          data={chartData}
          width={W - spacing.md * 4}
          height={140}
          chartConfig={{
            backgroundColor: colors.surface,
            backgroundGradientFrom: colors.surface,
            backgroundGradientTo: colors.surface,
            decimalPlaces: 0,
            color: () => colors.primary,
            labelColor: () => colors.textMuted,
            propsForBackgroundLines: { stroke: colors.chart.grid, strokeDasharray: '' },
            propsForLabels: { fontSize: 10 },
          }}
          bezier={false}
          style={{ marginLeft: -spacing.sm }}
        />
      </View>

      {/* Resources */}
      <SectionHeader
        title="ACTIVE RESOURCES"
        right={
          <ThemedText variant="label" color="primary" onPress={() => router.push('/(tabs)/resources')}>
            VIEW ALL
          </ThemedText>
        }
      />

      {resources.slice(0, 2).map((r) => (
        <ResourceCard key={r.id} resource={r} onPress={() => router.push(`/resource/${r.id}`)} />
      ))}

      {/* Simulation CTA */}
      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 5, padding: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <Ionicons name="options" size={20} color={colors.primary} />
            <View>
              <ThemedText variant="h3">SIMULATION MODE</ThemedText>
              <ThemedText variant="caption" color="textMuted">Run consumption simulation</ThemedText>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} onPress={() => router.push('/simulation')} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.md },
  statusRow: { flexDirection: 'row', gap: spacing.sm },
  statusBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    padding: spacing.md,
  },
});