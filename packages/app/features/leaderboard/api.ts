import { api } from "@/shared/lib/http";
import type { GameId, LeaderboardItem } from "./model";

export function fetchLeaderboard(
  gameId: GameId,
  params?: { limit?: number; cursorScore?: number; cursorCreatedAt?: string }
) {
  const search = new URLSearchParams({ gameId });
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.cursorScore !== undefined)
    search.set("cursorScore", String(params.cursorScore));
  if (params?.cursorCreatedAt)
    search.set("cursorCreatedAt", params.cursorCreatedAt);
  return api<{
    items: LeaderboardItem[];
    nextCursor?: { score: number; createdAt: string } | null;
  }>(`/scores/leaderboard?${search.toString()}`);
}
