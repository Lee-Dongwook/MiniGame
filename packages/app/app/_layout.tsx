import { Stack } from "expo-router";
import { useEffect } from "react";
import { ensureAnonymousLogin } from "@/shared/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";

export default function RootLayout() {
  const { setUid } = useAuthStore();

  useEffect(() => {
    ensureAnonymousLogin().then(setUid);
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Mini Games" }} />
      <Stack.Screen name="leaderboard" options={{ title: "Leaderboard" }} />
      <Stack.Screen name="reaction" options={{ title: "Reaction" }} />
      <Stack.Screen name="memory" options={{ title: "Memory" }} />
      <Stack.Screen name="stroop-swipe" options={{ title: "Stroop Swipe" }} />
      <Stack.Screen name="quick-math" options={{ title: "Quick Math" }} />
    </Stack>
  );
}
