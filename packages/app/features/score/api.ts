import { api } from "@/shared/lib/http";

export function submitScore(body: {
  gameId: string;
  score: string;
  runTimeMs: number;
}) {
  return api<{ ok: true }>("/scores", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
