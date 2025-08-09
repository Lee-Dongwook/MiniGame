import { api } from "@/shared/lib/http";
import type { GameId, LeaderboardItem } from "./model";

export function fetchLeaderboard(gameId: GameId) {
  return api<{ items: LeaderboardItem[] }>(
    `/scores/leaderboard?gameId=${gameId}`
  );
}
