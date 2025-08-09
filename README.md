# MiniGame Monorepo

This repo contains:

- `packages/app`: Expo (React Native) client
- `packages/api`: FastAPI backend

## Prerequisites

- Node.js 18+
- Yarn or npm
- Python 3.11+
- Firebase project (client config + Admin SDK service account)

## App setup (Expo)

Create `.env` in `packages/app` (or use Expo env secrets):

```
EXPO_PUBLIC_API_BASE_URL=https://your-api.example.com
EXPO_PUBLIC_FB_API_KEY=...
EXPO_PUBLIC_FB_AUTH_DOMAIN=...
EXPO_PUBLIC_FB_PROJECT_ID=...
EXPO_PUBLIC_FB_APP_ID=...
```

Run app:

```bash
yarn
yarn --cwd packages/app start
```

## API setup (FastAPI)

See `packages/api/README.md`.

## Testing

### Frontend tests

```bash
cd packages/app
yarn test
```

### Backend tests

```bash
cd packages/api
pytest test_score_service.py -v
```

## Games

- Reaction, Memory, Stroop Swipe, Quick Math
- Scores are submitted to backend; leaderboard supports pagination

## Error shape

Backend returns:

```json
{ "message": "...", "code": 400, "details": [ ... ] }
```

## Internationalization

- `i18next` with English/Korean resources

## CI/CD

GitHub Actions runs:

- Frontend linting
- Backend tests
- On push to main and PRs
