import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PayAssure Service Monitor",
  description:
    "A lightweight keep-alive monitor for PayAssure services, checking every 10 minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
