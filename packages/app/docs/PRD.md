# Mini Games MVP — Product Requirements Document

## 1. Overview

- 플랫폼: React Native (Expo) + FastAPI + Firebase
- 목적: 빠른 플레이 & 점수 공유 기반의 4종 미니게임 제공
- 출시 범위: iOS + Android (익명 로그인, 글로벌 랭킹)

---

## 2. Game List & Rules

### 1) 반응속도 테스트 (reaction)

- 규칙: “준비→랜덤 대기(1.5~3.5s)→**지금!** 표시→터치”
- 측정: ms 단위, 최소값이 최고 기록
- 점수: `score = bestMs` (int)
- 종료: 5회 시도 후 평균 + 최고 기록 표시
- 공유문구: "내 반응속도 **{bestMs}ms**! 너도 해봐 👉 {link}"

### 2) 기억력 챌린지 (memory)

- 규칙: 색/숫자/패턴 시퀀스 따라하기
- 단계별 +1 길이, 틀리면 종료
- 점수: `score = reachedLevel`
- 공유문구: "기억력 **{level}단계** 돌파!"

### 3) 좌우 혼란 (stroop-swipe)

- 규칙: 텍스트 지시(정답 기준) vs 시각 힌트(혼란)
- 제한시간 45~60초, 오답 즉시 종료
- 점수: `score = correctCount`
- 공유문구: "뇌 빙글 도전, 정답 **{n}개**"

### 4) 초간단 계산 (quick-math)

- 규칙: 제한시간 내 덧셈/뺄셈 문제 풀이
- 오답 시 -1 생명(기본 3), 0되면 종료
- 점수: `score = correctCount * 10 - wrongCount * 5` (하한 0)
- 공유문구: "암산 점수 **{score}점**"

---

## 3. Common Flow

1. 앱 실행 → 익명 로그인(Firebase)
2. 메인화면에서 게임 선택
3. 게임 플레이
4. 결과 화면에서 점수 제출 (`POST /scores`)
5. 리더보드 조회 (`GET /scores/leaderboard`)

---
