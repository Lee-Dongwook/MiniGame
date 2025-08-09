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

    if docs:
        doc = docs[0]
        
        data: Dict[str, Any]| None = doc.to_dict()
        if isinstance(data, Dict) and score > data.get('score',0):
            doc.reference.update({
                "score": score,
                "runTimeMs": runTimeMs,
                "createdAt": gcf.SERVER_TIMESTAMP
            })
        else:
            db.collection("leaderboards").add({
                "uid": uid,
                "gameId": gameId,
                "score": score,
                "runTimeMs": runTimeMs,
                "createdAt": gcf.SERVER_TIMESTAMP
            })

def get_leaderboard(gameId: str, limit: int = 50):
    """
    상위 limit명 리더보드 조회
    """
    scores_ref = (
        db.collection("leaderboards")
        .where("gameId", "==", gameId)
        .order_by("score", direction="DESCENDING")
        .limit(limit)
    )
    return [doc.to_dict() for doc in scores_ref.stream()]