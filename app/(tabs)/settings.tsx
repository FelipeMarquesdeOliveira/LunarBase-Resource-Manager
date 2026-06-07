import { ScrollView, Switch, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useResources } from '@/context/ResourcesContext';
import { useSimulation } from '@/context/SimulationContext';
import { useApi } from '@/context/ApiContext';
import { AnimatedCard, AnimatedPressable, ThemedText } from '@/components';
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
  const { colors, preference, setPreference } = useTheme();
  const { resetToDefault } = useResources();
  const { config, toggleEvent, reset } = useSimulation();
  const { apiUrl, isOnline, checkConnection } = useApi();
  const router = useRouter();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.md, gap: spacing.lg, paddingBottom: spacing.xxl }}
    >
      <AnimatedCard delay={0}>
        <ThemedText variant="h1">SETTINGS</ThemedText>
      </AnimatedCard>

      {/* Theme Section */}
      <AnimatedCard delay={50}>
        <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 5, overflow: 'hidden' }}>
          <View style={{ padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <ThemedText variant="label" color="textMuted">DISPLAY</ThemedText>
          </View>

          <View style={{ padding: spacing.md }}>
            <ThemedText variant="body" style={{ marginBottom: spacing.sm }}>Theme Mode</ThemedText>
            <View style={{ flexDirection: 'row', gap: spacing.xs }}>
              {THEME_OPTIONS.map((opt) => (
                <AnimatedPressable
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
                </AnimatedPressable>
              ))}
            </View>
          </View>
        </View>
      </AnimatedCard>

      {/* Events Section */}
      <AnimatedCard delay={100}>
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
      </AnimatedCard>

      {/* API / SOA Integration */}
      <AnimatedCard delay={150}>
        <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 5, overflow: 'hidden' }}>
          <View style={{ padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <ThemedText variant="label" color="textMuted">SOA WEB SERVICES</ThemedText>
          </View>
          <View style={{ padding: spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
              <ThemedText variant="body">API Connection</ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: isOnline ? colors.success : colors.danger }} />
                <ThemedText variant="caption" style={{ color: isOnline ? colors.success : colors.danger }}>
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </ThemedText>
              </View>
            </View>
            <ThemedText variant="caption" color="textMuted">URL: {apiUrl}</ThemedText>
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
              <AnimatedPressable
                onPress={checkConnection}
                style={{
                  flex: 1,
                  paddingVertical: spacing.sm,
                  alignItems: 'center',
                  borderRadius: 3,
                  backgroundColor: colors.primary,
                }}
              >
                <ThemedText variant="label" style={{ color: '#000' }}>TEST CONNECTION</ThemedText>
              </AnimatedPressable>
            </View>
            <ThemedText variant="caption" color="textMuted" style={{ marginTop: spacing.sm }}>
              SOA Services: ResourceService (5001), EventService (5003), SpaceIntegration (5005)
            </ThemedText>
          </View>
        </View>
      </AnimatedCard>

      {/* Navigation */}
      <AnimatedCard delay={200}>
        <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 5, overflow: 'hidden' }}>
          <View style={{ padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <ThemedText variant="label" color="textMuted">NAVIGATION</ThemedText>
          </View>
          <AnimatedPressable
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
          </AnimatedPressable>
        </View>
      </AnimatedCard>

      {/* Actions */}
      <AnimatedCard delay={250}>
        <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 5, overflow: 'hidden' }}>
          <View style={{ padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <ThemedText variant="label" color="textMuted">DATA ACTIONS</ThemedText>
          </View>
          <AnimatedPressable
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
          </AnimatedPressable>
          <AnimatedPressable
            onPress={reset}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: spacing.md,
            }}
          >
            <ThemedText variant="body" color="warning">Reset Simulation</ThemedText>
          </AnimatedPressable>
        </View>
      </AnimatedCard>

      <AnimatedCard delay={300}>
        <ThemedText variant="caption" color="textDim" align="center" style={{ marginTop: spacing.md }}>
          LUNARBASE MANAGER v0.1.0{'\n'}GLOBAL SOLUTION 2026.1 - FIAP
        </ThemedText>
      </AnimatedCard>
    </ScrollView>
  );
}