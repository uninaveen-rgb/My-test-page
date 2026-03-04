
# World News Portal (Minimal + Clean)

Live world news via RSS with a simple trending panel.

## Quick start

### 1) API

```bash
cd api
cp .env.example .env
npm install
npm run dev
```

### 2) Web

```bash
cd ../web
npm install
# (optional) export NEXT_PUBLIC_API_BASE=http://localhost:3001
npm run dev
```

### 3) Open

- Frontend: http://localhost:3000
- API health: http://localhost:3001/
- SSE stream: http://localhost:3001/stream

## Customize feeds

Edit `api/.env` → `FEED_URLS`:

```
FEED_URLS=https://feeds.bbci.co.uk/news/world/rss.xml,https://feeds.bbci.co.uk/news/technology/rss.xml
```

## Notes

- MVP by design: Trending is simple (title tokens). Enhance later with better NLP/entities.
- To deploy: host `api/` on a Node host (Render/ Railway/ Vercel Functions w/ SSE support) and `web/` on Vercel/Netlify; set `NEXT_PUBLIC_API_BASE`.
