
export const metadata = { title: "World News Portal" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, Arial, sans-serif", background: "#fafafa" }}>
        {children}
      </body>
    </html>
  );
}
