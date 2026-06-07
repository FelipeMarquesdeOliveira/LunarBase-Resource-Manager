import { useEffect, useState } from 'react';
import { ScrollView, View, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay } from 'react-native-reanimated';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import { ThemedText } from '@/components';
import { spacing } from '@/theme/spacing';
import { getApod, type ApodResponse } from '@/services/nasaApi';

import { useEffect as _useEffect } from 'react';

function AnimatedSection({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: any }) {
  const isFocused = useIsFocused();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  _useEffect(() => {
    if (isFocused) {
      opacity.value = withDelay(delay || 0, withSpring(1, { damping: 18, stiffness: 180 }));
      translateY.value = withDelay(delay || 0, withSpring(0, { damping: 18, stiffness: 180 }));
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

export default function SpaceDataScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [apod, setApod] = useState<ApodResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const data = await getApod();
        setApod(data);
      } catch (err) {
        setError('Failed to load NASA data. Check your connection.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xxl }}
    >
      {/* Header */}
      <AnimatedSection delay={0}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm }}>
          <Pressable onPress={() => router.back()} style={{ padding: spacing.xs }}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <View>
            <ThemedText variant="label" color="textMuted">NASA OPEN DATA</ThemedText>
            <ThemedText variant="h1">SPACE DATA</ThemedText>
          </View>
        </View>
      </AnimatedSection>

      {loading && (
        <View style={{ alignItems: 'center', padding: spacing.xxl }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <ThemedText variant="caption" color="textMuted" style={{ marginTop: spacing.md }}>
            LOADING NASA DATA...
          </ThemedText>
        </View>
      )}

      {error && (
        <AnimatedSection delay={0}>
          <View style={{ backgroundColor: colors.danger + '18', borderWidth: 1, borderColor: colors.danger + '44', borderRadius: 5, padding: spacing.md, alignItems: 'center' }}>
            <Ionicons name="cloud-offline" size={40} color={colors.danger} />
            <ThemedText variant="body" color="danger" style={{ marginTop: spacing.sm }}>{error}</ThemedText>
            <Pressable
              onPress={() => {
                setLoading(true);
                setError(null);
                getApod().then(setApod).catch(() => setError('Failed to load NASA data')).finally(() => setLoading(false));
              }}
              style={{ marginTop: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, backgroundColor: colors.danger, borderRadius: 5 }}
            >
              <ThemedText variant="body" style={{ color: '#fff', fontWeight: '700' }}>RETRY</ThemedText>
            </Pressable>
          </View>
        </AnimatedSection>
      )}

      {apod && !loading && (
        <>
          <AnimatedSection delay={50}>
            <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 5, padding: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
                <Ionicons name="image" size={16} color={colors.primary} />
                <ThemedText variant="label" color="primary">ASTRONOMY PICTURE OF THE DAY</ThemedText>
              </View>
              <ThemedText variant="h3">{apod.title}</ThemedText>
              <ThemedText variant="caption" color="textMuted" style={{ marginTop: 2 }}>{apod.date}</ThemedText>
            </View>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 5, padding: spacing.md }}>
              <ThemedText variant="label" color="textMuted" style={{ marginBottom: spacing.sm }}>DESCRIPTION</ThemedText>
              <ThemedText variant="body" color="textMuted" style={{ lineHeight: 20 }}>{apod.explanation}</ThemedText>
              {apod.copyright && (
                <ThemedText variant="caption" color="textDim" style={{ marginTop: spacing.md }}>
                  Copyright: {apod.copyright}
                </ThemedText>
              )}
            </View>
          </AnimatedSection>

          <AnimatedSection delay={150}>
            <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 5, padding: spacing.md }}>
              <ThemedText variant="label" color="textMuted" style={{ marginBottom: spacing.sm }}>MEDIA INFO</ThemedText>
              <View style={{ flexDirection: 'row', gap: spacing.md }}>
                <View style={{ flex: 1 }}>
                  <ThemedText variant="caption" color="textMuted">TYPE</ThemedText>
                  <ThemedText variant="body">{apod.media_type.toUpperCase()}</ThemedText>
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText variant="caption" color="textMuted">VERSION</ThemedText>
                  <ThemedText variant="body">{apod.service_version}</ThemedText>
                </View>
              </View>
              <Pressable
                onPress={() => {
                  // In a real app, would open the URL in browser
                }}
                style={{ marginTop: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primary, paddingVertical: spacing.md, borderRadius: 5 }}
              >
                <Ionicons name="open-outline" size={16} color="#000" />
                <ThemedText variant="body" style={{ color: '#000', fontWeight: '700' }}>VIEW FULL IMAGE</ThemedText>
              </Pressable>
            </View>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <View style={{ backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border, borderRadius: 5, padding: spacing.md, alignItems: 'center' }}>
              <Ionicons name="globe" size={32} color={colors.primary} />
              <ThemedText variant="caption" color="textMuted" style={{ marginTop: spacing.sm, textAlign: 'center' }}>
                Data provided by NASA Open APIs{'\n'}api.nasa.gov
              </ThemedText>
            </View>
          </AnimatedSection>
        </>
      )}

      <AnimatedSection delay={250}>
        <Pressable
          onPress={() => router.back()}
          style={{ alignItems: 'center', padding: spacing.md }}
        >
          <ThemedText variant="caption" color="textMuted">BACK TO DASHBOARD</ThemedText>
        </Pressable>
      </AnimatedSection>
    </ScrollView>
  );
}