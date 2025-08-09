from fastapi import APIRouter, Depends
from models.score import SubmitScore
from deps.auth import verify_firebase_token
from services.firestore import db

router = APIRouter(prefix="/scores", tags=['scores'])

@router.post("")
async def submit_score(body:SubmitScore, uid:str = Depends(verify_firebase_token)):
    db.collection("leaderboards").add({
        "uid": uid,
        "gameId": body.gameId,
        "score": body.score,
        "runTimeMs": body.runTimeMs
    })
    return {"ok": True}

@router.get('/leaderboard')
async def get_leaderboard(gameId:str):
    scores_ref = (
        db.collection("leaderboards")
        .where("gameId", "==", gameId)
        .order_by("score", direction="DESCENDING")
        .limit(50)
    )
    scores = [doc.to_dict() for doc in scores_ref.stream()]
    return {"items": scores}