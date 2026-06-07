import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useResources } from '@/context/ResourcesContext';
import { useResourceStats } from '@/hooks/useResourceStats';
import {
  SectionHeader,
  StatCard,
  ResourceCard,
  ThemedText,
  ThemedView,
  CriticalityBadge,
} from '@/components';
import { spacing } from '@/theme/spacing';
import { worst } from '@/utils/criticality';
import { formatNumber } from '@/utils/format';
import { dailyHistoryMock } from '@/data/mockData';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const W = Dimensions.get('window').width;

export default function DashboardScreen() {
  const { colors } = useTheme();
  const { resources, ready } = useResources();
  const { overall, totalAutonomy } = useResourceStats(resources);
  const router = useRouter();

  const overallTone = (() => {
    switch (overall) {
      case 'depleted':
      case 'critical':
        return 'danger';
      case 'attention':
        return 'warning';
      default:
        return 'success';
    }
  })();

  const chartData = {
    labels: dailyHistoryMock.slice(-6).map((d) => `D${d.day}`),
    datasets: [
      {
        data: dailyHistoryMock.slice(-6).map((d) => d.water),
        color: () => colors.chart.water,
        strokeWidth: 2,
      },
      {
        data: dailyHistoryMock.slice(-6).map((d) => d.energy),
        color: () => colors.chart.energy,
        strokeWidth: 2,
      },
    ],
    legend: ['Agua', 'Energia'],
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxxl }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <ThemedText variant="caption" color="textMuted">Base Lunar Alpha</ThemedText>
          <ThemedText variant="h1">Dashboard</ThemedText>
        </View>
        <CriticalityBadge level={overall} />
      </View>

      <View style={styles.row}>
        <StatCard
          title="Autonomia Geral"
          value={`${formatNumber(totalAutonomy, 0)} dias`}
          caption="Menor recurso"
          icon="time"
          tone={totalAutonomy < 5 ? 'warning' : 'success'}
        />
        <StatCard
          title="Tripulacao"
          value="4"
          caption="Ativos"
          icon="people"
          tone="info"
        />
      </View>

      <View style={styles.row}>
        <StatCard
          title="Eventos Hoje"
          value="2"
          caption="1 em andamento"
          icon="alert"
          tone="warning"
        />
        <StatCard
          title="Status"
          value={overall === 'safe' ? 'Estavel' : overall === 'attention' ? 'Atencao' : 'Alerta'}
          caption="Nivel geral"
          icon={overall === 'safe' ? 'checkmark-circle' : 'warning'}
          tone={overallTone}
        />
      </View>

      <ThemedView variant="surface" padded="lg" rounded="lg" bordered>
        <SectionHeader
          title="Historico de Recursos"
          subtitle="Ultimos 6 dias"
          right={
            <View style={[styles.legendDot, { backgroundColor: colors.chart.water }]} />
          }
        />
        <LineChart
          data={chartData}
          width={W - spacing.lg * 4}
          height={180}
          chartConfig={{
            backgroundColor: colors.surface,
            backgroundGradientFrom: colors.surface,
            backgroundGradientTo: colors.surface,
            decimalPlaces: 0,
            color: () => colors.primary,
            labelColor: () => colors.textMuted,
            propsForBackgroundLines: {
              stroke: colors.chart.grid,
              strokeDasharray: '',
            },
          }}
          bezier
          style={{ marginLeft: -spacing.md }}
        />
      </ThemedView>

      <SectionHeader
        title="Recursos Ativos"
        subtitle={`${resources.length} monitorados`}
        right={
          <ThemedText
            variant="caption"
            color="primary"
            onPress={() => router.push('/(tabs)/resources')}
          >
            Ver todos
          </ThemedText>
        }
      />

      {resources.slice(0, 2).map((r) => (
        <ResourceCard
          key={r.id}
          resource={r}
          onPress={() => router.push(`/resource/${r.id}`)}
        />
      ))}

      <ThemedView variant="surfaceAlt" padded="lg" rounded="lg" style={{ alignItems: 'center' }}>
        <Ionicons name="rocket" size={32} color={colors.primary} />
        <ThemedText variant="h3" align="center" style={{ marginTop: spacing.md }}>
          Simulacao Disponivel
        </ThemedText>
        <ThemedText variant="caption" color="textMuted" align="center">
          Configure parametros e simule o consumo da base lunar
        </ThemedText>
        <ThemedText
          variant="body"
          color="primary"
          onPress={() => router.push('/simulation')}
          style={{ marginTop: spacing.md }}
        >
          Iniciar Simulacao
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  row: { flexDirection: 'row', gap: spacing.md },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
});