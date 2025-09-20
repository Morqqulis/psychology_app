import { MainProvider } from "@/providers/MainProvider";
import { persister } from "@/shared/lib/persister";
import { queryClient } from "@/shared/lib/query-client";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Stack } from "expo-router";
import "react-native-reanimated";
import "./global.css";
import { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";

const options: ExtendedStackNavigationOptions = {
  headerShown: false,
  presentation: "transparentModal",
};

export default function RootLayout() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <MainProvider>
        <Stack>
          <Stack.Screen name="index" options={options} />
          <Stack.Screen name="(tabs)" options={options} />
          <Stack.Screen name="auth/login" options={options} />
          <Stack.Screen name="auth/register" options={options} />
        </Stack>
      </MainProvider>
    </PersistQueryClientProvider>
  );
}
