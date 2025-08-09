import { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { submitScore } from "@/features/score/api";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";

type Phase = "idle" | "play" | "done";
type Dir = "LEFT" | "RIGHT" | "UP" | "DOWN";

const DIRS: Dir[] = ["LEFT", "RIGHT", "UP", "DOWN"];

function randomDir(): Dir {
  return DIRS[Math.floor(Math.random() * DIRS.length)];
}

export default function StroopSwipeScreen() {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<Phase>("idle");
  const [timeLeft, setTimeLeft] = useState(45);
  const [correct, setCorrect] = useState(0);
  const [mistake, setMistake] = useState(false);
  const sessionStartRef = useRef<number>(0);

  const target = useMemo(() => randomDir(), [correct, mistake]);
  const confusion = useMemo(() => randomDir(), [correct, mistake]);

  const tickRef = useRef<NodeJS.Timeout | null>(null);

  const submitMut = useMutation({
    mutationFn: async (score: number) =>
      submitScore({
        gameId: "stroop-swipe",
        score,
        runTimeMs: Math.max(
          100,
          Math.round(performance.now() - sessionStartRef.current)
        ),
      }),
    onSuccess: () => router.push("/leaderboard"),
  });

  useEffect(() => {
    if (phase !== "play") return;
    tickRef.current && clearInterval(tickRef.current);
    tickRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(tickRef.current as NodeJS.Timeout);
          setPhase("done");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      tickRef.current && clearInterval(tickRef.current);
    };
  }, [phase]);

  function start() {
    setCorrect(0);
    setMistake(false);
    setTimeLeft(45);
    setPhase("play");
    sessionStartRef.current = performance.now();
  }

  function answer(dir: Dir) {
    if (phase !== "play") return;
    if (dir === target) {
      setCorrect((c) => c + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      setMistake(true);
      setPhase("done");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      tickRef.current && clearInterval(tickRef.current);
    }
  }

  function submit() {
    if (submitMut.isPending) return;
    submitMut.mutate(correct);
  }

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>
        {t("stroop.title")}
      </Text>

      {phase === "idle" && (
        <Pressable onPress={start}>
          <Text>{t("common.start")}</Text>
        </Pressable>
      )}

      {phase === "play" && (
        <View style={{ gap: 12 }}>
          <Text>
            {t("stroop.time")}: {timeLeft}s
          </Text>
          <Text>
            {t("stroop.correct")}: {correct}
          </Text>
          <View style={{ gap: 6 }}>
            <Text>{t("stroop.prompt")}</Text>
            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <Text style={{ fontSize: 18 }}>
                {t("stroop.instruction")}: {target}
              </Text>
              <Text style={{ opacity: 0.6 }}>
                ({t("stroop.confusion")}: {confusion})
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {DIRS.map((d) => (
              <Pressable
                key={d}
                onPress={() => answer(d)}
                style={{
                  borderWidth: 1,
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 10,
                }}
              >
                <Text>
                  {d === "LEFT" && "◀"}
                  {d === "RIGHT" && "▶"}
                  {d === "UP" && "▲"}
                  {d === "DOWN" && "▼"}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {phase === "done" && (
        <View style={{ gap: 8 }}>
          <Text>
            {t("stroop.finalCorrect")}: {correct}
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
