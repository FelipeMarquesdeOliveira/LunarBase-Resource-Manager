import { ScrollView, StyleSheet, Switch, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useResources } from '@/context/ResourcesContext';
import { useSimulation } from '@/context/SimulationContext';
import { ThemedText, ThemedView, SectionHeader } from '@/components';
import { spacing, radius } from '@/theme/spacing';
import type { EventKind } from '@/types';

const EVENT_LABELS: Record<EventKind, string> = {
  eva: 'EVA (Atividade extraveicular)',
  'solar-storm': 'Tempestade solar',
  supply: 'Reabastecimento orbital',
  maintenance: 'Manutencao programada',
  alert: 'Alertas de emergencia',
};

export default function SettingsScreen() {
  const { colors, preference, setPreference, toggle } = useTheme();
  const { resetToDefault } = useResources();
  const { config, toggleEvent, reset } = useSimulation();
  const router = useRouter();

  const rows: { label: string; onPress?: () => void; right?: React.ReactNode; danger?: boolean }[] = [
    {
      label: 'Tema',
      right: (
        <View style={styles.themeRow}>
          {(['system', 'light', 'dark'] as const).map((p) => (
            <Pressable
              key={p}
              onPress={() => setPreference(p)}
              style={[
                styles.themeBtn,
                { backgroundColor: preference === p ? colors.primary : colors.surfaceAlt },
              ]}
            >
              <ThemedText
                variant="caption"
                style={{ color: preference === p ? colors.background : colors.textMuted }}
              >
                {p === 'system' ? 'Auto' : p === 'light' ? 'Claro' : 'Escuro'}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      ),
    },
    {
      label: 'Modo escuro',
      onPress: toggle,
      right: (
        <Switch
          value={preference === 'dark' || (preference === 'system' && false)}
          onValueChange={toggle}
          trackColor={{ true: colors.primary, false: colors.surfaceAlt }}
          thumbColor="#fff"
        />
      ),
    },
    { label: 'Simulacao', onPress: () => router.push('/simulation'), right: <Ionicons name="chevron-forward" size={20} color={colors.textMuted} /> },
    { label: 'Reiniciar recursos', onPress: resetToDefault, danger: true },
    { label: 'Resetar simulacao', onPress: reset, danger: true },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxxl }}
    >
      <ThemedText variant="h1">Ajustes</ThemedText>

      <SectionHeader title="Aparencia" subtitle="Tema e modo escuro" />
      <ThemedView variant="surface" rounded="lg" bordered>
        {rows.slice(0, 2).map((row, i) => (
          <Pressable
            key={row.label}
            onPress={row.onPress}
            style={[styles.row, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }]}
          >
            <ThemedText variant="body">{row.label}</ThemedText>
            {row.right}
          </Pressable>
        ))}
      </ThemedView>

      <SectionHeader title="Eventos da Simulacao" subtitle="Ative ou desative eventos" />
      <ThemedView variant="surface" rounded="lg" bordered>
        {(Object.keys(EVENT_LABELS) as EventKind[]).map((kind, i) => (
          <View
            key={kind}
            style={[styles.row, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }]}
          >
            <ThemedText variant="body">{EVENT_LABELS[kind]}</ThemedText>
            <Switch
              value={config.activeEvents.includes(kind)}
              onValueChange={() => toggleEvent(kind)}
              trackColor={{ true: colors.primary, false: colors.surfaceAlt }}
              thumbColor="#fff"
            />
          </View>
        ))}
      </ThemedView>

      <SectionHeader title="Navegacao" subtitle="Ir para telas especificas" />
      <ThemedView variant="surface" rounded="lg" bordered>
        {rows.slice(2, 3).map((row, i) => (
          <Pressable
            key={row.label}
            onPress={row.onPress}
            style={[styles.row, { borderTopWidth: i > 0 ? StyleSheet.hairlineWidth : 0, borderTopColor: colors.border }]}
          >
            <ThemedText variant="body">{row.label}</ThemedText>
            {row.right}
          </Pressable>
        ))}
      </ThemedView>

      <SectionHeader title="Acoes" subtitle="Resetar dados" />
      <ThemedView variant="surface" rounded="lg" bordered>
        {rows.slice(3).map((row, i) => (
          <Pressable
            key={row.label}
            onPress={row.onPress}
            style={[styles.row, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }]}
          >
            <ThemedText variant="body" color={row.danger ? 'danger' : 'text'}>
              {row.label}
            </ThemedText>
            <Ionicons name="refresh" size={18} color={row.danger ? colors.danger : colors.textMuted} />
          </Pressable>
        ))}
      </ThemedView>

      <ThemedText variant="caption" color="textMuted" align="center" style={{ marginTop: spacing.lg }}>
        LunarBase Resource Manager{'\n'}Global Solution 2026.1 - FIAP
      </ThemedText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  themeRow: { flexDirection: 'row', gap: 4 },
  themeBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
});