import { useEffect, useState } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { fetchLeaderboard } from "../api";
import type { GameId, LeaderboardItem } from "../model";
import { GamePicker } from "./GamePicker";

export function LeaderboardScreen() {
  const [gameId, setGameId] = useState<GameId>("reaction");
  const [items, setItems] = useState<LeaderboardItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function load(g: GameId) {
    setIsLoading(true);
    try {
      const res = await fetchLeaderboard(g);
      setItems(res.items);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load(gameId);
  }, [gameId]);

  return (
    <View style={{ padding: 16, gap: 12, flex: 1 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Leaderboard</Text>
      <GamePicker value={gameId} onChange={setGameId} />

      <FlatList
        data={items}
        keyExtractor={(it, i) => `${it.uid}-${i}`}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => load(gameId)}
          />
        }
        renderItem={({ item, index }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 10,
              borderBottomWidth: 1,
              opacity: 0.9,
            }}
          >
            <Text>#{index + 1}</Text>
            <Text>{item.uid.slice(0, 6)}</Text>
            <Text>{item.score}</Text>
          </View>
        )}
        ListEmptyComponent={
          !isLoading ? <Text>아직 데이터가 없어요.</Text> : null
        }
      />
    </View>
  );
}
