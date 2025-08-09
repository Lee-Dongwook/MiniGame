import { Stack } from "expo-router";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ensureAnonymousLogin } from "@/shared/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import "@/shared/lib/i18n";
import { useTranslation } from "react-i18next";

export default function RootLayout() {
  const { setUid } = useAuthStore();
  const queryClient = new QueryClient();
  const { t } = useTranslation();

  useEffect(() => {
    ensureAnonymousLogin().then(setUid);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: t("home.title") }} />
        <Stack.Screen
          name="leaderboard"
          options={{ title: t("leaderboard.title") }}
        />
        <Stack.Screen name="reaction" options={{ title: t("home.reaction") }} />
        <Stack.Screen name="memory" options={{ title: t("home.memory") }} />
        <Stack.Screen
          name="stroop-swipe"
          options={{ title: t("home.stroop") }}
        />
        <Stack.Screen
          name="quick-math"
          options={{ title: t("home.quickMath") }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
