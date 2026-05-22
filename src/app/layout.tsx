import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "数秘術 診断",
  description: "Numerology Reading App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
