from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import scores

app = FastAPI(title="Mini Game API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials = True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scores.router)

@app.get('/health')
async def health_check():
    return {"status":"ok"}