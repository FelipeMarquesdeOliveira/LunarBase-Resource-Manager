import { useEffect, useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { ThemedText, ThemedView } from '@/components';
import { spacing } from '@/theme/spacing';

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [dots, setDots] = useState('');

  useEffect(() => {
    const id = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 500);
    return () => clearInterval(id);
  }, []);

  return (
    <ThemedView variant="background" style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoWrap}>
          <Ionicons name="moon" size={72} color={colors.primary} />
          <View style={[styles.ring, { borderColor: `${colors.primary}55` }]} />
        </View>
        <ThemedText variant="h1" align="center" style={{ marginTop: spacing.xl }}>
          LunarBase
        </ThemedText>
        <ThemedText variant="body" color="textMuted" align="center">
          Resource Manager
        </ThemedText>
        <ThemedText variant="caption" color="textMuted" align="center" style={{ marginTop: spacing.xs }}>
          Global Solution 2026.1{'\n'}Mobile Development & IoT
        </ThemedText>

        <View style={styles.loadingRow}>
          <Ionicons name="radio" size={16} color={colors.primary} />
          <ThemedText variant="caption" color="textMuted">
            Conectando com a base{dots}
          </ThemedText>
        </View>
      </View>

      <Pressable
        onPress={() => router.replace('/(tabs)/dashboard')}
        style={({ pressed }) => [
          styles.enterBtn,
          { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <ThemedText variant="body" style={{ color: colors.primary, fontWeight: '700' }}>
          Entrar na base
        </ThemedText>
        <Ionicons name="arrow-forward" size={20} color={colors.primary} />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.xl },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  logoWrap: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    top: '50%',
    left: '50%',
    marginTop: -55,
    marginLeft: -55,
  },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xxl },
  enterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: spacing.xl,
  },
});