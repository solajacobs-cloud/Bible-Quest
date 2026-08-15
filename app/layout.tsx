import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bible Quest",
  description: "A Bible study game across KJV, World English Bible, and Yoruba Bibeli Mimo.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
