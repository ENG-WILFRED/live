import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Service Keep-Alive",
  description: "Scheduled health checks for PayAssure services.",
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
