/* File: src/app/dashboard/income/page.tsx */

"use client";

import { useEffect, useState, useCallback } from "react";
import { formatRupiah, getCategoryLabel, formatDateShort } from "@/lib/utils";

interface Transaction {
    id: string;
    amount: number;
    type: string;
    category: string;
    donorName: string | null;
    notes: string | null;
    createdAt: string;
}

interface Donation {
    id: string;
    campaignId: string;
    donorName: string;
    phone: string;
    message: string | null;
    proofImage: string | null;
    amount: number;
    status: string;
    createdAt: string;
}

const CAMPAIGN_MAP: Record<string, string> = {
    "zakat-fitrah": "Zakat Fitrah 1446H",
    "qurban": "Qurban Kemanusiaan",
    "sedekah-jumat": "Sedekah Jumat Berkah",
};

const CATEGORY_FILTER = [
    { value: "", label: "Semua Kategori" },
    { value: "ZAKAT_FITRAH", label: "Zakat Fitrah" },
    { value: "ZAKAT_MAAL", label: "Zakat Maal" },
    { value: "QURBAN", label: "Qurban" },
    { value: "INFAQ", label: "Infaq / Sedekah" },
];

/* Halaman pemasukan — transaksi income + donasi per jenis (dropdown) */
export default function IncomePage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [donations, setDonations] = useState<Donation[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [categoryFilter, setCategoryFilter] = useState("");
    const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [verifyingId, setVerifyingId] = useState<string | null>(null);

    /* Ambil data transaksi dari API */
    const fetchTransactions = useCallback(async () => {
        try {
            const url = `/api/transactions?page=${page}&limit=10&type=INCOME${categoryFilter ? `&category=${categoryFilter}` : ""}`;
            const res = await fetch(url);
            const data = await res.json();
            setTransactions(data.transactions || []);
            setTotalPages(data.totalPages || 1);
        } catch { /* empty */ }
        finally { setLoading(false); }
    }, [page, categoryFilter]);

    /* Ambil data donasi dari API */
    const fetchDonations = useCallback(async () => {
        try {
            const res = await fetch("/api/donations");
            const data = await res.json();
            setDonations(data.donations || []);
        } catch { /* empty */ }
    }, []);

    useEffect(() => { fetchTransactions(); }, [fetchTransactions]);
    useEffect(() => { fetchDonations(); }, [fetchDonations]);

    /* Verifikasi donasi oleh admin */
    async function handleVerify(donationId: string, status: string) {
        setVerifyingId(donationId);
        try {
            const res = await fetch(`/api/donations/${donationId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            const data = await res.json();
            if (data.success) {
                fetchDonations();
                fetchTransactions();
            } else { alert(data.error); }
        } catch { alert("Gagal memverifikasi"); }
        finally { setVerifyingId(null); }
    }

    /* Kelompokkan donasi berdasarkan campaignId */
    const donationsByCampaign: Record<string, Donation[]> = {};
    donations.forEach((d) => {
        if (!donationsByCampaign[d.campaignId]) donationsByCampaign[d.campaignId] = [];
        donationsByCampaign[d.campaignId].push(d);
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center" style={{ height: "256px" }}>
                <div style={{ width: "32px", height: "32px", borderWidth: "4px" }} className="border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center" style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "22px" }} className="font-bold text-slate-900">Pemasukan</h1>
                <select
                    value={categoryFilter}
                    onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                    style={{ fontSize: "13px", padding: "8px 14px", borderRadius: "10px", border: "1px solid #e2e8f0", marginTop: "8px" }}
                    className="text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:mt-0"
                >
                    {CATEGORY_FILTER.map((cf) => (
                        <option key={cf.value} value={cf.value}>{cf.label}</option>
                    ))}
                </select>
            </div>

            {/* Tabel transaksi pemasukan */}
            <div className="bg-white overflow-hidden" style={{ borderRadius: "16px", border: "1px solid #e2e8f0", marginBottom: "32px" }}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <th style={{ fontSize: "11px", padding: "14px 20px" }} className="text-left font-semibold text-slate-500 uppercase tracking-wider">Tanggal</th>
                                <th style={{ fontSize: "11px", padding: "14px 20px" }} className="text-left font-semibold text-slate-500 uppercase tracking-wider">Kategori</th>
                                <th style={{ fontSize: "11px", padding: "14px 20px" }} className="text-left font-semibold text-slate-500 uppercase tracking-wider">Donatur</th>
                                <th style={{ fontSize: "11px", padding: "14px 20px" }} className="text-right font-semibold text-slate-500 uppercase tracking-wider">Nominal</th>
                                <th style={{ fontSize: "11px", padding: "14px 20px" }} className="text-left font-semibold text-slate-500 uppercase tracking-wider">Keterangan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-50 transition-colors" style={{ borderBottom: "1px solid #f8fafc" }}>
                                    <td style={{ fontSize: "13px", padding: "14px 20px" }} className="text-slate-500">{formatDateShort(tx.createdAt)}</td>
                                    <td style={{ fontSize: "13px", padding: "14px 20px" }} className="text-slate-800">{getCategoryLabel(tx.category)}</td>
                                    <td style={{ fontSize: "13px", padding: "14px 20px" }} className="text-slate-600">{tx.donorName || "-"}</td>
                                    <td style={{ fontSize: "14px", padding: "14px 20px" }} className="font-semibold text-emerald-600 text-right">{formatRupiah(tx.amount)}</td>
                                    <td style={{ fontSize: "13px", padding: "14px 20px" }} className="text-slate-500">{tx.notes || "-"}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan={5} style={{ fontSize: "14px", padding: "48px 20px" }} className="text-center text-slate-400">Belum ada pemasukan</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-end gap-2" style={{ padding: "16px 20px" }}>
                        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                            style={{ width: "36px", height: "36px", fontSize: "14px" }}
                            className="flex items-center justify-center border border-slate-200 rounded-lg text-slate-600 hover:border-emerald-600 transition-colors disabled:opacity-30">‹</button>
                        <span style={{ fontSize: "13px" }} className="text-slate-500">{page} / {totalPages}</span>
                        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                            style={{ width: "36px", height: "36px", fontSize: "14px" }}
                            className="flex items-center justify-center border border-slate-200 rounded-lg text-slate-600 hover:border-emerald-600 transition-colors disabled:opacity-30">›</button>
                    </div>
                )}
            </div>

            {/* Dropdown donasi per jenis campaign */}
            <div style={{ marginBottom: "16px" }}>
                <h2 style={{ fontSize: "18px", marginBottom: "16px" }} className="font-bold text-slate-900">Donasi per Program</h2>
                <div className="flex flex-col" style={{ gap: "12px" }}>
                    {Object.entries(CAMPAIGN_MAP).map(([campaignId, campaignTitle]) => {
                        const campaignDonations = donationsByCampaign[campaignId] || [];
                        const isExpanded = expandedCampaign === campaignId;
                        const totalAmount = campaignDonations.filter((d) => d.status === "VERIFIED").reduce((sum, d) => sum + d.amount, 0);

                        return (
                            <div key={campaignId} className="bg-white overflow-hidden" style={{ borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                                <button
                                    onClick={() => setExpandedCampaign(isExpanded ? null : campaignId)}
                                    className="w-full flex items-center justify-between hover:bg-slate-50 transition-colors"
                                    style={{ padding: "16px 20px" }}
                                >
                                    <div className="flex items-center" style={{ gap: "12px" }}>
                                        <h3 style={{ fontSize: "14px" }} className="font-semibold text-slate-800">{campaignTitle}</h3>
                                        <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "20px" }} className="bg-emerald-50 text-emerald-600 font-medium">
                                            {campaignDonations.length} donasi
                                        </span>
                                    </div>
                                    <div className="flex items-center" style={{ gap: "12px" }}>
                                        <span style={{ fontSize: "13px" }} className="font-semibold text-emerald-600">{formatRupiah(totalAmount)}</span>
                                        <svg style={{ width: "16px", height: "16px", transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                                            className="text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>

                                {isExpanded && (
                                    <div style={{ borderTop: "1px solid #f1f5f9" }}>
                                        {campaignDonations.length > 0 ? campaignDonations.map((d) => (
                                            <div key={d.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-slate-50 transition-colors" style={{ padding: "12px 20px", borderBottom: "1px solid #f8fafc" }}>
                                                <div>
                                                    <p style={{ fontSize: "13px" }} className="font-medium text-slate-800">{d.donorName}</p>
                                                    <p style={{ fontSize: "11px" }} className="text-slate-400">{d.phone} — {formatDateShort(d.createdAt)}</p>
                                                    {d.message && <p style={{ fontSize: "12px", marginTop: "2px" }} className="text-slate-500 italic">{d.message}</p>}
                                                </div>
                                                <div className="flex items-center" style={{ gap: "10px", marginTop: "8px" }}>
                                                    <span style={{ fontSize: "13px" }} className="font-semibold text-slate-800">{formatRupiah(d.amount)}</span>
                                                    {d.proofImage && (
                                                        <a href={d.proofImage} target="_blank" rel="noopener noreferrer"
                                                            style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "6px" }}
                                                            className="bg-blue-50 text-blue-600 font-medium hover:bg-blue-100">Bukti</a>
                                                    )}
                                                    {d.status === "PENDING" ? (
                                                        <div className="flex gap-1">
                                                            <button onClick={() => handleVerify(d.id, "VERIFIED")} disabled={verifyingId === d.id}
                                                                style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "6px" }}
                                                                className="bg-emerald-50 text-emerald-600 font-medium hover:bg-emerald-100 disabled:opacity-50">Verifikasi</button>
                                                            <button onClick={() => handleVerify(d.id, "REJECTED")} disabled={verifyingId === d.id}
                                                                style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "6px" }}
                                                                className="bg-red-50 text-red-600 font-medium hover:bg-red-100 disabled:opacity-50">Tolak</button>
                                                        </div>
                                                    ) : (
                                                        <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "6px" }}
                                                            className={`font-medium ${d.status === "VERIFIED" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                                                            {d.status === "VERIFIED" ? "Terverifikasi" : "Ditolak"}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )) : (
                                            <div style={{ padding: "24px 20px" }} className="text-center">
                                                <p style={{ fontSize: "13px" }} className="text-slate-400">Belum ada donasi untuk program ini</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
