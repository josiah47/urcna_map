import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "URCNA Map",
  description: "Map of URCNA churches",
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
