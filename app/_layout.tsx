import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/use-color-scheme'
import { persister } from '@/shared/lib/persister'
import { queryClient } from '@/shared/lib/query-client'

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen 
            name="auth/login" 
            options={{ 
              headerShown: false,
              presentation: 'modal'
            }} 
          />
          <Stack.Screen 
            name="auth/register" 
            options={{ 
              headerShown: false,
              presentation: 'modal'
            }} 
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </PersistQueryClientProvider>
  );
}
