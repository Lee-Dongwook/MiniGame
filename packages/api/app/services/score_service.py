from google.cloud import firestore as gcf
from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime
from services.firestore import db


def save_or_update_score(uid:str, gameId:str, score:int, runTimeMs:int):
    """
    기존 최고점보다 높은 경우에만 점수 갱신
    """
    ref = (
        db.collection("leaderboards")
        .where("uid", "==", uid)
        .where("gameId", "==", gameId)
        .limit(1)
    )

    docs = list(ref.stream())

    def is_better(game_id: str, new_score: int, prev_score: int) -> bool:
        # Reaction: lower is better. Others: higher is better.
        if game_id == "reaction":
            return new_score < prev_score or prev_score == 0
        return new_score > prev_score

    if docs:
        doc = docs[0]
        data: Dict[str, Any] | None = doc.to_dict()
        current_best = 0
        if isinstance(data, dict):
            try:
                current_best = int(data.get("score", 0))
            except Exception:
                current_best = 0

        if is_better(gameId, score, current_best):
            doc.reference.update(
                {
                    "score": score,
                    "runTimeMs": runTimeMs,
                    "createdAt": gcf.SERVER_TIMESTAMP,
                }
            )
        # else: keep existing best, do nothing
    else:
        db.collection("leaderboards").add(
            {
                "uid": uid,
                "gameId": gameId,
                "score": score,
                "runTimeMs": runTimeMs,
                "createdAt": gcf.SERVER_TIMESTAMP,
            }
        )

def get_leaderboard(
    gameId: str,
    limit: int = 20,
    cursor_score: Optional[int] = None,
    cursor_created_at: Optional[datetime] = None,
) -> Tuple[List[Dict[str, Any]], Optional[Dict[str, Any]]]:
    """
    리더보드 조회 + 페이지네이션
    reaction: score 오름차순(낮을수록 우수), 그 외: 내림차순
    동일 점수에서 createdAt으로 2차 정렬
    """
    order = gcf.Query.ASCENDING if gameId == "reaction" else gcf.Query.DESCENDING

    query = (
        db.collection("leaderboards")
        .where("gameId", "==", gameId)
        .order_by("score", direction=order)
        .order_by("createdAt", direction=order)
        .limit(limit)
    )

    if cursor_score is not None and cursor_created_at is not None:
        query = query.start_after({"score": cursor_score, "createdAt": cursor_created_at})

    docs = list(query.stream())
    items: List[Dict[str, Any]] = []
    for d in docs:
        data = d.to_dict()
        # Serialize createdAt to ISO string if present
        created_at = data.get("createdAt")
        if created_at is not None and hasattr(created_at, "isoformat"):
            data["createdAt"] = created_at.isoformat()
        data["id"] = d.id
        items.append(data)

    next_cursor = None
    if len(items) == limit:
        last = items[-1]
        next_cursor = {"score": last.get("score", 0), "createdAt": last.get("createdAt")}

    return items, next_cursor