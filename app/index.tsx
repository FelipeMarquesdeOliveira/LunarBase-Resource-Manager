import { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { ThemedText, ThemedView } from '@/components';
import { spacing } from '@/theme/spacing';

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 800);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <ThemedView variant="background" style={styles.container}>
      <View style={styles.content}>
        <View style={styles.statusRow}>
          <View style={[styles.indicator, { backgroundColor: colors.success }]} />
          <ThemedText variant="label" color="textMuted">SYSTEM ONLINE</ThemedText>
        </View>

        <ThemedText variant="h1" style={{ fontSize: 28, letterSpacing: 4 }}>LUNARBASE</ThemedText>
        <ThemedText variant="label" color="textMuted" style={{ letterSpacing: 2 }}>RESOURCE MANAGEMENT SYSTEM</ThemedText>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.dataGrid}>
          <View style={styles.dataItem}>
            <ThemedText variant="label" color="textMuted">BASE</ThemedText>
            <ThemedText variant="mono" style={{ color: colors.primary }}>ALPHA-01</ThemedText>
          </View>
          <View style={styles.dataItem}>
            <ThemedText variant="label" color="textMuted">STATUS</ThemedText>
            <ThemedText variant="mono" style={{ color: colors.success }}>NOMINAL</ThemedText>
          </View>
          <View style={styles.dataItem}>
            <ThemedText variant="label" color="textMuted">CREW</ThemedText>
            <ThemedText variant="mono">04</ThemedText>
          </View>
          <View style={styles.dataItem}>
            <ThemedText variant="label" color="textMuted">DAY</ThemedText>
            <ThemedText variant="mono">{countdown > 0 ? countdown : '--'}</ThemedText>
          </View>
        </View>
      </View>

      <Pressable
        onPress={() => router.replace('/(tabs)/dashboard')}
        style={({ pressed }) => [
          styles.enterBtn,
          {
            backgroundColor: colors.primary,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <ThemedText variant="label" style={{ color: '#000' }}>ENTER SYSTEM</ThemedText>
        <Ionicons name="arrow-forward" size={16} color="#000" />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  content: { flex: 1, justifyContent: 'center', gap: spacing.sm },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  indicator: { width: 8, height: 8, borderRadius: 4 },
  divider: { height: 1, marginVertical: spacing.lg },
  dataGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  dataItem: { width: '45%', gap: 2 },
  enterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    borderRadius: 5,
    marginBottom: spacing.lg,
  },
});