import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, ResourcesProvider, SimulationProvider, SpaceWeatherProvider, ApiProvider, useTheme } from '@/context';

SplashScreen.preventAutoHideAsync();

function RootLayoutInner() {
  const { colors, ready } = useTheme();

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return <View style={{ flex: 1, backgroundColor: colors.background }} />;

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
          animationDuration: 250,
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="resource/new"
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
            animationDuration: 300,
          }}
        />
        <Stack.Screen
          name="resource/[id]"
          options={{
            presentation: 'card',
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 250,
          }}
        />
        <Stack.Screen
          name="simulation"
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
            animationDuration: 300,
          }}
        />
        <Stack.Screen
          name="space"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 250,
          }}
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
              <SpaceWeatherProvider>
                <ApiProvider>
                  <RootLayoutInner />
                </ApiProvider>
              </SpaceWeatherProvider>
            </SimulationProvider>
          </ResourcesProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}