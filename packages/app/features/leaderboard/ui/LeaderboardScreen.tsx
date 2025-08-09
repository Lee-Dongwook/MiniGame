import { useMemo, useRef, useState } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchLeaderboard } from "../api";
import type { GameId, LeaderboardItem } from "../model";
import { GamePicker } from "./GamePicker";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/useAuthStore";

export function LeaderboardScreen() {
  const { t } = useTranslation();
  const [gameId, setGameId] = useState<GameId>("reaction");
  const { uid } = useAuthStore();
  const {
    data,
    isLoading,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["leaderboard", gameId],
    queryFn: async ({ pageParam }) =>
      fetchLeaderboard(gameId, {
        limit: 20,
        cursorScore: pageParam?.score,
        cursorCreatedAt: pageParam?.createdAt,
      }),
    initialPageParam: undefined as
      | undefined
      | { score: number; createdAt: string },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 10_000,
  });
  const items = (data?.pages ?? []).flatMap((p) => p.items);
  const myIndex = useMemo(
    () => items.findIndex((it) => (uid ? it.uid === uid : false)),
    [items, uid]
  );
  const listRef = useRef<FlatList<LeaderboardItem>>(null);
  function scrollToMyRank() {
    if (myIndex >= 0)
      listRef.current?.scrollToIndex({ index: myIndex, animated: true });
  }

  return (
    <View style={{ padding: 16, gap: 12, flex: 1 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>
        {t("leaderboard.title")}
      </Text>
      <GamePicker value={gameId} onChange={setGameId} />

      <FlatList
        ref={listRef}
        data={items as LeaderboardItem[]}
        keyExtractor={(it, i) => `${it.uid}-${i}`}
        refreshControl={
          <RefreshControl
            refreshing={isLoading || isRefetching}
            onRefresh={() => refetch()}
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
              backgroundColor:
                myIndex === index ? "rgba(255, 215, 0, 0.15)" : "transparent",
            }}
          >
            <Text>#{index + 1}</Text>
            <Text>{item.uid.slice(0, 6)}</Text>
            <Text>
              {gameId === "reaction"
                ? `${item.score} ${t("common.ms")}`
                : item.score}
            </Text>
          </View>
        )}
        onEndReachedThreshold={0.6}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        ListEmptyComponent={
          !isLoading ? <Text>{t("leaderboard.empty")}</Text> : null
        }
        ListFooterComponent={
          hasNextPage ? (
            <View style={{ paddingVertical: 12, alignItems: "center" }}>
              <Text>
                {isFetchingNextPage
                  ? t("leaderboard.loading")
                  : t("leaderboard.loadMore")}
              </Text>
            </View>
          ) : null
        }
      />

      {/* Go to my rank button */}
      {myIndex >= 0 && (
        <View style={{ position: "absolute", right: 16, bottom: 16 }}>
          <Text
            onPress={scrollToMyRank}
            style={{ padding: 10, borderWidth: 1, borderRadius: 12 }}
          >
            {t("leaderboard.gotoMyRank")}
          </Text>
        </View>
      )}
    </View>
  );
}
