import { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { submitScore } from "@/features/score/api";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";

type Phase = "idle" | "play" | "done";

interface Question {
  a: number;
  b: number;
  op: "+" | "-";
  answer: number;
}

function generateQuestion(level: number): Question {
  const max = Math.min(10 + level * 2, 99);
  const a = Math.floor(Math.random() * max) + 1;
  const b = Math.floor(Math.random() * max) + 1;
  const op: "+" | "-" = Math.random() < 0.5 ? "+" : "-";
  const answer = op === "+" ? a + b : a - b;
  return { a, b, op, answer };
}

export default function QuickMathScreen() {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<Phase>("idle");
  const [timeLeft, setTimeLeft] = useState(60);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [input, setInput] = useState("");

  const question = useMemo(
    () => generateQuestion(level),
    [level, correctCount, wrongCount]
  );

  const tickRef = useRef<NodeJS.Timeout | null>(null);

  const score = Math.max(correctCount * 10 - wrongCount * 5, 0);

  const submitMut = useMutation({
    mutationFn: async () =>
      submitScore({
        gameId: "quick-math",
        score,
        runTimeMs: 60_000 - timeLeft * 1000,
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
    return () => tickRef.current && clearInterval(tickRef.current);
  }, [phase]);

  useEffect(() => {
    if (lives <= 0 && phase === "play") {
      setPhase("done");
      tickRef.current && clearInterval(tickRef.current);
    }
  }, [lives, phase]);

  function start() {
    setPhase("play");
    setTimeLeft(60);
    setLives(3);
    setLevel(1);
    setCorrectCount(0);
    setWrongCount(0);
    setInput("");
  }

  function submitAnswer() {
    const value = Number(input.trim());
    if (Number.isNaN(value)) return;
    if (value === question.answer) {
      setCorrectCount((c) => c + 1);
      setLevel((l) => l + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      setWrongCount((w) => w + 1);
      setLives((hp) => hp - 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    setInput("");
  }

  function finalize() {
    if (submitMut.isPending) return;
    submitMut.mutate();
  }

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>
        {t("quickMath.title")}
      </Text>

      {phase === "idle" && (
        <Pressable onPress={start}>
          <Text>{t("common.start")}</Text>
        </Pressable>
      )}

      {phase === "play" && (
        <View style={{ gap: 12 }}>
          <Text>
            {t("quickMath.time")}: {timeLeft}s
          </Text>
          <Text>
            {t("quickMath.lives")}: {lives}
          </Text>
          <Text>
            {t("quickMath.correct")}: {correctCount} / {t("quickMath.wrong")}:{" "}
            {wrongCount}
          </Text>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Text style={{ fontSize: 18 }}>
              {question.a} {question.op} {question.b} =
            </Text>
            <TextInput
              value={input}
              onChangeText={setInput}
              keyboardType="numeric"
              placeholder="?"
              style={{
                borderWidth: 1,
                paddingHorizontal: 8,
                paddingVertical: 6,
                borderRadius: 8,
                minWidth: 80,
              }}
              onSubmitEditing={submitAnswer}
              returnKeyType="done"
              autoFocus
            />
            <Pressable
              onPress={submitAnswer}
              style={{
                borderWidth: 1,
                paddingHorizontal: 10,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <Text>{t("quickMath.ok")}</Text>
            </Pressable>
          </View>
        </View>
      )}

      {phase === "done" && (
        <View style={{ gap: 8 }}>
          <Text>
            {t("quickMath.finalScore")}: {score}
          </Text>
          <Pressable onPress={finalize} disabled={submitMut.isPending}>
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
