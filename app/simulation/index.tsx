import { useState } from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useSimulation } from '@/context/SimulationContext';
import { ThemedText, FormField, SectionHeader, PrimaryButton } from '@/components';
import { spacing } from '@/theme/spacing';
import { initialResources } from '@/data/mockData';

export default function SimulationScreen() {
  const { colors } = useTheme();
  const { config } = useSimulation();
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

      current.water = Math.max(0, current.water - base.water + (config.activeEvents.includes('supply') && day % 7 === 0 ? 60 : 0));
      current.energy = Math.max(0, current.energy - base.energy + (config.activeEvents.includes('solar-storm') && day % 5 === 0 ? -30 : 0));
      current.oxygen = Math.max(0, current.oxygen - base.oxygen);
      current.food = Math.max(0, current.food - base.food);

      setProgress(Math.round((day / daysN) * 100));
    }

    setResults({ day: daysN, ...current });
    setRunning(false);
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xxl }}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm }}>
        <Pressable onPress={() => router.back()} style={{ padding: spacing.xs }}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
        <ThemedText variant="h1">SIMULATION</ThemedText>
      </View>

      <ThemedText variant="caption" color="textMuted">Configure parameters and run consumption simulation</ThemedText>

      {/* Parameters */}
      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 5, padding: spacing.md }}>
        <SectionHeader title="PARAMETERS" dense />
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <View style={{ flex: 1 }}>
            <FormField label="CREW SIZE" value={crew} onChangeText={setCrew} icon="people" keyboardType="numeric" placeholder="1-20" />
          </View>
          <View style={{ flex: 1 }}>
            <FormField label="DURATION (DAYS)" value={days} onChangeText={setDays} icon="calendar" keyboardType="numeric" placeholder="1-90" />
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm }}>
          <ThemedText variant="caption" color="textMuted">Active events: {config.activeEvents.length}</ThemedText>
          <ThemedText variant="caption" color="primary" onPress={() => router.push('/(tabs)/settings')}>CONFIGURE</ThemedText>
        </View>
      </View>

      {/* Run Button */}
      <Pressable
        onPress={runSimulation}
        disabled={running}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.md,
          backgroundColor: running ? colors.surfaceAlt : colors.primary,
          paddingVertical: spacing.md,
          borderRadius: 5,
        }}
      >
        <Ionicons name={running ? 'sync' : 'play'} size={18} color={running ? colors.textMuted : '#000'} />
        <ThemedText variant="body" style={{ color: running ? colors.textMuted : '#000', fontWeight: '700' }}>
          {running ? `RUNNING... ${progress}%` : 'RUN SIMULATION'}
        </ThemedText>
      </Pressable>

      {/* Progress */}
      {running && (
        <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 5, padding: spacing.md }}>
          <ThemedText variant="label" color="textMuted">PROGRESS</ThemedText>
          <View style={{ height: 6, backgroundColor: colors.surfaceAlt, borderRadius: 3, marginTop: spacing.sm, overflow: 'hidden' }}>
            <View style={{ width: `${progress}%`, height: '100%', backgroundColor: colors.primary, borderRadius: 3 }} />
          </View>
          <ThemedText variant="caption" color="textMuted" style={{ marginTop: spacing.xs }}>
            Simulating day {Math.round((progress / 100) * parseInt(days || '1', 10))} of {days}...
          </ThemedText>
        </View>
      )}

      {/* Results */}
      {results && !running && (
        <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 5, padding: spacing.md }}>
          <SectionHeader title={`FINAL STATE - DAY ${results.day}`} dense />
          {[
            { label: 'H2O (WATER)', value: results.water, unit: 'L', color: colors.chart.water },
            { label: 'PWR (ENERGY)', value: results.energy, unit: 'kWh', color: colors.chart.energy },
            { label: 'O2 (OXYGEN)', value: results.oxygen, unit: 'kg', color: colors.chart.oxygen },
            { label: 'FOOD', value: results.food, unit: 'kg', color: colors.chart.food },
          ].map((item) => (
            <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <ThemedText variant="label" color="textMuted">{item.label}</ThemedText>
              <ThemedText variant="data" style={{ color: item.color }}>
                {item.value.toFixed(1)}
                <ThemedText variant="caption" color="textMuted"> {item.unit}</ThemedText>
              </ThemedText>
            </View>
          ))}
        </View>
      )}

      <PrimaryButton title="BACK" onPress={() => router.back()} variant="ghost" />
    </ScrollView>
  );
}