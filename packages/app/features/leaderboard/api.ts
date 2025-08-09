import { api } from "@/shared/lib/http";

export function fetchLeaderboard(gameId: string) {
  return api<{ items: { uid: string; score: number; createdAt: string }[] }>(
    `/scores/leaderboard?gameId=${gameId}`
  );
}
