import { useCallback } from 'react';
import { Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useIsFocused } from '@react-navigation/native';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  delay?: number;
  style?: any;
}

export function AnimatedCard({ children, onPress, delay = 0, style }: Props) {
  const isFocused = useIsFocused();
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  const triggerAnimation = useCallback(() => {
    scale.value = 0.9;
    opacity.value = 0;
    const timeout = setTimeout(() => {
      scale.value = withSpring(1, { damping: 18, stiffness: 180 });
      opacity.value = withSpring(1, { damping: 18, stiffness: 180 });
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  const prevFocused = useSharedValue(false);

  if (isFocused !== prevFocused.value) {
    prevFocused.value = isFocused;
    if (isFocused) {
      triggerAnimation();
    } else {
      scale.value = 0.9;
      opacity.value = 0;
    }
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
    </Pressable>
  );
}

export function AnimatedPressable({ onPress, children, style }: { onPress: () => void; children: React.ReactNode; style?: any }) {
  const isFocused = useIsFocused();
  const scale = useSharedValue(1);
  const prevFocused = useSharedValue(false);

  if (isFocused !== prevFocused.value) {
    prevFocused.value = isFocused;
    if (isFocused) {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.92, { damping: 15, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      }}
    >
      <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
    </Pressable>
  );
}

export function useScreenAnimation(delay = 0) {
  const isFocused = useIsFocused();
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  const trigger = useCallback(() => {
    scale.value = 0.9;
    opacity.value = 0;
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 18, stiffness: 180 });
      opacity.value = withSpring(1, { damping: 18, stiffness: 180 });
    }, delay);
  }, [delay]);

  const prevFocused = useSharedValue(false);

  if (isFocused !== prevFocused.value) {
    prevFocused.value = isFocused;
    if (isFocused) {
      trigger();
    } else {
      scale.value = 0.9;
      opacity.value = 0;
    }
  }

  return { scale, opacity };
}