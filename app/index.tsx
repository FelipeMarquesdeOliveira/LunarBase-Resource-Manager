import { useEffect } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay } from 'react-native-reanimated';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import { ThemedText, ThemedView } from '@/components';
import { spacing } from '@/theme/spacing';

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const isFocused = useIsFocused();

  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(10);
  const subOpacity = useSharedValue(0);
  const btnOpacity = useSharedValue(0);
  const btnY = useSharedValue(12);

  useEffect(() => {
    if (isFocused) {
      titleOpacity.value = withDelay(100, withSpring(1, { damping: 22, stiffness: 150 }));
      titleY.value = withDelay(100, withSpring(0, { damping: 22, stiffness: 150 }));
      subOpacity.value = withDelay(280, withSpring(1, { damping: 20, stiffness: 150 }));
      btnOpacity.value = withDelay(480, withSpring(1, { damping: 20, stiffness: 150 }));
      btnY.value = withDelay(480, withSpring(0, { damping: 20, stiffness: 150 }));
    } else {
      titleOpacity.value = 0;
      titleY.value = 10;
      subOpacity.value = 0;
      btnOpacity.value = 0;
      btnY.value = 12;
    }
  }, [isFocused]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));
  const subStyle = useAnimatedStyle(() => ({ opacity: subOpacity.value }));
  const btnStyle = useAnimatedStyle(() => ({
    opacity: btnOpacity.value,
    transform: [{ translateY: btnY.value }],
  }));

  return (
    <ThemedView variant="background" style={styles.container}>
      {/* Top status */}
      <Animated.View style={[styles.statusRow, subStyle]}>
        <View style={[styles.dot, { backgroundColor: colors.success }]} />
        <ThemedText variant="caption" color="textMuted">SYSTEM ONLINE</ThemedText>
      </Animated.View>

      {/* Title block */}
      <View style={styles.content}>
        <Animated.View style={titleStyle}>
          <ThemedText style={styles.bigTitle}>LUNAR{'\n'}BASE</ThemedText>
          <Animated.View style={[styles.subtitle, subStyle]}>
            <View style={{ width: 20, height: 1.5, backgroundColor: colors.primary, marginRight: spacing.sm }} />
            <ThemedText variant="caption" color="textMuted" style={{ letterSpacing: 3 }}>
              RESOURCE MANAGEMENT
            </ThemedText>
          </Animated.View>
        </Animated.View>

        {/* Minimal data strip */}
        <Animated.View style={[styles.strip, subStyle]}>
          {[
            { label: 'BASE', value: 'ALPHA-01', accent: colors.primary },
            { label: 'STATUS', value: 'NOMINAL', accent: colors.success },
            { label: 'CREW', value: '04' },
            { label: 'DAY', value: '147' },
          ].map((item, i) => (
            <View key={i} style={styles.stripItem}>
              <ThemedText style={{ fontSize: 11, color: colors.textMuted, letterSpacing: 1 }}>{item.label}</ThemedText>
              <ThemedText style={{ fontSize: 13, fontWeight: '700', color: item.accent ?? colors.text }}>{item.value}</ThemedText>
            </View>
          ))}
        </Animated.View>
      </View>

      {/* Enter button */}
      <Animated.View style={btnStyle}>
        <Pressable
          onPress={() => router.replace('/(tabs)/dashboard')}
          style={({ pressed }) => [
            styles.enterBtn,
            { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <ThemedText style={styles.enterLabel}>ENTER SYSTEM</ThemedText>
          <Ionicons name="arrow-forward" size={17} color="#000" />
        </Pressable>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.lg },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  dot: { width: 6, height: 6, borderRadius: 3 },
  content: { flex: 1, justifyContent: 'center', gap: spacing.xxl },
  bigTitle: { fontSize: 60, fontWeight: '900', letterSpacing: -2, lineHeight: 60 },
  subtitle: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  strip: { flexDirection: 'row', gap: spacing.lg, paddingTop: spacing.lg, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' },
  stripItem: { gap: 3 },
  enterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: 6,
    marginBottom: spacing.md,
  },
  enterLabel: { fontSize: 13, fontWeight: '800', color: '#000', letterSpacing: 1.5 },
});
