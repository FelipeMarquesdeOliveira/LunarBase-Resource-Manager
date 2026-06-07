import { useEffect, useRef } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withDelay } from 'react-native-reanimated';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import { ThemedText, ThemedView } from '@/components';
import { spacing } from '@/theme/spacing';

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const isFocused = useIsFocused();

  const indicatorScale = useSharedValue(1);
  const titleOpacity = useSharedValue(0);
  const titleTranslate = useSharedValue(20);
  const contentOpacity = useSharedValue(0);
  const contentTranslate = useSharedValue(15);
  const btnOpacity = useSharedValue(0);
  const btnTranslate = useSharedValue(10);

  useEffect(() => {
    if (isFocused) {
      indicatorScale.value = withSequence(
        withSpring(1.3, { damping: 10, stiffness: 200 }),
        withSpring(1, { damping: 15, stiffness: 180 })
      );
      titleOpacity.value = withDelay(100, withSpring(1, { damping: 18, stiffness: 150 }));
      titleTranslate.value = withDelay(100, withSpring(0, { damping: 18, stiffness: 150 }));
      contentOpacity.value = withDelay(300, withSpring(1, { damping: 18, stiffness: 150 }));
      contentTranslate.value = withDelay(300, withSpring(0, { damping: 18, stiffness: 150 }));
      btnOpacity.value = withDelay(600, withSpring(1, { damping: 18, stiffness: 150 }));
      btnTranslate.value = withDelay(600, withSpring(0, { damping: 18, stiffness: 150 }));
    } else {
      indicatorScale.value = 1;
      titleOpacity.value = 0;
      titleTranslate.value = 20;
      contentOpacity.value = 0;
      contentTranslate.value = 15;
      btnOpacity.value = 0;
      btnTranslate.value = 10;
    }
  }, [isFocused]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ scale: indicatorScale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslate.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslate.value }],
  }));

  const btnStyle = useAnimatedStyle(() => ({
    opacity: btnOpacity.value,
    transform: [{ translateY: btnTranslate.value }],
  }));

  return (
    <ThemedView variant="background" style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.statusRow, indicatorStyle]}>
          <View style={[styles.indicator, { backgroundColor: colors.success }]} />
          <ThemedText variant="label" color="textMuted">SYSTEM ONLINE</ThemedText>
        </Animated.View>

        <Animated.View style={titleStyle}>
          <ThemedText variant="h1" style={{ fontSize: 28, letterSpacing: 4 }}>LUNARBASE</ThemedText>
          <ThemedText variant="label" color="textMuted" style={{ letterSpacing: 2 }}>RESOURCE MANAGEMENT SYSTEM</ThemedText>
        </Animated.View>

        <Animated.View style={[styles.divider, { backgroundColor: colors.border }]} />

        <Animated.View style={contentStyle}>
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
              <ThemedText variant="mono">147</ThemedText>
            </View>
          </View>
        </Animated.View>
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
        <Animated.View style={btnStyle}>
          <ThemedText variant="label" style={{ color: '#000' }}>ENTER SYSTEM</ThemedText>
          <Ionicons name="arrow-forward" size={16} color="#000" />
        </Animated.View>
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