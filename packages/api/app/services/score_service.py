from google.cloud import firestore as gcf
from typing import Dict, Any
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

def get_leaderboard(gameId: str, limit: int = 50):
    """
    상위 limit명 리더보드 조회
    """
    order = gcf.Query.ASCENDING if gameId == "reaction" else gcf.Query.DESCENDING
    scores_ref = (
        db.collection("leaderboards")
        .where("gameId", "==", gameId)
        .order_by("score", direction=order)
        .limit(limit)
    )
    return [doc.to_dict() for doc in scores_ref.stream()]