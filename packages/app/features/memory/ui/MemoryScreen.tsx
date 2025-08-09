import { useMemo, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { submitScore } from "@/features/score/api";
import { useTranslation } from "react-i18next";

type Phase = "idle" | "show" | "input" | "done";

function generateSequence(length: number, seed?: number): number[] {
  const rnd = seed ?? Math.floor(Math.random() * 1_000_000);
  let x = rnd;
  const out: number[] = [];
  for (let i = 0; i < length; i += 1) {
    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;
    const n = Math.abs(x) % 4; // 0..3
    out.push(n);
  }
  return out;
}

export default function MemoryScreen() {
  const { t } = useTranslation();
  const [level, setLevel] = useState(1);
  const [phase, setPhase] = useState<Phase>("idle");
  const [cursor, setCursor] = useState(0);
  const [seed] = useState(() => Math.floor(Math.random() * 1_000_000));
  const sequence = useMemo(() => generateSequence(level, seed), [level, seed]);
  const sessionStartRef = useRef<number>(0);

  const submitMut = useMutation({
    mutationFn: async (finalLevel: number) =>
      submitScore({
        gameId: "memory",
        score: finalLevel,
        runTimeMs: Math.max(
          100,
          Math.round(performance.now() - sessionStartRef.current)
        ),
      }),
    onSuccess: () => router.push("/leaderboard"),
  });

  function start() {
    setPhase("show");
    setCursor(0);
    sessionStartRef.current = performance.now();
    setTimeout(() => setPhase("input"), Math.max(1500, level * 600));
  }

  function onPressPad(n: number) {
    if (phase !== "input") return;
    if (sequence[cursor] === n) {
      const next = cursor + 1;
      setCursor(next);
      if (next >= sequence.length) {
        // success -> next level
        setLevel((l) => l + 1);
        setPhase("show");
        setCursor(0);
        setTimeout(() => setPhase("input"), Math.max(1500, (level + 1) * 600));
      }
    } else {
      // fail -> done
      setPhase("done");
    }
  }

  function submit() {
    if (submitMut.isPending) return;
    // level - 1 is the last successfully cleared level
    submitMut.mutate(level - 1);
  }

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>
        {t("memory.title")}
      </Text>
      {phase === "idle" && (
        <Pressable onPress={start}>
          <Text>{t("common.start")}</Text>
        </Pressable>
      )}

      {phase === "show" && (
        <View style={{ gap: 8 }}>
          <Text>{t("memory.remember")}</Text>
          <Text>
            {sequence.map((n) => ["▲", "▶", "▼", "◀"][n]).join(" ")}
          </Text>
        </View>
      )}

      {phase === "input" && (
        <View style={{ gap: 10 }}>
          <Text>
            {t("memory.follow")} ({cursor + 1}/{sequence.length})
          </Text>
          <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
            {[0, 1, 2, 3].map((n) => (
              <Pressable
                key={n}
                onPress={() => onPressPad(n)}
                style={{
                  width: 80,
                  height: 80,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 12,
                  borderWidth: 1,
                }}
              >
                <Text style={{ fontSize: 24 }}>
                  {["▲", "▶", "▼", "◀"][n]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {phase === "done" && (
        <View style={{ gap: 8 }}>
          <Text>
            {t("memory.finalLevel")}: {level - 1}
          </Text>
          <Pressable onPress={submit} disabled={submitMut.isPending}>
            <Text>
              {submitMut.isPending
                ? t("common.submitting")
                : t("common.submit")}
            </Text>
          </Pressable>
          <Pressable onPress={() => router.push("/leaderboard")}>
            <Text>{t("common.viewLeaderboard")}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
