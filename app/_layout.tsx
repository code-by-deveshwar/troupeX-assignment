import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import "./global.css";
import { AppLoader } from "../src/components/layout/AppLoader";

const queryClient = new QueryClient();

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    if (Platform.OS === "android") {
      SystemUI.setBackgroundColorAsync("#f6f7fb").catch(() => {
        // ignore – some platforms do not support background override
      });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } finally {
        if (!cancelled) {
          setIsAppReady(true);
        }
      }
    };

    hydrate();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="dark" animated />
        {isAppReady ? (
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#f6f7fb" },
            }}
          />
        ) : (
          <AppLoader />
        )}
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
