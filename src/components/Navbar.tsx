// File: src/components/Navbar.tsx

"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "Transparansi", href: "#transparansi" },
  { label: "Kalkulator Zakat", href: "#kalkulator" },
  { label: "Donasi", href: "#donasi" },
  { label: "Kontak", href: "#kontak" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm"
      style={{ borderBottom: "1px solid #e2e8f0" }}
    >
      <div style={{ maxWidth: "1140px", height: "60px", padding: "0 24px" }} className="mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center" style={{ gap: "10px" }}>
          <div
            style={{ width: "32px", height: "32px", borderRadius: "8px", fontSize: "13px" }}
            className="bg-emerald-600 flex items-center justify-center"
          >
            <span className="text-white font-bold">M</span>
          </div>
          <span style={{ fontSize: "15px" }} className="font-bold text-slate-800">Masjid Al-Ikhlas</span>
        </Link>

        <div className="hidden md:flex items-center" style={{ gap: "28px" }}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{ fontSize: "13px" }}
              className="text-slate-500 hover:text-emerald-600 transition-colors font-medium"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/login"
            style={{ fontSize: "12px", padding: "8px 18px", borderRadius: "8px" }}
            className="bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
          >
            Halaman Takmir
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-slate-500"
          aria-label="Menu"
        >
          <svg style={{ width: "22px", height: "22px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100" style={{ padding: "16px 24px" }}>
          <div className="flex flex-col" style={{ gap: "12px" }}>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} style={{ fontSize: "14px" }} className="text-slate-600 hover:text-emerald-600" onClick={() => setMobileOpen(false)}>
                {link.label}
              </a>
            ))}
            <Link href="/login" style={{ fontSize: "13px", padding: "10px 0", borderRadius: "8px" }} className="bg-emerald-600 text-white font-semibold text-center hover:bg-emerald-700">
              Halaman Takmir
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
