import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useResources } from '@/context/ResourcesContext';
import { ThemedText, ThemedView, FormField, PrimaryButton, SectionHeader } from '@/components';
import { spacing } from '@/theme/spacing';
import type { ResourceKind, FormErrors } from '@/types';

const KINDS: { label: string; value: ResourceKind }[] = [
  { label: 'Agua', value: 'water' },
  { label: 'Energia', value: 'energy' },
  { label: 'Oxigenio', value: 'oxygen' },
  { label: 'Alimento', value: 'food' },
];

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
    if (!name.trim()) e.name = 'Nome e obrigatorio';
    if (!unit.trim()) e.unit = 'Unidade e obrigatoria';
    const c = parseFloat(current);
    if (isNaN(c) || c < 0) e.current = 'Valor atual invalido';
    const cap = parseFloat(capacity);
    if (isNaN(cap) || cap <= 0) e.capacity = 'Capacidade invalida';
    if (c > cap) e.current = 'Valor atual nao pode exceder capacidade';
    const dc = parseFloat(dailyConsumption);
    if (isNaN(dc) || dc < 0) e.dailyConsumption = 'Consumo diario invalido';
    if (!source.trim()) e.source = 'Fonte e obrigatoria';
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
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxxl }}
    >
      <View style={styles.header}>
        <Ionicons name="add-circle" size={32} color={colors.primary} />
        <ThemedText variant="h1">Novo Recurso</ThemedText>
      </View>

      <ThemedText variant="caption" color="textMuted">
        Adicione um novo recurso vital para monitoramento da base lunar
      </ThemedText>

      <ThemedView variant="surface" padded="lg" rounded="lg" bordered>
        <ThemedText variant="h3" style={{ marginBottom: spacing.md }}>Tipo</ThemedText>
        <View style={styles.kindRow}>
          {KINDS.map((k) => (
            <ThemedView
              key={k.value}
              variant={kind === k.value ? 'surfaceAlt' : 'surface'}
              padded="sm"
              rounded="md"
              onTouchEnd={() => setKind(k.value)}
              style={{ flex: 1, alignItems: 'center', opacity: kind === k.value ? 1 : 0.6 }}
            >
              <ThemedText variant="caption" color={kind === k.value ? 'primary' : 'textMuted'}>
                {k.label}
              </ThemedText>
            </ThemedView>
          ))}
        </View>
      </ThemedView>

      <ThemedView variant="surface" padded="lg" rounded="lg" bordered>
        <SectionHeader title="Dados do Recurso" />
        <View style={styles.form}>
          <FormField
            label="Nome do recurso"
            value={name}
            onChangeText={setName}
            error={errors.name}
            icon="pricetag"
            placeholder="Ex: Reserva de Agua"
          />
          <FormField
            label="Unidade"
            value={unit}
            onChangeText={setUnit}
            error={errors.unit}
            icon="resize"
            placeholder="Ex: L, kWh, kg"
          />
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <FormField
                label="Valor atual"
                value={current}
                onChangeText={setCurrent}
                error={errors.current}
                icon="speedometer"
                placeholder="Ex: 420"
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <FormField
                label="Capacidade"
                value={capacity}
                onChangeText={setCapacity}
                error={errors.capacity}
                icon="cube"
                placeholder="Ex: 800"
                keyboardType="numeric"
              />
            </View>
          </View>
          <FormField
            label="Consumo diario"
            value={dailyConsumption}
            onChangeText={setDailyConsumption}
            error={errors.dailyConsumption}
            icon="trending-down"
            placeholder="Ex: 28"
            keyboardType="numeric"
          />
          <FormField
            label="Fonte / Origem"
            value={source}
            onChangeText={setSource}
            error={errors.source}
            icon="location"
            placeholder="Ex: Reciclador ECLSS"
          />
        </View>
      </ThemedView>

      <View style={styles.actions}>
        <PrimaryButton title="Cancelar" onPress={() => router.back()} variant="secondary" />
        <PrimaryButton
          title="Salvar Recurso"
          onPress={handleSubmit}
          variant="primary"
          icon={<Ionicons name="checkmark" size={18} color={colors.background} />}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  kindRow: { flexDirection: 'row', gap: spacing.sm },
  form: { gap: spacing.md },
  row: { flexDirection: 'row', gap: spacing.md },
  actions: { flexDirection: 'row', gap: spacing.md },
});