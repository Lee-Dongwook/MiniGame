from pydantic import BaseModel, Field

class SubmitScore(BaseModel):
    gameId: str = Field(..., min_length=2)
    score: int = Field(..., ge=0, le=1_000_000)
    runTimeMs: int = Field(...,ge=100)