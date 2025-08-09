import { Stack } from "expo-router";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ensureAnonymousLogin } from "@/shared/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import "@/shared/lib/i18n";

export default function RootLayout() {
  const { setUid } = useAuthStore();
  const queryClient = new QueryClient();

  useEffect(() => {
    ensureAnonymousLogin().then(setUid);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "Mini Games" }} />
        <Stack.Screen name="leaderboard" options={{ title: "Leaderboard" }} />
        <Stack.Screen name="reaction" options={{ title: "Reaction" }} />
        <Stack.Screen name="memory" options={{ title: "Memory" }} />
        <Stack.Screen name="stroop-swipe" options={{ title: "Stroop Swipe" }} />
        <Stack.Screen name="quick-math" options={{ title: "Quick Math" }} />
      </Stack>
    </QueryClientProvider>
  );
}
