import { useState, useEffect } from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay } from 'react-native-reanimated';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import { useSimulation } from '@/context/SimulationContext';
import { useSpaceWeather } from '@/context/SpaceWeatherContext';
import { useApi } from '@/context/ApiContext';
import { SimulationService } from '@/services';
import { ThemedText, FormField } from '@/components';
import { spacing } from '@/theme/spacing';
import { initialResources } from '@/data/mockData';

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

export default function SimulationScreen() {
  const { colors } = useTheme();
  const { config } = useSimulation();
  const { getEnergyModifier, getOxygenModifier } = useSpaceWeather();
  const { isOnline } = useApi();
  const router = useRouter();

  const [crew, setCrew] = useState(String(config.crewSize));
  const [days, setDays] = useState(String(config.days));
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ day: number; water: number; energy: number; oxygen: number; food: number } | null>(null);

  async function runSimulation() {
    const crewN = parseInt(crew, 10);
    const daysN = parseInt(days, 10);
    if (isNaN(crewN) || crewN < 1 || crewN > 20) return;
    if (isNaN(daysN) || daysN < 1 || daysN > 90) return;

    setRunning(true);
    setProgress(0);
    setResults(null);

    if (isOnline) {
      try {
        const sim = await SimulationService.create({ name: `Simulation ${new Date().toISOString()}`, crewSize: crewN, days: daysN });
        if (sim?.id) {
          const result = await SimulationService.run(sim.id);
          if (result?.finalResources) {
            setResults({ day: daysN, water: result.finalResources.water, energy: result.finalResources.energy, oxygen: result.finalResources.oxygen, food: result.finalResources.food });
            setRunning(false);
            return;
          }
        }
      } catch {
        // fallback to local simulation
      }
    }

    const current = {
      water: initialResources[0].current,
      energy: initialResources[1].current,
      oxygen: initialResources[2].current,
      food: initialResources[3].current,
    };

    for (let day = 1; day <= daysN; day++) {
      await new Promise((r) => setTimeout(r, 30));
      const base = {
        water: (initialResources[0].dailyConsumption * crewN) / 4,
        energy: (initialResources[1].dailyConsumption * crewN) / 4,
        oxygen: (initialResources[2].dailyConsumption * crewN) / 4,
        food: (initialResources[3].dailyConsumption * crewN) / 4,
      };

      const solarMod = getEnergyModifier();
      const oxygenMod = getOxygenModifier();

      current.water = Math.max(0, current.water - base.water + (config.activeEvents.includes('supply') && day % 7 === 0 ? 60 : 0));
      current.energy = Math.max(0, current.energy - base.energy + (config.activeEvents.includes('solar-storm') && day % 5 === 0 ? -30 : 0) - (base.energy * solarMod));
      current.oxygen = Math.max(0, current.oxygen - base.oxygen - (base.oxygen * oxygenMod));
      current.food = Math.max(0, current.food - base.food);

      setProgress(Math.round((day / daysN) * 100));
    }

    setResults({ day: daysN, ...current });
    setRunning(false);
  }

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
              <Ionicons name="close" size={22} color={colors.text} />
            </Pressable>
            <ThemedText variant="caption" color="textMuted" style={{ letterSpacing: 2 }}>CONSUMPTION MODEL</ThemedText>
          </View>
          <ThemedText style={{ fontSize: 28, fontWeight: '800', letterSpacing: -0.5 }}>Simulation</ThemedText>
          <ThemedText variant="caption" color="textMuted" style={{ marginTop: 4 }}>
            Configure parameters and run a day-by-day resource projection
          </ThemedText>
        </View>
      </AnimatedSection>

      <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.lg, gap: spacing.xl }}>
        {/* Parameters */}
        <AnimatedSection delay={60}>
          <View>
            <ThemedText variant="caption" color="textMuted" style={{ letterSpacing: 2, marginBottom: spacing.md }}>PARAMETERS</ThemedText>
            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              <View style={{ flex: 1 }}>
                <FormField label="Crew size" value={crew} onChangeText={setCrew} icon="people" keyboardType="numeric" placeholder="1–20" />
              </View>
              <View style={{ flex: 1 }}>
                <FormField label="Duration (days)" value={days} onChangeText={setDays} icon="calendar" keyboardType="numeric" placeholder="1–90" />
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm }}>
              <ThemedText variant="caption" color="textMuted">{config.activeEvents.length} events active</ThemedText>
              <Pressable onPress={() => router.push('/(tabs)/settings')}>
                <ThemedText variant="caption" style={{ color: colors.primary }}>configure →</ThemedText>
              </Pressable>
            </View>
          </View>
        </AnimatedSection>

        {/* Environmental modifiers */}
        <AnimatedSection delay={110}>
          <View style={{ flexDirection: 'row', gap: spacing.xl }}>
            <View>
              <ThemedText variant="caption" color="textMuted">solar impact</ThemedText>
              <ThemedText style={{ fontWeight: '700', fontSize: 14 }}>−{Math.round(getEnergyModifier() * 100)}% energy</ThemedText>
            </View>
            <View>
              <ThemedText variant="caption" color="textMuted">env. impact</ThemedText>
              <ThemedText style={{ fontWeight: '700', fontSize: 14 }}>−{Math.round(getOxygenModifier() * 100)}% O2</ThemedText>
            </View>
            {isOnline && (
              <View>
                <ThemedText variant="caption" color="textMuted">mode</ThemedText>
                <ThemedText style={{ fontWeight: '700', fontSize: 14, color: colors.success }}>SOA online</ThemedText>
              </View>
            )}
          </View>
        </AnimatedSection>

        {/* Run button */}
        <AnimatedSection delay={160}>
          <Pressable
            onPress={runSimulation}
            disabled={running}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.sm,
              backgroundColor: running ? colors.surfaceAlt : colors.primary,
              paddingVertical: spacing.lg,
              borderRadius: 6,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Ionicons name={running ? 'sync' : 'play'} size={18} color={running ? colors.textMuted : '#000'} />
            <ThemedText style={{ fontWeight: '800', fontSize: 14, color: running ? colors.textMuted : '#000', letterSpacing: 0.5 }}>
              {running ? `Running… ${progress}%` : 'Run Simulation'}
            </ThemedText>
          </Pressable>
        </AnimatedSection>

        {/* Progress bar */}
        {running && (
          <AnimatedSection delay={0}>
            <View style={{ gap: spacing.xs }}>
              <View style={{ height: 2, backgroundColor: colors.surfaceAlt, borderRadius: 1, overflow: 'hidden' }}>
                <View style={{ width: `${progress}%`, height: '100%', backgroundColor: colors.primary, borderRadius: 1 }} />
              </View>
              <ThemedText variant="caption" color="textMuted">
                Day {Math.round((progress / 100) * parseInt(days || '1', 10))} of {days}
              </ThemedText>
            </View>
          </AnimatedSection>
        )}

        {/* Results */}
        {results && !running && (
          <AnimatedSection delay={0}>
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md }}>
                <ThemedText variant="caption" color="textMuted" style={{ letterSpacing: 2 }}>RESULTS</ThemedText>
                <ThemedText variant="caption" color="textMuted">after day {results.day}</ThemedText>
              </View>
              {[
                { label: 'Water', value: results.water, unit: 'L' },
                { label: 'Energy', value: results.energy, unit: 'kWh' },
                { label: 'Oxygen', value: results.oxygen, unit: 'kg' },
                { label: 'Food', value: results.food, unit: 'kg' },
              ].map((item) => {
                const pct = item.value / (item.label === 'Water' ? 1000 : item.label === 'Energy' ? 5000 : item.label === 'Oxygen' ? 500 : 300);
                const low = pct < 0.2;
                return (
                  <View key={item.label} style={{ paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                      <ThemedText style={{ fontWeight: '600', fontSize: 15 }}>{item.label}</ThemedText>
                      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3 }}>
                        <ThemedText style={{ fontSize: 24, fontWeight: '800', color: low ? colors.warning : colors.text, lineHeight: 26 }}>
                          {item.value.toFixed(0)}
                        </ThemedText>
                        <ThemedText variant="caption" color="textMuted" style={{ marginBottom: 3 }}>{item.unit}</ThemedText>
                      </View>
                    </View>
                    <View style={{ height: 2, backgroundColor: colors.surfaceAlt, borderRadius: 1 }}>
                      <View style={{ width: `${Math.min(pct * 100, 100)}%`, height: '100%', borderRadius: 1, backgroundColor: low ? colors.warning : colors.primary }} />
                    </View>
                  </View>
                );
              })}
            </View>
          </AnimatedSection>
        )}
      </View>
    </ScrollView>
  );
}
