
import LiveFeed from "../components/LiveFeed";

export default function Page() {
  return (
    <main style={{ maxWidth: 1100, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>World News (Live)</h1>
      <LiveFeed />
    </main>
  );
}
