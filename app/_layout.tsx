import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Stack } from "expo-router";
import "react-native-reanimated";
import { persister } from "@/shared/lib/persister";
import { queryClient } from "@/shared/lib/query-client";
import { MainProvider } from "@/providers/MainProvider";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <MainProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="auth/login"
            options={{
              headerShown: false,
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="auth/register"
            options={{
              headerShown: false,
              presentation: "modal",
            }}
          />
        </Stack>
      </MainProvider>
    </PersistQueryClientProvider>
  );
}
