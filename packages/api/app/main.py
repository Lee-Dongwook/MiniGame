from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .routers.scores import scores
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.requests import Request

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


# Standardized error handlers -> { message, code, details? }
@app.exception_handler(HTTPException)
async def handle_http_exception(request: Request, exc: HTTPException):
    content = {"message": exc.detail if isinstance(exc.detail, str) else "Error", "code": exc.status_code}
    return JSONResponse(status_code=exc.status_code, content=content)


@app.exception_handler(RequestValidationError)
async def handle_validation_error(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "message": "Validation failed",
            "code": 422,
            "details": exc.errors(),
        },
    )


@app.exception_handler(Exception)
async def handle_unexpected_error(request: Request, exc: Exception):
    # Avoid leaking internals; log could be added here in real deployment
    return JSONResponse(
        status_code=500,
        content={
            "message": "Internal server error",
            "code": 500,
        },
    )