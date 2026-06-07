import { ScrollView, StyleSheet, Switch, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useResources } from '@/context/ResourcesContext';
import { useSimulation } from '@/context/SimulationContext';
import { ThemedText, ThemedView, SectionHeader } from '@/components';
import { spacing } from '@/theme/spacing';
import type { EventKind } from '@/types';

const EVENT_LABELS: Record<EventKind, string> = {
  eva: 'EVA (Extravehicular Activity)',
  'solar-storm': 'Solar Storm',
  supply: 'Supply Mission',
  maintenance: 'Maintenance',
  alert: 'System Alert',
};

const THEME_OPTIONS = [
  { key: 'system', label: 'AUTO' },
  { key: 'light', label: 'LIGHT' },
  { key: 'dark', label: 'DARK' },
] as const;

export default function SettingsScreen() {
  const { colors, preference, setPreference, toggle } = useTheme();
  const { resetToDefault } = useResources();
  const { config, toggleEvent, reset } = useSimulation();
  const router = useRouter();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.md, gap: spacing.lg, paddingBottom: spacing.xxl }}
    >
      <ThemedText variant="h1">SETTINGS</ThemedText>

      {/* Theme Section */}
      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 5, overflow: 'hidden' }}>
        <View style={{ padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <ThemedText variant="label" color="textMuted">DISPLAY</ThemedText>
        </View>

        <View style={{ padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <ThemedText variant="body" style={{ marginBottom: spacing.sm }}>Theme Mode</ThemedText>
          <View style={{ flexDirection: 'row', gap: spacing.xs }}>
            {THEME_OPTIONS.map((opt) => (
              <Pressable
                key={opt.key}
                onPress={() => setPreference(opt.key)}
                style={{
                  flex: 1,
                  paddingVertical: spacing.sm,
                  alignItems: 'center',
                  borderRadius: 3,
                  backgroundColor: preference === opt.key ? colors.primary : colors.surfaceAlt,
                  borderWidth: 1,
                  borderColor: preference === opt.key ? colors.primary : colors.border,
                }}
              >
                <ThemedText variant="label" style={{ color: preference === opt.key ? '#000' : colors.textMuted }}>
                  {opt.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md }}>
          <ThemedText variant="body">Dark Mode</ThemedText>
          <Switch
            value={preference === 'dark' || (preference === 'system' && false)}
            onValueChange={toggle}
            trackColor={{ true: colors.primary, false: colors.surfaceAlt }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Events Section */}
      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 5, overflow: 'hidden' }}>
        <View style={{ padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <ThemedText variant="label" color="textMuted">SIMULATION EVENTS</ThemedText>
        </View>
        {(Object.keys(EVENT_LABELS) as EventKind[]).map((kind, i) => (
          <View
            key={kind}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: spacing.md,
              borderBottomWidth: i < Object.keys(EVENT_LABELS).length - 1 ? 1 : 0,
              borderBottomColor: colors.border,
            }}
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
      </View>

      {/* Navigation */}
      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 5, overflow: 'hidden' }}>
        <View style={{ padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <ThemedText variant="label" color="textMuted">NAVIGATION</ThemedText>
        </View>
        <Pressable
          onPress={() => router.push('/simulation')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: spacing.md,
          }}
        >
          <ThemedText variant="body">Simulation</ThemedText>
          <ThemedText variant="caption" color="textMuted">CONFIGURE & RUN</ThemedText>
        </Pressable>
      </View>

      {/* Actions */}
      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 5, overflow: 'hidden' }}>
        <View style={{ padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <ThemedText variant="label" color="textMuted">DATA ACTIONS</ThemedText>
        </View>
        <Pressable
          onPress={resetToDefault}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <ThemedText variant="body" color="warning">Reset Resources</ThemedText>
        </Pressable>
        <Pressable
          onPress={reset}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: spacing.md,
          }}
        >
          <ThemedText variant="body" color="warning">Reset Simulation</ThemedText>
        </Pressable>
      </View>

      <ThemedText variant="caption" color="textDim" align="center" style={{ marginTop: spacing.md }}>
        LUNARBASE MANAGER v0.1.0{'\n'}GLOBAL SOLUTION 2026.1 - FIAP
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