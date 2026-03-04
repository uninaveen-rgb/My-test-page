
# API

Aggregates RSS feeds and streams live updates via Server-Sent Events (SSE).

## Setup

```bash
cp .env.example .env
# (optionally edit FEED_URLS, FE_ORIGIN, PORT)
npm install
npm run dev
```

- SSE endpoint: `GET /stream`
- Health: `GET /`
