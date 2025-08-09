import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      common: {
        start: "Start",
        submit: "Submit",
        submitting: "Submitting...",
        viewLeaderboard: "View Leaderboard",
      },
      home: {
        title: "Choose a game",
        reaction: "Reaction",
        memory: "Memory",
        stroop: "Stroop Swipe",
        quickMath: "Quick Math",
        leaderboard: "Leaderboard",
      },
      leaderboard: {
        title: "Leaderboard",
        empty: "No data yet.",
        loadMore: "Load more",
        loading: "Loading...",
        gotoMyRank: "Go to my rank",
        game: {
          reaction: "Reaction",
          memory: "Memory",
          "stroop-swipe": "Stroop Swipe",
          "quick-math": "Quick Math",
        },
      },
      reaction: {
        title: "Reaction Test",
        wait: "Wait...",
        now: "Now!",
        next: "Next round…",
        round: "Round",
        last: "Last",
        best: "Best",
        average: "Average",
        bestLabel: "Best record",
        averageLabel: "Average",
      },
      memory: {
        title: "Memory",
        remember: "Remember...",
        follow: "Repeat the sequence",
        finalLevel: "Final level",
      },
      stroop: {
        title: "Stroop Swipe",
        time: "Time",
        correct: "Correct",
        prompt: "Follow the instruction",
        instruction: "Instruction",
        confusion: "Confusion",
        finalCorrect: "Final correct",
      },
      quickMath: {
        title: "Quick Math",
        time: "Time",
        lives: "Lives",
        correct: "Correct",
        wrong: "Wrong",
        ok: "OK",
        finalScore: "Final score",
      },
    },
  },
  ko: {
    translation: {
      common: {
        start: "시작",
        submit: "제출",
        submitting: "제출 중...",
        viewLeaderboard: "리더보드 보기",
      },
      home: {
        title: "게임을 선택하세요",
        reaction: "반응속도",
        memory: "기억력",
        stroop: "스트룹 스와이프",
        quickMath: "암산",
        leaderboard: "리더보드",
      },
      leaderboard: {
        title: "리더보드",
        empty: "아직 데이터가 없어요.",
        loadMore: "더 보기",
        loading: "로딩 중...",
        gotoMyRank: "내 순위로 이동",
        game: {
          reaction: "반응속도",
          memory: "기억력",
          "stroop-swipe": "스트룹 스와이프",
          "quick-math": "암산",
        },
      },
      reaction: {
        title: "반응속도 테스트",
        wait: "잠시만...",
        now: "지금!",
        next: "다음 라운드…",
        round: "라운드",
        last: "최근",
        best: "최고",
        average: "평균",
        bestLabel: "최고 기록",
        averageLabel: "평균",
      },
      memory: {
        title: "기억력",
        remember: "기억하세요...",
        follow: "따라 눌러보세요",
        finalLevel: "최종 레벨",
      },
      stroop: {
        title: "스트룹 스와이프",
        time: "시간",
        correct: "정답",
        prompt: "지시에 맞게 선택하세요",
        instruction: "지시",
        confusion: "혼란",
        finalCorrect: "최종 정답",
      },
      quickMath: {
        title: "암산",
        time: "시간",
        lives: "목숨",
        correct: "정답",
        wrong: "오답",
        ok: "확인",
        finalScore: "최종 점수",
      },
    },
  },
} as const;

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: Localization.getLocales()?.[0]?.languageCode ?? "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
}

export { i18n };
