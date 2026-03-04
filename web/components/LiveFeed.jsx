
"use client";

import { useEffect, useState, useMemo } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001";

export default function LiveFeed() {
  const [articles, setArticles] = useState([]);
  const [trending, setTrending] = useState({});
  const [asOf, setAsOf] = useState(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const es = new EventSource(`${API_BASE}/stream`);
    const onUpdate = (e) => {
      const data = JSON.parse(e.data);
      setArticles(data.articles || []);
      setTrending(data.trending || {});
      setAsOf(data.fetchedAt || null);
    };
    es.addEventListener("update", onUpdate);
    es.onerror = () => { /* connection closed/retry by browser */ };
    return () => es.close();
  }, []);

  const filtered = useMemo(() => {
    if (!filter) return articles;
    const q = filter.toLowerCase();
    return articles.filter(a =>
      (a.title || "").toLowerCase().includes(q) ||
      (a.summary || "").toLowerCase().includes(q)
    );
  }, [articles, filter]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
      <section style={{ background: "#fff", border: "1px solid #eee", borderRadius: 10, padding: 16 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
          <input
            placeholder="Search headlines..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ flex: 1, padding: 8, border: "1px solid #ddd", borderRadius: 6 }}
          />
          <small style={{ color: "#666" }}>{asOf ? `Updated: ${new Date(asOf).toLocaleTimeString()}` : "Connecting..."}</small>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {filtered.map((a, i) => (
            <article key={`${a.link}-${i}`} style={{ border: "1px solid #eee", borderRadius: 8, padding: 12, background: "#fff" }}>
              <h3 style={{ margin: "0 0 6px", fontSize: 18 }}>{a.title}</h3>
              {a.summary && <p style={{ margin: "0 0 6px", color: "#444" }}>{a.summary}</p>}
              <div style={{ display: "flex", gap: 10, fontSize: 12, color: "#777" }}>
                {a.publishedAt && <span>{new Date(a.publishedAt).toLocaleString()}</span>}
                <span>Source: {a.source ? new URL(a.source).hostname : "unknown"}</span>
              </div>
              <div style={{ marginTop: 8 }}>
                <a href={a.link} target="_blank" rel="noreferrer" style={{ color: "#0a58ca" }}>Read full article →</a>
              </div>
            </article>
          ))}
        </div>
        {!filtered.length && <p style={{ color: "#777" }}>No results.</p>}
      </section>

      <aside style={{ background: "#fff", border: "1px solid #eee", borderRadius: 10, padding: 16 }}>
        <h2 style={{ fontSize: 18, marginTop: 0 }}>Trending topics</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {Object.entries(trending)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20)
            .map(([word, count]) => (
              <li key={word} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dashed #f0f0f0" }}>
                <span>{word}</span>
                <span style={{ color: "#666" }}>{count}</span>
              </li>
            ))}
        </ul>
        {!Object.keys(trending).length && <p style={{ color: "#777" }}>Collecting signals…</p>}
      </aside>
    </div>
  );
}
