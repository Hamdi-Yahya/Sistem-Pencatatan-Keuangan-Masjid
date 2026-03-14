// File: src/components/TransparencySection.tsx

"use client";

import { useEffect, useState } from "react";
import { formatRupiah } from "@/lib/utils";

interface StatsData {
    totalBalance: number;
    totalIncome: number;
    totalExpense: number;
    periodLabel: string;
}

export default function TransparencySection() {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/dashboard/stats")
            .then((res) => res.json())
            .then((data) => { setStats(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const lastUpdate = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date());

    return (
        <section id="transparansi" style={{ padding: "60px 0" }} className="bg-slate-50">
            <div style={{ maxWidth: "1140px", padding: "0 24px" }} className="mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center" style={{ marginBottom: "28px" }}>
                    <div>
                        <h2 style={{ fontSize: "22px", marginBottom: "4px" }} className="font-bold text-slate-900">Transparansi Kas</h2>
                        <p style={{ fontSize: "13px" }} className="text-slate-500">Update real-time posisi keuangan Masjid Al-Ikhlas.</p>
                    </div>
                    <p style={{ fontSize: "12px" }} className="text-slate-400 mt-2 sm:mt-0">Terakhir di-update: {lastUpdate}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "20px" }}>
                    <div
                        className="bg-white hover:shadow-md transition-shadow"
                        style={{ padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}
                    >
                        <div
                            style={{ width: "44px", height: "44px", borderRadius: "12px", marginBottom: "16px" }}
                            className="bg-slate-100 flex items-center justify-center"
                        >
                            <svg style={{ width: "20px", height: "20px" }} className="text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <p style={{ fontSize: "12px", marginBottom: "4px" }} className="text-slate-500">Total Saldo Kas</p>
                        <p style={{ fontSize: "22px" }} className="font-bold text-slate-900">
                            {loading ? "..." : formatRupiah(stats?.totalBalance || 0)}
                        </p>
                    </div>

                    <div
                        className="bg-white hover:shadow-md transition-shadow"
                        style={{ padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}
                    >
                        <div
                            style={{ width: "44px", height: "44px", borderRadius: "12px", marginBottom: "16px" }}
                            className="bg-emerald-50 flex items-center justify-center"
                        >
                            <svg style={{ width: "20px", height: "20px" }} className="text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                            </svg>
                        </div>
                        <p style={{ fontSize: "12px", marginBottom: "4px" }} className="text-slate-500">Pemasukan Bulan Ini</p>
                        <p style={{ fontSize: "22px" }} className="font-bold text-emerald-600">
                            {loading ? "..." : `+ ${formatRupiah(stats?.totalIncome || 0)}`}
                        </p>
                    </div>

                    <div
                        className="bg-white hover:shadow-md transition-shadow"
                        style={{ padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}
                    >
                        <div
                            style={{ width: "44px", height: "44px", borderRadius: "12px", marginBottom: "16px" }}
                            className="bg-red-50 flex items-center justify-center"
                        >
                            <svg style={{ width: "20px", height: "20px" }} className="text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                            </svg>
                        </div>
                        <p style={{ fontSize: "12px", marginBottom: "4px" }} className="text-slate-500">Pengeluaran Bulan Ini</p>
                        <p style={{ fontSize: "22px" }} className="font-bold text-red-500">
                            {loading ? "..." : `- ${formatRupiah(stats?.totalExpense || 0)}`}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
