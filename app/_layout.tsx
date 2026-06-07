import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, ResourcesProvider, SimulationProvider, useTheme } from '@/context';
import { ThemedView } from '@/components';

SplashScreen.preventAutoHideAsync();

function RootLayoutInner() {
  const { colors, ready } = useTheme();

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return <View style={{ flex: 1, backgroundColor: colors.background }} />;

  return (
    <>
      <StatusBar style={ready ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="resource/new"
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name="resource/[id]"
          options={{ presentation: 'card', headerShown: false }}
        />
        <Stack.Screen
          name="simulation"
          options={{ presentation: 'modal', headerShown: false }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ResourcesProvider>
            <SimulationProvider>
              <RootLayoutInner />
            </ResourcesProvider>
          </ResourcesProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}