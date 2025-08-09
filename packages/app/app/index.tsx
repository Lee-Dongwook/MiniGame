import { router } from "expo-router";
import { View, Text } from "react-native";
import { Card } from "@/shared/ui/Card";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 8 }}>
        {t("home.title")}
      </Text>
      <Card
        title={t("home.reaction")}
        onPress={() => router.push("/reaction")}
      />
      <Card title={t("home.memory")} onPress={() => router.push("/memory")} />
      <Card
        title={t("home.stroop")}
        onPress={() => router.push("/stroop-swipe")}
      />
      <Card
        title={t("home.quickMath")}
        onPress={() => router.push("/quick-math")}
      />
      <Card
        title={t("home.leaderboard")}
        onPress={() => router.push("/leaderboard")}
      />
    </View>
  );
}
