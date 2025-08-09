from fastapi import APIRouter, Depends
from models.score import SubmitScore
from deps.auth import verify_firebase_token
from services.firestore import db
from services.score_service import save_or_update_score, get_leaderboard

router = APIRouter(prefix="/scores", tags=['scores'])

@router.post("")
async def submit_score(body:SubmitScore, uid:str = Depends(verify_firebase_token)):
    save_or_update_score(uid, body.gameId, body.score, body.runTimeMs)
    return {"ok": True}

@router.get('/leaderboard')
async def leaderboard(gameId:str):
    items = get_leaderboard(gameId)
    return {"items": items}