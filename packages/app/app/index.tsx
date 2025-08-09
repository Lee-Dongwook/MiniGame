import { router } from "expo-router";
import { View, Text } from "react-native";
import { Card } from "@/shared/ui/Card";

export default function Home() {
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 8 }}>
        Choose a game
      </Text>
      <Card title="Reaction" onPress={() => router.push("/reaction")} />
      <Card title="Memory" onPress={() => router.push("/memory")} />
      <Card title="Stroop Swipe" onPress={() => router.push("/stroop-swipe")} />
      <Card title="Quick Math" onPress={() => router.push("/quick-math")} />
      <Card title="Leaderboard" onPress={() => router.push("/leaderboard")} />
    </View>
  );
}
