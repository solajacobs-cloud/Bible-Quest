import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bible Quest",
  description: "A public Bible study game with KJV, World English Bible, and Bibeli Mimo study rounds.",
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
