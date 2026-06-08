import { useEffect } from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay } from 'react-native-reanimated';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import { useResources } from '@/context/ResourcesContext';
import { ThemedText, PrimaryButton, AnimatedPressable } from '@/components';
import { spacing } from '@/theme/spacing';
import { classify, autonomyDays, kindLabel } from '@/utils/criticality';
import { formatNumber, formatDate } from '@/utils/format';
import { dailyHistoryMock } from '@/data/mockData';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const W = Dimensions.get('window').width;

function AnimatedSection({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: any }) {
  const isFocused = useIsFocused();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

  useEffect(() => {
    if (isFocused) {
      opacity.value = withDelay(delay, withSpring(1, { damping: 20, stiffness: 180 }));
      translateY.value = withDelay(delay, withSpring(0, { damping: 20, stiffness: 180 }));
    } else {
      opacity.value = 0;
      translateY.value = 8;
    }
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
}

export default function ResourceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { resources, adjustResource } = useResources();
  const router = useRouter();

  const resource = resources.find((r) => r.id === id);

  if (!resource) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', gap: spacing.lg }}>
        <Ionicons name="alert-circle" size={48} color={colors.danger} />
        <ThemedText style={{ fontWeight: '700', fontSize: 18 }}>Resource not found</ThemedText>
        <PrimaryButton title="Go back" onPress={() => router.back()} />
      </View>
    );
  }

  const crit = classify(resource);
  const autonomy = autonomyDays(resource);
  const ratio = resource.capacity > 0 ? resource.current / resource.capacity : 0;
  const isWarning = crit === 'attention' || crit === 'critical' || crit === 'failure';
  const barColor = isWarning ? colors.warning : colors.primary;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: spacing.xxl }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <AnimatedSection delay={0}>
        <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg }}>
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color={colors.text} />
            </Pressable>
            <ThemedText variant="caption" color="textMuted" style={{ letterSpacing: 2 }}>
              {kindLabel[resource.kind].toUpperCase()}
            </ThemedText>
          </View>

          {/* Big number hero */}
          <ThemedText style={{ fontSize: 22, fontWeight: '800', marginBottom: spacing.xs }}>{resource.name}</ThemedText>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: spacing.xs, marginBottom: spacing.md }}>
            <ThemedText style={{ fontSize: 56, fontWeight: '900', lineHeight: 58, color: isWarning ? colors.warning : colors.text }}>
              {formatNumber(resource.current, 0)}
            </ThemedText>
            <ThemedText variant="caption" color="textMuted" style={{ marginBottom: 10 }}>
              / {formatNumber(resource.capacity, 0)} {resource.unit}
            </ThemedText>
          </View>

          {/* Progress bar */}
          <View style={{ height: 3, backgroundColor: colors.surfaceAlt, borderRadius: 2 }}>
            <View style={{ width: `${Math.min(ratio * 100, 100)}%`, height: '100%', borderRadius: 2, backgroundColor: barColor }} />
          </View>

          {/* Inline metrics */}
          <View style={{ flexDirection: 'row', gap: spacing.xl, marginTop: spacing.md }}>
            <View>
              <ThemedText variant="caption" color="textMuted">autonomy</ThemedText>
              <ThemedText style={{ fontWeight: '700', color: autonomy < 5 ? colors.warning : colors.text }}>
                {Number.isFinite(autonomy) ? `${autonomy.toFixed(0)} days` : '—'}
              </ThemedText>
            </View>
            <View>
              <ThemedText variant="caption" color="textMuted">daily use</ThemedText>
              <ThemedText style={{ fontWeight: '700' }}>−{resource.dailyConsumption} {resource.unit}</ThemedText>
            </View>
            <View>
              <ThemedText variant="caption" color="textMuted">source</ThemedText>
              <ThemedText style={{ fontWeight: '700' }}>{resource.source}</ThemedText>
            </View>
          </View>
        </View>
      </AnimatedSection>

      {/* Chart */}
      <AnimatedSection delay={100}>
        <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
            <ThemedText variant="caption" color="textMuted" style={{ letterSpacing: 2 }}>HISTORY</ThemedText>
            <ThemedText variant="caption" color="textMuted">7-day trend</ThemedText>
          </View>
          <LineChart
            data={{
              labels: dailyHistoryMock.map((d) => `D${d.day}`),
              datasets: [{ data: dailyHistoryMock.map((d) => d[resource.kind as keyof typeof d] as number) }],
            }}
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
      </AnimatedSection>

      {/* Adjust buttons */}
      <AnimatedSection delay={180}>
        <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.lg }}>
          <ThemedText variant="caption" color="textMuted" style={{ letterSpacing: 2, marginBottom: spacing.sm }}>ADJUST</ThemedText>
          <View style={{ flexDirection: 'row', gap: spacing.xs }}>
            {[
              { delta: -10, label: '−10', bg: colors.danger + '20', text: colors.danger },
              { delta: -1, label: '−1', bg: colors.danger + '12', text: colors.danger },
              { delta: 1, label: '+1', bg: colors.success + '12', text: colors.success },
              { delta: 10, label: '+10', bg: colors.success + '20', text: colors.success },
            ].map(({ delta, label, bg, text }) => (
              <AnimatedPressable
                key={delta}
                onPress={() => adjustResource(resource.id, delta)}
                style={{ flex: 1, alignItems: 'center', paddingVertical: spacing.md, borderRadius: 6, backgroundColor: bg }}
              >
                <ThemedText style={{ fontWeight: '800', fontSize: 14, color: text }}>{label}</ThemedText>
              </AnimatedPressable>
            ))}
          </View>
        </View>
      </AnimatedSection>
    </ScrollView>
  );
}
