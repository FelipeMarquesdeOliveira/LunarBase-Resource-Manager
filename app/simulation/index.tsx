import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useSimulation } from '@/context/SimulationContext';
import { useResources } from '@/context/ResourcesContext';
import { ThemedText, ThemedView, FormField, PrimaryButton, SectionHeader } from '@/components';
import { spacing } from '@/theme/spacing';
import { dailyHistoryMock, initialResources } from '@/data/mockData';

export default function SimulationScreen() {
  const { colors } = useTheme();
  const { config, updateConfig } = useSimulation();
  const { resources } = useResources();
  const router = useRouter();

  const [crew, setCrew] = useState(String(config.crewSize));
  const [days, setDays] = useState(String(config.days));
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ day: number; water: number; energy: number; oxygen: number; food: number }[]>([]);

  async function runSimulation() {
    const crewN = parseInt(crew, 10);
    const daysN = parseInt(days, 10);
    if (isNaN(crewN) || crewN < 1 || crewN > 20) return;
    if (isNaN(daysN) || daysN < 1 || daysN > 90) return;

    setRunning(true);
    setProgress(0);
    setResults([]);

    const out: typeof results = [];
    const current = {
      water: initialResources[0].current,
      energy: initialResources[1].current,
      oxygen: initialResources[2].current,
      food: initialResources[3].current,
    };

    for (let day = 1; day <= daysN; day++) {
      await new Promise((r) => setTimeout(r, 50));
      const consumption = {
        water: (initialResources[0].dailyConsumption * crewN) / 4,
        energy: (initialResources[1].dailyConsumption * crewN) / 4,
        oxygen: (initialResources[2].dailyConsumption * crewN) / 4,
        food: (initialResources[3].dailyConsumption * crewN) / 4,
      };

      current.water = Math.max(0, current.water - consumption.water + (config.activeEvents.includes('supply') && day % 7 === 0 ? 60 : 0));
      current.energy = Math.max(0, current.energy - consumption.energy + (config.activeEvents.includes('solar-storm') && day % 5 === 0 ? -30 : 0));
      current.oxygen = Math.max(0, current.oxygen - consumption.oxygen);
      current.food = Math.max(0, current.food - consumption.food);

      out.push({ day, ...current });
      setProgress(Math.round((day / daysN) * 100));
    }

    setResults(out);
    setRunning(false);
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxxl }}
    >
      <View style={styles.header}>
        <Ionicons name="rocket" size={32} color={colors.primary} />
        <ThemedText variant="h1">Simulacao</ThemedText>
      </View>

      <ThemedText variant="body" color="textMuted">
        Configure os parametros e simule o consumo de recursos da base lunar ao longo do tempo
      </ThemedText>

      <ThemedView variant="surface" padded="lg" rounded="lg" bordered>
        <SectionHeader title="Parametros" />
        <View style={styles.row}>
          <FormField
            label="Tamanho da tripulacao"
            value={crew}
            onChangeText={setCrew}
            icon="people"
            keyboardType="numeric"
            placeholder="1-20"
          />
          <FormField
            label="Duracao (dias)"
            value={days}
            onChangeText={setDays}
            icon="calendar"
            keyboardType="numeric"
            placeholder="1-90"
          />
        </View>
        <View style={styles.activeRow}>
          <ThemedText variant="caption" color="textMuted">
            Eventos ativos: {config.activeEvents.length}
          </ThemedText>
          <ThemedText variant="caption" color="primary" onPress={() => router.push('/(tabs)/settings')}>
            Alterar
          </ThemedText>
        </View>
      </ThemedView>

      <View style={styles.actions}>
        <PrimaryButton
          title={running ? `Executando... ${progress}%` : 'Executar Simulacao'}
          onPress={runSimulation}
          variant="primary"
          loading={running}
          disabled={running}
          icon={<Ionicons name="play" size={18} color={colors.background} />}
          fullWidth
        />
      </View>

      {running && (
        <ThemedView variant="surface" padded="lg" rounded="lg" align="center">
          <Ionicons name="sync" size={48} color={colors.primary} />
          <ThemedText variant="body" style={{ marginTop: spacing.md }}>
            Simulando dia {Math.round((progress / 100) * parseInt(days, 10))} de {days}...
          </ThemedText>
          <View style={[styles.progressBar, { backgroundColor: colors.surfaceAlt }]}>
            <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.primary }]} />
          </View>
        </ThemedView>
      )}

      {results.length > 0 && !running && (
        <>
          <SectionHeader title="Resultados" subtitle={`Simulacao de ${results.length} dias`} />
          <ThemedView variant="surface" padded="lg" rounded="lg" bordered>
            {results.slice(-1).map((r) => (
              <View key="final">
                <ThemedText variant="h3">Estado Final (Dia {r.day})</ThemedText>
                <View style={styles.resultRow}>
                  <ThemedText variant="body" color="textMuted">Agua:</ThemedText>
                  <ThemedText variant="h3" color={r.water < 50 ? 'warning' : 'success'}>{r.water.toFixed(1)} L</ThemedText>
                </View>
                <View style={styles.resultRow}>
                  <ThemedText variant="body" color="textMuted">Energia:</ThemedText>
                  <ThemedText variant="h3" color={r.energy < 30 ? 'warning' : 'success'}>{r.energy.toFixed(1)} kWh</ThemedText>
                </View>
                <View style={styles.resultRow}>
                  <ThemedText variant="body" color="textMuted">Oxigenio:</ThemedText>
                  <ThemedText variant="h3" color={r.oxygen < 10 ? 'warning' : 'success'}>{r.oxygen.toFixed(1)} kg</ThemedText>
                </View>
                <View style={styles.resultRow}>
                  <ThemedText variant="body" color="textMuted">Alimentos:</ThemedText>
                  <ThemedText variant="h3" color={r.food < 20 ? 'warning' : 'success'}>{r.food.toFixed(1)} kg</ThemedText>
                </View>
              </View>
            ))}
          </ThemedView>

          <ThemedView variant="surface" padded="lg" rounded="lg" align="center">
            <Ionicons name="checkmark-circle" size={48} color={colors.success} />
            <ThemedText variant="h3" align="center" style={{ marginTop: spacing.md }}>
              Simulacao concluida
            </ThemedText>
            <ThemedText variant="body" color="textMuted" align="center">
              Verifique os recursos finais. Se algum estiver em nivel critico, considere agendar reabastecimento.
            </ThemedText>
          </ThemedView>
        </>
      )}

      <PrimaryButton title="Voltar" onPress={() => router.back()} variant="ghost" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  row: { flexDirection: 'row', gap: spacing.md },
  activeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
  actions: { gap: spacing.md },
  progressBar: { width: '100%', height: 8, borderRadius: 999, marginTop: spacing.md, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999 },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.1)' },
});