import { ScrollView, Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
  { key: 'system', label: 'Auto' },
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' },
] as const;

export default function SettingsScreen() {
  const { colors, preference, setPreference } = useTheme();
  const { resetToDefault } = useResources();
  const { config, toggleEvent, reset } = useSimulation();
  const { apiUrl, isOnline, checkConnection } = useApi();
  const router = useRouter();

  const s = (delay: number) => ({ delay });

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: spacing.xxl }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header — no card, just typography */}
      <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.lg, paddingBottom: spacing.xl, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <ThemedText variant="caption" color="textMuted" style={{ letterSpacing: 2, marginBottom: 4 }}>LUNARBASE</ThemedText>
        <ThemedText style={{ fontSize: 30, fontWeight: '800', letterSpacing: -0.5 }}>Settings</ThemedText>
      </View>

      <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.lg, gap: spacing.xxl }}>
        {/* Display */}
        <AnimatedCard delay={40}>
          <View>
            <ThemedText variant="caption" color="textMuted" style={{ letterSpacing: 2, marginBottom: spacing.md }}>DISPLAY</ThemedText>
            <View style={{ flexDirection: 'row', gap: spacing.xs }}>
              {THEME_OPTIONS.map((opt) => (
                <AnimatedPressable
                  key={opt.key}
                  onPress={() => setPreference(opt.key)}
                  style={{
                    flex: 1,
                    paddingVertical: spacing.sm + 2,
                    alignItems: 'center',
                    borderRadius: 6,
                    backgroundColor: preference === opt.key ? colors.primary : colors.surface,
                    borderWidth: 1,
                    borderColor: preference === opt.key ? colors.primary : colors.border,
                  }}
                >
                  <ThemedText
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: preference === opt.key ? '#000' : colors.textMuted,
                    }}
                  >
                    {opt.label}
                  </ThemedText>
                </AnimatedPressable>
              ))}
            </View>
          </View>
        </AnimatedCard>

        {/* Simulation Events */}
        <AnimatedCard delay={90}>
          <View>
            <ThemedText variant="caption" color="textMuted" style={{ letterSpacing: 2, marginBottom: spacing.md }}>SIMULATION EVENTS</ThemedText>
            <View style={{ backgroundColor: colors.surface, borderRadius: 6, overflow: 'hidden' }}>
              {(Object.keys(EVENT_LABELS) as EventKind[]).map((kind, i, arr) => (
                <View
                  key={kind}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm + 2,
                    borderBottomWidth: i < arr.length - 1 ? 1 : 0,
                    borderBottomColor: colors.border,
                  }}
                >
                  <ThemedText style={{ fontSize: 14 }}>{EVENT_LABELS[kind]}</ThemedText>
                  <Switch
                    value={config.activeEvents.includes(kind)}
                    onValueChange={() => toggleEvent(kind)}
                    trackColor={{ true: colors.primary, false: colors.surfaceAlt }}
                    thumbColor="#fff"
                  />
                </View>
              ))}
            </View>
          </View>
        </AnimatedCard>

        {/* SOA Web Services */}
        <AnimatedCard delay={140}>
          <View>
            <ThemedText variant="caption" color="textMuted" style={{ letterSpacing: 2, marginBottom: spacing.md }}>SOA WEB SERVICES</ThemedText>
            <View style={{ backgroundColor: colors.surface, borderRadius: 6, padding: spacing.md, gap: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <ThemedText style={{ fontSize: 14, fontWeight: '600' }}>API Connection</ThemedText>
                  <ThemedText variant="caption" color="textMuted">{apiUrl}</ThemedText>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: isOnline ? colors.success : colors.danger }} />
                  <ThemedText style={{ color: isOnline ? colors.success : colors.danger, fontSize: 12, fontWeight: '700' }}>
                    {isOnline ? 'ONLINE' : 'OFFLINE'}
                  </ThemedText>
                </View>
              </View>
              <AnimatedPressable
                onPress={checkConnection}
                style={{
                  paddingVertical: spacing.sm + 2,
                  alignItems: 'center',
                  borderRadius: 6,
                  backgroundColor: colors.primary,
                }}
              >
                <ThemedText style={{ color: '#000', fontWeight: '700', fontSize: 13 }}>Test Connection</ThemedText>
              </AnimatedPressable>
              <ThemedText variant="caption" color="textMuted">
                ResourceService · EventService · SpaceIntegration
              </ThemedText>
            </View>
          </View>
        </AnimatedCard>

        {/* Navigation */}
        <AnimatedCard delay={180}>
          <View>
            <ThemedText variant="caption" color="textMuted" style={{ letterSpacing: 2, marginBottom: spacing.md }}>NAVIGATION</ThemedText>
            <View style={{ backgroundColor: colors.surface, borderRadius: 6, overflow: 'hidden' }}>
              <AnimatedPressable
                onPress={() => router.push('/simulation')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.sm,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.md,
                }}
              >
                <Ionicons name="play-circle-outline" size={20} color={colors.primary} />
                <ThemedText style={{ fontSize: 14 }}>Simulation</ThemedText>
                <View style={{ flex: 1 }} />
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </AnimatedPressable>
            </View>
          </View>
        </AnimatedCard>

        {/* Data actions */}
        <AnimatedCard delay={220}>
          <View>
            <ThemedText variant="caption" color="textMuted" style={{ letterSpacing: 2, marginBottom: spacing.md }}>DATA</ThemedText>
            <View style={{ backgroundColor: colors.surface, borderRadius: 6, overflow: 'hidden' }}>
              <AnimatedPressable
                onPress={resetToDefault}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.sm,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.md,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <Ionicons name="refresh-outline" size={18} color={colors.warning} />
                <ThemedText style={{ color: colors.warning, fontSize: 14 }}>Reset Resources</ThemedText>
              </AnimatedPressable>
              <AnimatedPressable
                onPress={reset}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.sm,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.md,
                }}
              >
                <Ionicons name="refresh-outline" size={18} color={colors.warning} />
                <ThemedText style={{ color: colors.warning, fontSize: 14 }}>Reset Simulation</ThemedText>
              </AnimatedPressable>
            </View>
          </View>
        </AnimatedCard>

        {/* Footer */}
        <AnimatedCard delay={280}>
          <ThemedText variant="caption" color="textDim" align="center">
            LunarBase Manager v0.1.0{'\n'}Global Solution 2026.1 · FIAP
          </ThemedText>
        </AnimatedCard>
      </View>
    </ScrollView>
  );
}
