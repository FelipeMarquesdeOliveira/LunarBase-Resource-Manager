import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { useResources } from '@/context/ResourcesContext';
import { useResourceStats } from '@/hooks/useResourceStats';
import { SectionHeader, ThemedText, ThemedView, CriticalityBadge } from '@/components';
import { spacing } from '@/theme/spacing';
import { classify, kindLabel } from '@/utils/criticality';
import { formatNumber } from '@/utils/format';
import { dailyHistoryMock } from '@/data/mockData';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const W = Dimensions.get('window').width;

const kindColor: Record<string, string> = {
  water: '#3498DB',
  energy: '#E8A838',
  oxygen: '#2ECC71',
  food: '#9B59B6',
};

const kindIcon: Record<string, keyof typeof Ionicons.glyphMap> = {
  water: 'water',
  energy: 'flash',
  oxygen: 'cloud-outline',
  food: 'restaurant',
};

function AnimatedCard({ children, onPress, delay = 0 }: { children: React.ReactNode; onPress?: () => void; delay?: number }) {
  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      scale.value = withSpring(1, { damping: 20, stiffness: 200 });
      opacity.value = withSpring(1, { damping: 20, stiffness: 200 });
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Pressable>
  );
}

export default function DashboardScreen() {
  const { colors } = useTheme();
  const { resources, adjustResource } = useResources();
  const { overall, reorderList } = useResourceStats(resources);
  const router = useRouter();
  const [missionDay, setMissionDay] = useState(147);

  useEffect(() => {
    const id = setInterval(() => {
      setMissionDay((d) => d + 1);
    }, 10000);
    return () => clearInterval(id);
  }, []);

  const overallLabel = overall === 'safe' ? 'NOMINAL' : overall === 'attention' ? 'ATTENTION' : overall === 'critical' ? 'CRITICAL' : 'FAILURE';
  const overallTone: 'success' | 'warning' | 'danger' = overall === 'safe' ? 'success' : overall === 'attention' ? 'warning' : 'danger';

  const chartData = {
    labels: dailyHistoryMock.slice(-5).map((d) => `D${d.day}`),
    datasets: [
      { data: dailyHistoryMock.slice(-5).map((d) => d.water), color: () => colors.chart.water, strokeWidth: 1.5 },
      { data: dailyHistoryMock.slice(-5).map((d) => d.energy), color: () => colors.chart.energy, strokeWidth: 1.5 },
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
          <ThemedText variant="h1">COMMAND CENTER</ThemedText>
        </View>
        <CriticalityBadge level={overall} />
      </View>

      {/* Mission Clock */}
      <AnimatedCard delay={0}>
        <View style={[styles.missionClock, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.clockLeft}>
            <Ionicons name="time" size={20} color={colors.primary} />
            <View>
              <ThemedText variant="label" color="textMuted">MISSION DAY</ThemedText>
              <ThemedText variant="dataLarge" style={{ color: colors.primary }}>#{missionDay}</ThemedText>
            </View>
          </View>
          <View style={styles.clockRight}>
            <View style={[styles.clockIndicator, { backgroundColor: colors.success }]} />
            <ThemedText variant="body" style={{ color: colors.success }}>SYSTEMS ONLINE</ThemedText>
          </View>
        </View>
      </AnimatedCard>

      {/* Alert Banner */}
      {reorderList.length > 0 && (
        <AnimatedCard delay={50}>
          <View style={[styles.alertBanner, { backgroundColor: colors.warning + '18', borderColor: colors.warning + '44' }]}>
            <Ionicons name="warning" size={20} color={colors.warning} />
            <View style={{ flex: 1 }}>
              <ThemedText variant="h3" style={{ color: colors.warning }}>{reorderList.length} RESOURCE{reorderList.length > 1 ? 'S' : ''} NEED ATTENTION</ThemedText>
              <ThemedText variant="caption" color="textMuted">
                {reorderList.map((r) => r.resource.name).join(', ')}
              </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.warning} />
          </View>
        </AnimatedCard>
      )}

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <AnimatedCard delay={100}>
          <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ThemedText variant="label" color="textMuted">STATUS</ThemedText>
            <ThemedText variant="data" style={{ color: colors[overallTone] }}>{overallLabel}</ThemedText>
          </View>
        </AnimatedCard>
        <AnimatedCard delay={150}>
          <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ThemedText variant="label" color="textMuted">CREW</ThemedText>
            <ThemedText variant="data">4/4</ThemedText>
          </View>
        </AnimatedCard>
        <AnimatedCard delay={200}>
          <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ThemedText variant="label" color="textMuted">ACTIVE</ThemedText>
            <ThemedText variant="data">{resources.length}</ThemedText>
          </View>
        </AnimatedCard>
      </View>

      {/* Interactive Resource Widgets */}
      <SectionHeader title="RESOURCE STATUS" subtitle="TAP TO ADJUST" />
      {resources.map((r, i) => {
        const crit = classify(r);
        const ratio = r.capacity > 0 ? r.current / r.capacity : 0;
        const tone = kindColor[r.kind];
        return (
          <AnimatedCard key={r.id} delay={250 + i * 50} onPress={() => router.push(`/resource/${r.id}`)}>
            <View style={[styles.resourceWidget, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.widgetHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                  <View style={[styles.widgetIcon, { backgroundColor: tone + '22' }]}>
                    <Ionicons name={kindIcon[r.kind]} size={16} color={tone} />
                  </View>
                  <ThemedText variant="h3">{r.name}</ThemedText>
                </View>
                <CriticalityBadge level={crit} size="sm" />
              </View>

              <View style={styles.widgetMetrics}>
                <View>
                  <ThemedText variant="label" color="textMuted">CURRENT</ThemedText>
                  <ThemedText variant="data" style={{ color: tone }}>{formatNumber(r.current, 0)}</ThemedText>
                </View>
                <View>
                  <ThemedText variant="label" color="textMuted">MAX</ThemedText>
                  <ThemedText variant="body">{formatNumber(r.capacity, 0)} {r.unit}</ThemedText>
                </View>
                <View>
                  <ThemedText variant="label" color="textMuted">DAILY</ThemedText>
                  <ThemedText variant="body">{r.dailyConsumption} {r.unit}</ThemedText>
                </View>
              </View>

              <View style={{ height: 4, backgroundColor: colors.surfaceAlt, borderRadius: 2, marginBottom: spacing.sm }}>
                <View style={{ width: `${ratio * 100}%`, height: '100%', borderRadius: 2, backgroundColor: tone }} />
              </View>

              <View style={styles.widgetActions}>
                <Pressable
                  onPress={(e) => { e.stopPropagation(); adjustResource(r.id, -5); }}
                  style={[styles.widgetBtn, { backgroundColor: colors.danger + '22' }]}
                >
                  <Ionicons name="remove" size={14} color={colors.danger} />
                </Pressable>
                <Pressable
                  onPress={(e) => { e.stopPropagation(); adjustResource(r.id, -1); }}
                  style={[styles.widgetBtn, { backgroundColor: colors.warning + '22' }]}
                >
                  <Ionicons name="remove" size={12} color={colors.warning} />
                </Pressable>
                <Pressable
                  onPress={(e) => { e.stopPropagation(); adjustResource(r.id, 1); }}
                  style={[styles.widgetBtn, { backgroundColor: colors.success + '22' }]}
                >
                  <Ionicons name="add" size={12} color={colors.success} />
                </Pressable>
                <Pressable
                  onPress={(e) => { e.stopPropagation(); adjustResource(r.id, 5); }}
                  style={[styles.widgetBtn, { backgroundColor: colors.primary + '22' }]}
                >
                  <Ionicons name="add" size={14} color={colors.primary} />
                </Pressable>
              </View>
            </View>
          </AnimatedCard>
        );
      })}

      {/* Chart */}
      <AnimatedCard delay={500}>
        <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 5, padding: spacing.md }}>
          <SectionHeader title="TREND ANALYSIS" subtitle="5-DAY HISTORY" dense />
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
      </AnimatedCard>

      {/* Quick Actions */}
      <AnimatedCard delay={550}>
        <View style={styles.quickActions}>
          <Pressable
            onPress={() => router.push('/simulation')}
            style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Ionicons name="options" size={20} color={colors.primary} />
            <ThemedText variant="label" color="textMuted">SIMULATION</ThemedText>
          </Pressable>
          <Pressable
            onPress={() => router.push('/(tabs)/events')}
            style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Ionicons name="alert-circle" size={20} color={colors.warning} />
            <ThemedText variant="label" color="textMuted">EVENTS</ThemedText>
          </Pressable>
          <Pressable
            onPress={() => router.push('/(tabs)/resources')}
            style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Ionicons name="list" size={20} color={colors.text} />
            <ThemedText variant="label" color="textMuted">ALL RESOURCES</ThemedText>
          </Pressable>
        </View>
      </AnimatedCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.md },
  missionClock: {
    borderWidth: 1,
    borderRadius: 5,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clockLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  clockRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  clockIndicator: { width: 8, height: 8, borderRadius: 4 },
  alertBanner: {
    borderWidth: 1,
    borderRadius: 5,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  statsRow: { flexDirection: 'row', gap: spacing.sm },
  statBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    padding: spacing.md,
  },
  resourceWidget: {
    borderWidth: 1,
    borderRadius: 5,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  widgetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  widgetIcon: { width: 32, height: 32, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  widgetMetrics: { flexDirection: 'row', gap: spacing.xl, marginBottom: spacing.sm },
  widgetActions: { flexDirection: 'row', gap: spacing.xs, justifyContent: 'flex-end' },
  widgetBtn: {
    width: 36,
    height: 28,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActions: { flexDirection: 'row', gap: spacing.sm },
  quickAction: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
});