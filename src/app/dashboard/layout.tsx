/* File: src/app/dashboard/layout.tsx */

"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

const iconStyle = { width: "20px", height: "20px" };

/* Menu navigasi sidebar dalam Bahasa Indonesia */
const NAV_ITEMS: NavItem[] = [
    {
        label: "Ringkasan",
        href: "/dashboard",
        icon: (
            <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        label: "Pemasukan",
        href: "/dashboard/income",
        icon: (
            <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        label: "Pengeluaran",
        href: "/dashboard/expense",
        icon: (
            <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
    },
    {
        label: "Rencana Pembelian",
        href: "/dashboard/wishlist",
        icon: (
            <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
        ),
    },
    {
        label: "Pengaturan",
        href: "/dashboard/settings",
        icon: (
            <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
];

/* Layout dashboard dengan sidebar responsif */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    /* Logout dan redirect ke login */
    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <div
                className={`fixed inset-0 bg-black/30 z-40 lg:hidden transition-opacity ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={() => setSidebarOpen(false)}
            />

            <aside
                style={{ width: "240px" }}
                className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-white flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div style={{ padding: "24px", borderBottom: "1px solid #f1f5f9" }}>
                    <Link href="/dashboard" className="flex items-center" style={{ gap: "8px" }}>
                        <div style={{ width: "36px", height: "36px", fontSize: "14px", borderRadius: "8px" }} className="bg-emerald-600 flex items-center justify-center">
                            <span className="text-white font-bold">M</span>
                        </div>
                        <span style={{ fontSize: "18px" }} className="font-bold text-emerald-600">E-Mosque</span>
                    </Link>
                </div>

                <nav style={{ padding: "12px", gap: "2px" }} className="flex-1 flex flex-col">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                style={{ fontSize: "13px", padding: "10px 14px", borderRadius: "10px" }}
                                className={`flex items-center gap-3 font-medium transition-colors ${isActive ? "bg-emerald-50 text-emerald-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ padding: "12px", borderTop: "1px solid #f1f5f9" }}>
                    <button
                        onClick={handleLogout}
                        style={{ fontSize: "13px", padding: "10px 14px", borderRadius: "10px" }}
                        className="flex items-center gap-3 font-medium text-red-500 hover:bg-red-50 transition-colors w-full"
                    >
                        <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Keluar
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-h-screen" style={{ borderLeft: "1px solid #e2e8f0" }}>
                <header className="sticky top-0 z-30 bg-white flex items-center justify-between" style={{ padding: "16px 24px", borderBottom: "1px solid #e2e8f0" }}>
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 hover:text-emerald-600" aria-label="Menu">
                        <svg style={{ width: "24px", height: "24px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="hidden lg:block" />
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p style={{ fontSize: "14px" }} className="font-semibold text-slate-800">Admin Masjid</p>
                            <p style={{ fontSize: "12px" }} className="text-slate-400">Superadmin</p>
                        </div>
                        <div style={{ width: "40px", height: "40px", fontSize: "14px", borderRadius: "50%" }} className="bg-emerald-100 flex items-center justify-center">
                            <span className="text-emerald-700 font-semibold">A</span>
                        </div>
                    </div>
                </header>
                <main style={{ padding: "24px" }} className="flex-1">{children}</main>
            </div>
        </div>
    );
}
