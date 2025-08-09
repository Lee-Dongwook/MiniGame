# Mini Game API

## 1. Create virtualenv and install deps

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r packages/api/requirements.txt
```

## 2. Environment variables

Create a `.env` file in `packages/api/`:

```
FIREBASE_CREDENTIALS=/absolute/path/to/firebase-service-account.json
```

- The JSON is a Firebase Admin SDK service account key.

## 3. Run server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- Health check: `GET /health`
- Scores:
  - `POST /scores` (Authorization: Bearer <ID_TOKEN>)
  - `GET /scores/leaderboard?gameId=reaction&limit=20`

## 4. Error shape

All errors are standardized as:

```json
{ "message": "...", "code": 400, "details": [ ... ] }
```
