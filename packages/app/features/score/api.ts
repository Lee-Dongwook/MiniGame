import { api } from "@/shared/lib/http";

export function submitScore(body: {
  gameId: string;
  score: number;
  runTimeMs: number;
}) {
  return api<{ ok: true }>("/scores", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
