import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { submitScore } from "@/features/score/api";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";

export default function ReactionScreen() {
  const { t } = useTranslation();
  const [state, setState] = useState<
    "idle" | "ready" | "now" | "between" | "done"
  >("idle");
  const startRef = useRef<number>(0);
  const sessionStartRef = useRef<number>(0);
  const [round, setRound] = useState<number>(0);
  const [results, setResults] = useState<number[]>([]);
  const best = results.length ? Math.min(...results) : undefined;
  const avg = results.length
    ? Math.round(results.reduce((a, b) => a + b, 0) / results.length)
    : undefined;

  const submitMut = useMutation({
    mutationFn: async () => {
      if (!best) return { ok: true } as const;
      const elapsedMs = Math.max(
        100,
        Math.round(performance.now() - sessionStartRef.current)
      );
      return submitScore({
        gameId: "reaction",
        score: best,
        runTimeMs: elapsedMs,
      });
    },
    onSuccess: () => {
      router.push("/leaderboard");
    },
  });

  function scheduleNextCue() {
    setState("ready");
    const delay = 1500 + Math.random() * 2000;
    setTimeout(() => {
      setState("now");
      startRef.current = performance.now();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, delay);
  }

  function start() {
    setRound(0);
    setResults([]);
    sessionStartRef.current = performance.now();
    scheduleNextCue();
  }
  function tap() {
    if (state !== "now") return;
    const ms = Math.round(performance.now() - startRef.current);
    setResults((prev) => [...prev, ms]);
    Haptics.selectionAsync();
    const nextRound = round + 1;
    setRound(nextRound);
    if (nextRound >= 5) {
      setState("done");
    } else {
      setState("between");
      setTimeout(() => {
        scheduleNextCue();
      }, 600);
    }
  }

  function submit() {
    if (!best || submitMut.isPending) return;
    submitMut.mutate();
  }

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>
        {t("reaction.title")}
      </Text>

      {state === "idle" && (
        <Pressable onPress={start}>
          <Text>{t("common.start")}</Text>
        </Pressable>
      )}

      {state === "ready" && <Text>{t("reaction.wait")}</Text>}

      {state === "now" && (
        <Pressable onPress={tap}>
          <Text>{t("reaction.now")}</Text>
        </Pressable>
      )}

      {state === "between" && <Text>{t("reaction.next")}</Text>}

      {results.length > 0 && (
        <View style={{ gap: 6 }}>
          <Text>
            {t("reaction.round")}: {round} / 5
          </Text>
          <Text>
            {t("reaction.last")}: {results[results.length - 1]} ms
          </Text>
          {best !== undefined && (
            <Text>
              {t("reaction.best")}: {best} ms
            </Text>
          )}
          {avg !== undefined && (
            <Text>
              {t("reaction.average")}: {avg} ms
            </Text>
          )}
        </View>
      )}

      {state === "done" && (
        <View style={{ gap: 8 }}>
          <Text>
            {t("reaction.bestLabel")}: {best} ms
          </Text>
          <Text>
            {t("reaction.averageLabel")}: {avg} ms
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
