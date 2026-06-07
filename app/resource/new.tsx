import { useState } from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay } from 'react-native-reanimated';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import { useResources } from '@/context/ResourcesContext';
import { ThemedText, FormField, SectionHeader, PrimaryButton } from '@/components';
import { spacing } from '@/theme/spacing';
import type { ResourceKind, FormErrors } from '@/types';

const KINDS: { label: string; value: ResourceKind; color: string }[] = [
  { label: 'H2O', value: 'water', color: '#3498DB' },
  { label: 'PWR', value: 'energy', color: '#E8A838' },
  { label: 'O2', value: 'oxygen', color: '#2ECC71' },
  { label: 'FOOD', value: 'food', color: '#9B59B6' },
];

function AnimatedSection({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: any }) {
  const isFocused = useIsFocused();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  useEffect(() => {
    if (isFocused) {
      opacity.value = withDelay(delay, withSpring(1, { damping: 18, stiffness: 180 }));
      translateY.value = withDelay(delay, withSpring(0, { damping: 18, stiffness: 180 }));
    } else {
      opacity.value = 0;
      translateY.value = 10;
    }
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
}

import { useEffect } from 'react';

export default function NewResourceScreen() {
  const { colors } = useTheme();
  const { upsertResource } = useResources();
  const router = useRouter();

  const [name, setName] = useState('');
  const [kind, setKind] = useState<ResourceKind>('water');
  const [unit, setUnit] = useState('');
  const [current, setCurrent] = useState('');
  const [capacity, setCapacity] = useState('');
  const [dailyConsumption, setDailyConsumption] = useState('');
  const [source, setSource] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): boolean {
    const e: FormErrors = {};
    if (!name.trim()) e.name = 'Required';
    if (!unit.trim()) e.unit = 'Required';
    const c = parseFloat(current);
    if (isNaN(c) || c < 0) e.current = 'Invalid value';
    const cap = parseFloat(capacity);
    if (isNaN(cap) || cap <= 0) e.capacity = 'Invalid capacity';
    if (!isNaN(c) && !isNaN(cap) && c > cap) e.current = 'Exceeds capacity';
    const dc = parseFloat(dailyConsumption);
    if (isNaN(dc) || dc < 0) e.dailyConsumption = 'Invalid consumption';
    if (!source.trim()) e.source = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    upsertResource({
      id: `res-${Date.now()}`,
      kind,
      name: name.trim(),
      unit: unit.trim(),
      current: parseFloat(current),
      capacity: parseFloat(capacity),
      dailyConsumption: parseFloat(dailyConsumption),
      source: source.trim(),
      updatedAt: new Date().toISOString(),
    });
    router.back();
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xxl }}
    >
      {/* Header */}
      <AnimatedSection delay={0}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm }}>
          <Pressable onPress={() => router.back()} style={{ padding: spacing.xs }}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
          <ThemedText variant="h1">NEW RESOURCE</ThemedText>
        </View>
      </AnimatedSection>

      {/* Kind Selector */}
      <AnimatedSection delay={50}>
        <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 5, padding: spacing.md }}>
          <ThemedText variant="label" color="textMuted" style={{ marginBottom: spacing.sm }}>RESOURCE TYPE</ThemedText>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            {KINDS.map((k) => (
              <Pressable
                key={k.value}
                onPress={() => setKind(k.value)}
                style={{
                  flex: 1,
                  paddingVertical: spacing.md,
                  alignItems: 'center',
                  borderRadius: 5,
                  backgroundColor: kind === k.value ? k.color + '33' : colors.surfaceAlt,
                  borderWidth: 1,
                  borderColor: kind === k.value ? k.color : colors.border,
                }}
              >
                <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: k.color, marginBottom: 4 }} />
                <ThemedText variant="label" style={{ color: kind === k.value ? k.color : colors.textMuted }}>{k.label}</ThemedText>
              </Pressable>
            ))}
          </View>
        </View>
      </AnimatedSection>

      {/* Form */}
      <AnimatedSection delay={100}>
        <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 5, padding: spacing.md }}>
          <SectionHeader title="RESOURCE DATA" dense />
          <View style={{ gap: spacing.md }}>
            <FormField label="NAME" value={name} onChangeText={setName} error={errors.name} icon="pricetag" placeholder="e.g. Water Reserve" />
            <FormField label="UNIT" value={unit} onChangeText={setUnit} error={errors.unit} icon="resize" placeholder="e.g. L, kWh, kg" />
            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              <View style={{ flex: 1 }}>
                <FormField label="CURRENT VALUE" value={current} onChangeText={setCurrent} error={errors.current} icon="speedometer" placeholder="e.g. 420" keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <FormField label="MAX CAPACITY" value={capacity} onChangeText={setCapacity} error={errors.capacity} icon="cube" placeholder="e.g. 800" keyboardType="numeric" />
              </View>
            </View>
            <FormField label="DAILY CONSUMPTION" value={dailyConsumption} onChangeText={setDailyConsumption} error={errors.dailyConsumption} icon="trending-down" placeholder="e.g. 28" keyboardType="numeric" />
            <FormField label="SOURCE / ORIGIN" value={source} onChangeText={setSource} error={errors.source} icon="location" placeholder="e.g. ECLSS Module A" />
          </View>
        </View>
      </AnimatedSection>

      {/* Actions */}
      <AnimatedSection delay={150}>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <PrimaryButton title="CANCEL" onPress={() => router.back()} variant="secondary" fullWidth />
          <PrimaryButton title="SAVE" onPress={handleSubmit} variant="primary" fullWidth icon={<Ionicons name="checkmark" size={16} color="#000" />} />
        </View>
      </AnimatedSection>
    </ScrollView>
  );
}