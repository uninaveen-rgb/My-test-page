
import express from "express";
import cors from "cors";
import Parser from "rss-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const parser = new Parser();

// Env & config
const PORT = process.env.PORT || 3001;
const FE_ORIGIN = process.env.FE_ORIGIN || "http://localhost:3000";
const FEED_URLS = (process.env.FEED_URLS || "https://feeds.bbci.co.uk/news/world/rss.xml")
  .split(",")
  .map(u => u.trim())
  .filter(Boolean);

// Shared in-memory cache
let cache = {
  fetchedAt: null,
  articles: [],   // [{title, link, publishedAt, source, summary}]
  trending: {}    // { token: count }
};

// --- Helpers -------------------------------------------------------

function normalizeItem(item, sourceUrl) {
  return {
    title: item.title || "",
    link: item.link || "",
    publishedAt: item.isoDate || item.pubDate || null,
    source: sourceUrl,
    summary: (item.contentSnippet || item.content || "").toString().slice(0, 400)
  };
}

function computeTrending(articles) {
  const stop = new Set([
    "the","a","an","of","and","to","in","on","for","with","at","from",
    "is","are","was","were","be","been","by","as","it","its","this","that",
    "after","over","into","amid","about"
  ]);

  const freq = {};
  for (const a of articles) {
    const text = `${a.title}`.toLowerCase();
    const tokens = text.split(/\W+/).filter(Boolean);
    for (const t of tokens) {
      if (stop.has(t) || t.length < 3) continue;
      freq[t] = (freq[t] || 0) + 1;
    }
  }
  return freq;
}

async function fetchAllFeeds() {
  const all = [];

  for (const url of FEED_URLS) {
    try {
      const feed = await parser.parseURL(url);
      const items = (feed.items || []).map(i => normalizeItem(i, url));
      all.push(...items);
    } catch (err) {
      console.error("Feed error:", url, err.message);
    }
  }

  // Sort newest first & trim
  const articles = all
    .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))
    .slice(0, 100);

  cache = {
    fetchedAt: new Date().toISOString(),
    articles,
    trending: computeTrending(articles)
  };
  broadcast();
}

// --- SSE plumbing --------------------------------------------------

const clients = new Set();

app.use(cors({ origin: FE_ORIGIN, methods: ["GET"], credentials: false }));

app.get("/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");

  // send current snapshot immediately
  res.write(`event: update
data: ${JSON.stringify(cache)}

`);

  // keep-alive comments
  const keepAlive = setInterval(() => res.write(`: ping

`), 15000);

  const client = { res };
  clients.add(client);

  req.on("close", () => {
    clearInterval(keepAlive);
    clients.delete(client);
  });
});

function broadcast() {
  const payload = `event: update
data: ${JSON.stringify(cache)}

`;
  for (const { res } of clients) {
    try { res.write(payload); } catch { /* ignore */ }
  }
}

// --- Bootstrap -----------------------------------------------------

// Initial fetch & periodic refresh
fetchAllFeeds();
setInterval(fetchAllFeeds, 60 * 1000); // every 60s

app.get("/", (_, res) => res.json({ ok: true, feeds: FEED_URLS, fetchedAt: cache.fetchedAt }));

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
  console.log(`Allowed FE_ORIGIN: ${FE_ORIGIN}`);
});
