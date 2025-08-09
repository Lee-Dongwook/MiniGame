import { useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { submitScore } from "@/features/score/api";

export default function ReactionScreen() {
  const [state, setState] = useState<"idle" | "ready" | "now" | "done">("idle");
  const startRef = useRef<number>(0);
  const [best, setBest] = useState<number | undefined>();

  function start() {
    setState("ready");
    const delay = 1500 + Math.random() * 2000;
    setTimeout(() => {
      setState("now");
      startRef.current = performance.now();
    }, delay);
  }
  function tap() {
    if (state !== "now") return;
    const ms = Math.round(performance.now() - startRef.current);
    setBest((prev) => (prev ? Math.min(prev, ms) : ms));
    setState("done");
    // TODO: 누적 라운드/평균은 이후
  }

  async function submit() {
    if (!best) return;
    await submitScore({
      gameId: "reaction",
      score: best.toString(),
      runTimeMs: 0,
    });
  }

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text>Reaction Test</Text>
      {state === "idle" && (
        <Pressable onPress={start}>
          <Text>Start</Text>
        </Pressable>
      )}
      {state === "ready" && <Text>Wait...</Text>}
      {state === "now" && (
        <Pressable onPress={tap}>
          <Text>지금!</Text>
        </Pressable>
      )}
      {state === "done" && (
        <>
          <Text>Best: {best} ms</Text>
          <Pressable onPress={submit}>
            <Text>Submit</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
