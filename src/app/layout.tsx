// File: src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Masjid Al-Ikhlas — Sistem Informasi Keuangan Masjid",
  description:
    "Sistem informasi manajemen keuangan masjid terpadu. Transparansi dana umat yang amanah, transparan, dan profesional.",
  keywords: ["masjid", "keuangan", "zakat", "infaq", "transparansi", "donasi"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
