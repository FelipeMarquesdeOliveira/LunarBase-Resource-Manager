import { useEffect, useState, useRef } from 'react';
import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { useResources } from '@/context/ResourcesContext';
import { ThemedText, CriticalityBadge, ProgressBar, SectionHeader, PrimaryButton } from '@/components';
import { spacing } from '@/theme/spacing';
import { classify, autonomyDays, kindLabel } from '@/utils/criticality';
import { formatNumber, formatDate } from '@/utils/format';
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

function AnimatedPressable({ onPress, children, style }: { onPress: () => void; children: React.ReactNode; style?: any }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePressIn() {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 400 });
  }

  function handlePressOut() {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={style}
    >
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Pressable>
  );
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
        <Ionicons name="alert-circle" size={64} color={colors.danger} />
        <ThemedText variant="h2" align="center" style={{ marginTop: spacing.lg }}>RESOURCE NOT FOUND</ThemedText>
        <PrimaryButton title="GO BACK" onPress={() => router.back()} />
      </View>
    );
  }

  const crit = classify(resource);
  const autonomy = autonomyDays(resource);
  const ratio = resource.capacity > 0 ? resource.current / resource.capacity : 0;
  const tone = kindColor[resource.kind] || colors.primary;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xxl }}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm }}>
        <Pressable onPress={() => router.back()} style={{ padding: spacing.xs }}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <ThemedText variant="label" color="textMuted">{kindLabel[resource.kind].toUpperCase()}</ThemedText>
          <ThemedText variant="h1">{resource.name}</ThemedText>
        </View>
        <CriticalityBadge level={crit} />
      </View>

      {/* Big Numbers */}
      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 5, padding: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm }}>
          <ThemedText variant="dataLarge" style={{ color: tone }}>{formatNumber(resource.current)}</ThemedText>
          <ThemedText variant="caption" color="textMuted" style={{ marginBottom: 6 }}>/ {formatNumber(resource.capacity, 0)} {resource.unit}</ThemedText>
        </View>
        <ProgressBar value={ratio} color={tone} height={6} showLabel />
      </View>

      {/* Metrics Grid */}
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <View style={[styles.metricBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <ThemedText variant="label" color="textMuted">AUTONOMY</ThemedText>
          <ThemedText variant="data" style={{ color: autonomy < 5 ? colors.warning : colors.success }}>
            {Number.isFinite(autonomy) ? `${autonomy.toFixed(0)}d` : '--'}
          </ThemedText>
        </View>
        <View style={[styles.metricBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <ThemedText variant="label" color="textMuted">CONSUMPTION</ThemedText>
          <ThemedText variant="data">{resource.dailyConsumption}</ThemedText>
          <ThemedText variant="caption" color="textMuted">{resource.unit}/day</ThemedText>
        </View>
        <View style={[styles.metricBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <ThemedText variant="label" color="textMuted">UPDATED</ThemedText>
          <ThemedText variant="caption" style={{ fontFamily: undefined }}>{formatDate(resource.updatedAt).split('/')[0]}</ThemedText>
        </View>
      </View>

      {/* Chart */}
      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 5, padding: spacing.md }}>
        <SectionHeader title="HISTORY" subtitle="7-DAY TREND" dense />
        <LineChart
          data={{
            labels: dailyHistoryMock.map((d) => `D${d.day}`),
            datasets: [{ data: dailyHistoryMock.map((d) => d[resource.kind as keyof typeof d] as number) }],
          }}
          width={W - spacing.md * 4}
          height={120}
          chartConfig={{
            backgroundColor: colors.surface,
            backgroundGradientFrom: colors.surface,
            backgroundGradientTo: colors.surface,
            decimalPlaces: 0,
            color: () => tone,
            labelColor: () => colors.textMuted,
            propsForBackgroundLines: { stroke: colors.chart.grid, strokeDasharray: '' },
            propsForLabels: { fontSize: 10 },
          }}
          bezier={false}
          style={{ marginLeft: -spacing.sm }}
        />
      </View>

      {/* Source */}
      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 5, padding: spacing.md }}>
        <ThemedText variant="label" color="textMuted">SOURCE / ORIGIN</ThemedText>
        <ThemedText variant="body" style={{ marginTop: spacing.xs }}>{resource.source}</ThemedText>
      </View>

      {/* Actions with animations */}
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <AnimatedPressable
          onPress={() => adjustResource(resource.id, -10)}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.sm,
            backgroundColor: colors.danger,
            paddingVertical: spacing.md,
            borderRadius: 5,
          }}
        >
          <Ionicons name="remove" size={20} color="#fff" />
          <ThemedText variant="body" style={{ color: '#fff', fontWeight: '700' }}>-10</ThemedText>
        </AnimatedPressable>

        <AnimatedPressable
          onPress={() => adjustResource(resource.id, -1)}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.sm,
            backgroundColor: colors.warning,
            paddingVertical: spacing.md,
            borderRadius: 5,
          }}
        >
          <Ionicons name="remove" size={18} color="#fff" />
          <ThemedText variant="body" style={{ color: '#fff', fontWeight: '700' }}>-1</ThemedText>
        </AnimatedPressable>

        <AnimatedPressable
          onPress={() => adjustResource(resource.id, 1)}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.sm,
            backgroundColor: colors.success,
            paddingVertical: spacing.md,
            borderRadius: 5,
          }}
        >
          <Ionicons name="add" size={18} color="#fff" />
          <ThemedText variant="body" style={{ color: '#fff', fontWeight: '700' }}>+1</ThemedText>
        </AnimatedPressable>

        <AnimatedPressable
          onPress={() => adjustResource(resource.id, 10)}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.sm,
            backgroundColor: colors.primary,
            paddingVertical: spacing.md,
            borderRadius: 5,
          }}
        >
          <Ionicons name="add" size={20} color="#000" />
          <ThemedText variant="body" style={{ color: '#000', fontWeight: '700' }}>+10</ThemedText>
        </AnimatedPressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  metricBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    padding: spacing.sm,
  },
});