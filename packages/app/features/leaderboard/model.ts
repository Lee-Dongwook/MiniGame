export type GameId = "reaction" | "memory" | "stroop-swipe" | "quick-math";

export interface LeaderboardItem {
  uid: string;
  score: number;
  createdAt: string;
}
