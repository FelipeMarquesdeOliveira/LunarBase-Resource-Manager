import { useState, useEffect } from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useResources } from '@/context/ResourcesContext';
import { useResourceStats } from '@/hooks/useResourceStats';
import { useSpaceWeather } from '@/context/SpaceWeatherContext';
import { ThemedText, AnimatedCard } from '@/components';
import { spacing } from '@/theme/spacing';
import { classify, autonomyDays } from '@/utils/criticality';
import { formatNumber } from '@/utils/format';
import { dailyHistoryMock } from '@/data/mockData';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const W = Dimensions.get('window').width;

const kindColor: Record<string, string> = {
  water: '#4A9EFF',
  energy: '#E8A838',
  oxygen: '#2ECC71',
  food: '#A78BFA',
};

const kindIcon: Record<string, keyof typeof Ionicons.glyphMap> = {
  water: 'water-outline',
  energy: 'flash-outline',
  oxygen: 'cloud-outline',
  food: 'restaurant-outline',
};

export default function DashboardScreen() {
  const { colors } = useTheme();
  const { resources, adjustResource } = useResources();
  const { overall, reorderList } = useResourceStats(resources);
  const { data: sw } = useSpaceWeather();
  const router = useRouter();
  const [missionDay, setMissionDay] = useState(147);

  useEffect(() => {
    const id = setInterval(() => setMissionDay((d) => d + 1), 10000);
    return () => clearInterval(id);
  }, []);

  const overallTone = overall === 'safe' ? colors.success : overall === 'attention' ? colors.warning : colors.danger;

  const chartData = {
    labels: dailyHistoryMock.slice(-5).map((d) => `D${d.day}`),
    datasets: [
      { data: dailyHistoryMock.slice(-5).map((d) => d.water), color: () => kindColor.water, strokeWidth: 1.5 },
      { data: dailyHistoryMock.slice(-5).map((d) => d.energy), color: () => kindColor.energy, strokeWidth: 1.5 },
    ],
    legend: ['H2O', 'PWR'],
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: spacing.xxl }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.lg, paddingBottom: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <ThemedText variant="caption" color="textMuted" style={{ letterSpacing: 2 }}>LUNAR BASE ALPHA</ThemedText>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 4 }}>
          <ThemedText style={{ fontSize: 28, fontWeight: '800', letterSpacing: -0.5 }}>Command Center</ThemedText>
          <View style={{ alignItems: 'flex-end' }}>
            <ThemedText style={{ fontSize: 42, fontWeight: '900', color: colors.primary, lineHeight: 44 }}>{missionDay}</ThemedText>
            <ThemedText variant="caption" color="textMuted">mission day</ThemedText>
          </View>
        </View>

        {/* Status line */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: overallTone }} />
          <ThemedText style={{ fontSize: 12, fontWeight: '600', color: overallTone }}>
            {overall === 'safe' ? 'All systems nominal' : `${reorderList.length} resource${reorderList.length > 1 ? 's' : ''} need attention`}
          </ThemedText>
          {reorderList.length > 0 && (
            <ThemedText variant="caption" color="textMuted" style={{ flex: 1 }} numberOfLines={1}>
              · {reorderList.map(r => r.resource.name).join(', ')}
            </ThemedText>
          )}
        </View>
      </View>

      <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.lg, gap: spacing.xl }}>
        {/* Resources */}
        <AnimatedCard delay={0}>
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md }}>
              <ThemedText variant="caption" color="textMuted" style={{ letterSpacing: 2 }}>RESOURCES</ThemedText>
              <Pressable onPress={() => router.push('/(tabs)/resources')}>
                <ThemedText variant="caption" style={{ color: colors.primary }}>see all →</ThemedText>
              </Pressable>
            </View>

            {resources.map((r, i) => {
              const crit = classify(r);
              const ratio = r.capacity > 0 ? r.current / r.capacity : 0;
              const autonomy = autonomyDays(r);
              const tone = kindColor[r.kind];
              const isWarning = crit === 'attention' || crit === 'critical' || crit === 'failure';
              return (
                <AnimatedCard key={r.id} delay={40 + i * 40} onPress={() => router.push(`/resource/${r.id}`)}>
                  <View style={{ paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                        <View style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: tone + '18', alignItems: 'center', justifyContent: 'center' }}>
                          <Ionicons name={kindIcon[r.kind]} size={14} color={tone} />
                        </View>
                        <ThemedText style={{ fontWeight: '600', fontSize: 14 }}>{r.name}</ThemedText>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3 }}>
                        <ThemedText style={{ fontSize: 22, fontWeight: '800', lineHeight: 24, color: isWarning ? colors.warning : tone }}>
                          {formatNumber(r.current, 0)}
                        </ThemedText>
                        <ThemedText variant="caption" color="textMuted" style={{ marginBottom: 2 }}>{r.unit}</ThemedText>
                      </View>
                    </View>
                    <View style={{ height: 2, backgroundColor: colors.surfaceAlt, borderRadius: 1, marginBottom: spacing.xs }}>
                      <View style={{ width: `${Math.min(ratio * 100, 100)}%`, height: '100%', borderRadius: 1, backgroundColor: isWarning ? colors.warning : tone }} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <ThemedText variant="caption" color="textMuted">
                        {Number.isFinite(autonomy) ? `${autonomy.toFixed(0)}d left` : '—'}
                      </ThemedText>
                      <View style={{ flexDirection: 'row', gap: spacing.xs }}>
                        {[-5, +5].map((delta) => (
                          <Pressable
                            key={delta}
                            onPress={(e) => { e.stopPropagation(); adjustResource(r.id, delta); }}
                            style={({ pressed }) => ({
                              paddingHorizontal: spacing.sm,
                              paddingVertical: 3,
                              borderRadius: 4,
                              backgroundColor: pressed
                                ? colors.surfaceAlt
                                : delta < 0 ? colors.danger + '15' : colors.success + '15',
                            })}
                          >
                            <ThemedText style={{ fontSize: 11, fontWeight: '700', color: delta < 0 ? colors.danger : colors.success }}>
                              {delta > 0 ? '+' : ''}{delta}
                            </ThemedText>
                          </Pressable>
                        ))}
                      </View>
                    </View>
                  </View>
                </AnimatedCard>
              );
            })}
          </View>
        </AnimatedCard>

        {/* ENV info — inline, no box */}
        <AnimatedCard delay={240}>
          <View>
            <ThemedText variant="caption" color="textMuted" style={{ letterSpacing: 2, marginBottom: spacing.sm }}>ENVIRONMENT</ThemedText>
            <View style={{ flexDirection: 'row', gap: spacing.xl }}>
              <View>
                <ThemedText variant="caption" color="textMuted">solar</ThemedText>
                <ThemedText style={{ fontWeight: '700', fontSize: 15, color: sw.solarActivity === 'extreme' ? colors.danger : sw.solarActivity === 'high' ? colors.warning : colors.text }}>
                  {sw.solarActivity}
                </ThemedText>
              </View>
              <View>
                <ThemedText variant="caption" color="textMuted">surface temp</ThemedText>
                <ThemedText style={{ fontWeight: '700', fontSize: 15 }}>{sw.marsTemperature}°C</ThemedText>
              </View>
              <View>
                <ThemedText variant="caption" color="textMuted">energy loss</ThemedText>
                <ThemedText style={{ fontWeight: '700', fontSize: 15 }}>−{(sw.solarFlareRisk * 100).toFixed(0)}%</ThemedText>
              </View>
            </View>
          </View>
        </AnimatedCard>

        {/* Chart */}
        <AnimatedCard delay={300}>
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
              <ThemedText variant="caption" color="textMuted" style={{ letterSpacing: 2 }}>5-DAY TREND</ThemedText>
              <ThemedText variant="caption" color="textMuted">H2O · PWR</ThemedText>
            </View>
            <LineChart
              data={chartData}
              width={W - spacing.md * 2}
              height={110}
              chartConfig={{
                backgroundColor: colors.background,
                backgroundGradientFrom: colors.background,
                backgroundGradientTo: colors.background,
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

        {/* Actions */}
        <AnimatedCard delay={380}>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Pressable
              onPress={() => router.push('/simulation')}
              style={({ pressed }) => ({
                flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                gap: spacing.sm, paddingVertical: spacing.md, borderRadius: 6,
                backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1,
              })}
            >
              <Ionicons name="options-outline" size={16} color="#000" />
              <ThemedText style={{ color: '#000', fontWeight: '700', fontSize: 13 }}>Simulation</ThemedText>
            </Pressable>
            <Pressable
              onPress={() => router.push('/(tabs)/events')}
              style={({ pressed }) => ({
                flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                gap: spacing.sm, paddingVertical: spacing.md, borderRadius: 6,
                borderWidth: 1, borderColor: colors.border, opacity: pressed ? 0.7 : 1,
              })}
            >
              <Ionicons name="calendar-outline" size={16} color={colors.text} />
              <ThemedText style={{ fontWeight: '600', fontSize: 13 }}>Events</ThemedText>
            </Pressable>
          </View>
        </AnimatedCard>
      </View>
    </ScrollView>
  );
}
