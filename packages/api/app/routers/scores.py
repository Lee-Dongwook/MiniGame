from fastapi import APIRouter, Depends
from models.score import SubmitScore
from deps.auth import verify_firebase_token
from services.firestore import db
from services.score_service import save_or_update_score, get_leaderboard
from typing import Optional

router = APIRouter(prefix="/scores", tags=['scores'])

@router.post("")
async def submit_score(body:SubmitScore, uid:str = Depends(verify_firebase_token)):
    save_or_update_score(uid, body.gameId, body.score, body.runTimeMs)
    return {"ok": True}

@router.get('/leaderboard')
async def leaderboard(gameId:str, limit: int = 20, cursorScore: Optional[int] = None, cursorCreatedAt: Optional[str] = None):
    cursor_dt = None
    if cursorCreatedAt:
        try:
            from datetime import datetime
            cursor_dt = datetime.fromisoformat(cursorCreatedAt)
        except Exception:
            cursor_dt = None
    items, next_cursor = get_leaderboard(gameId, limit, cursorScore, cursor_dt)
    return {"items": items, "nextCursor": next_cursor}