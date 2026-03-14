// File: src/app/dashboard/page.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import { formatRupiah, getCategoryLabel, formatDateShort } from "@/lib/utils";

interface StatsData {
    totalIncome: number;
    totalExpense: number;
    totalBalance: number;
    periodLabel: string;
}

interface Transaction {
    id: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    category: string;
    status: string;
    donorName: string | null;
    notes: string | null;
    createdAt: string;
}

interface TransactionsResponse {
    transactions: Transaction[];
    total: number;
    page: number;
    totalPages: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [txData, setTxData] = useState<TransactionsResponse | null>(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [expenseForm, setExpenseForm] = useState({ amount: "", category: "OPERASIONAL", notes: "" });
    const [expenseLoading, setExpenseLoading] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [statsRes, txRes] = await Promise.all([
                fetch("/api/dashboard/stats"),
                fetch(`/api/transactions?page=${page}&limit=10`),
            ]);
            const statsData = await statsRes.json();
            const txDataResult = await txRes.json();
            setStats(statsData);
            setTxData(txDataResult);
        } catch {
            console.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => { fetchData(); }, [fetchData]);

    async function handleExpenseSubmit(e: React.FormEvent) {
        e.preventDefault();
        setExpenseLoading(true);
        try {
            const res = await fetch("/api/transactions/expense", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: parseInt(expenseForm.amount.replace(/\D/g, ""), 10),
                    category: expenseForm.category,
                    notes: expenseForm.notes,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setShowExpenseModal(false);
                setExpenseForm({ amount: "", category: "OPERASIONAL", notes: "" });
                fetchData();
            } else {
                alert(data.error || "Gagal menyimpan");
            }
        } catch {
            alert("Terjadi kesalahan jaringan");
        } finally {
            setExpenseLoading(false);
        }
    }

    async function handleDownloadPDF() {
        setPdfLoading(true);
        try {
            const res = await fetch("/api/reports/pdf");
            const reportData = await res.json();
            if (reportData.error) { alert(reportData.error); return; }

            const { jsPDF } = await import("jspdf");
            const autoTable = (await import("jspdf-autotable")).default;
            const doc = new jsPDF();

            doc.setFontSize(18);
            doc.text("Laporan Keuangan Masjid Al-Ikhlas", 14, 22);
            doc.setFontSize(11);
            doc.setTextColor(100);
            doc.text(`Periode: ${reportData.period}`, 14, 32);
            doc.text(`Dicetak: ${formatDateShort(reportData.generatedAt)}`, 14, 38);
            doc.setFontSize(12);
            doc.setTextColor(0);
            doc.text(`Total Pemasukan : ${formatRupiah(reportData.totalIncome)}`, 14, 52);
            doc.text(`Total Pengeluaran : ${formatRupiah(reportData.totalExpense)}`, 14, 60);
            doc.text(`Saldo : ${formatRupiah(reportData.balance)}`, 14, 68);

            if (reportData.transactions?.length > 0) {
                autoTable(doc, {
                    startY: 78,
                    head: [["Tanggal", "Kategori", "Tipe", "Nominal", "Keterangan"]],
                    body: reportData.transactions.map(
                        (t: { date: string; category: string; type: string; amountFormatted: string; notes: string }) => [
                            formatDateShort(t.date), t.category, t.type, t.amountFormatted, t.notes,
                        ]
                    ),
                    styles: { fontSize: 9 },
                    headStyles: { fillColor: [5, 150, 105] },
                });
            }

            doc.save(`laporan-keuangan-${reportData.period.replace(/\s/g, "-")}.pdf`);
        } catch (error) {
            console.error("PDF error:", error);
            alert("Gagal membuat PDF");
        } finally {
            setPdfLoading(false);
        }
    }

    const btnIcon = { width: "16px", height: "16px" };

    if (loading) {
        return (
            <div className="flex items-center justify-center" style={{ height: "256px" }}>
                <div style={{ width: "32px", height: "32px", borderWidth: "4px" }} className="border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginBottom: "32px" }}>
                <div style={{ padding: "24px" }} className="bg-white rounded-2xl border border-slate-200">
                    <p style={{ fontSize: "13px" }} className="text-slate-500 mb-1">Total Pemasukan</p>
                    <p style={{ fontSize: "28px" }} className="font-bold text-slate-900">
                        {formatRupiah(stats?.totalIncome || 0)}
                    </p>
                    <p style={{ fontSize: "12px", marginTop: "8px" }} className="text-slate-400">
                        Periode: {stats?.periodLabel || "-"}
                    </p>
                </div>

                <div style={{ padding: "24px" }} className="bg-white rounded-2xl border border-red-200">
                    <p style={{ fontSize: "13px" }} className="text-slate-500 mb-1">Total Pengeluaran</p>
                    <p style={{ fontSize: "28px" }} className="font-bold text-red-600">
                        {formatRupiah(stats?.totalExpense || 0)}
                    </p>
                    <p style={{ fontSize: "12px", marginTop: "8px" }} className="text-slate-400">
                        Periode: {stats?.periodLabel || "-"}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3" style={{ marginBottom: "32px" }}>
                <button
                    onClick={() => setShowExpenseModal(true)}
                    style={{ fontSize: "13px", padding: "10px 20px" }}
                    className="bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                    <svg style={btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Pengeluaran
                </button>
                <button
                    onClick={handleDownloadPDF}
                    disabled={pdfLoading}
                    style={{ fontSize: "13px", padding: "10px 20px" }}
                    className="border border-slate-300 text-slate-700 font-semibold rounded-xl hover:border-emerald-600 hover:text-emerald-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    <svg style={btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {pdfLoading ? "Memproses..." : "Download Laporan PDF"}
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th style={{ fontSize: "11px", padding: "16px 24px" }} className="text-left font-semibold text-slate-500 uppercase tracking-wider">Kategori</th>
                                <th style={{ fontSize: "11px", padding: "16px 24px" }} className="text-left font-semibold text-slate-500 uppercase tracking-wider">Tipe</th>
                                <th style={{ fontSize: "11px", padding: "16px 24px" }} className="text-right font-semibold text-slate-500 uppercase tracking-wider">Nominal</th>
                                <th style={{ fontSize: "11px", padding: "16px 24px" }} className="text-left font-semibold text-slate-500 uppercase tracking-wider">Keterangan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {txData?.transactions && txData.transactions.length > 0 ? (
                                txData.transactions.map((tx) => (
                                    <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                        <td style={{ fontSize: "14px", padding: "16px 24px" }} className="text-slate-800">{getCategoryLabel(tx.category)}</td>
                                        <td style={{ padding: "16px 24px" }}>
                                            <span
                                                style={{ fontSize: "12px", padding: "4px 12px" }}
                                                className={`inline-block font-semibold rounded-full ${tx.type === "INCOME" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
                                            >
                                                {tx.type === "INCOME" ? "Masuk" : "Keluar"}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: "14px", padding: "16px 24px" }} className={`font-semibold text-right ${tx.type === "INCOME" ? "text-emerald-600" : "text-red-600"}`}>
                                            {formatRupiah(tx.amount)}
                                        </td>
                                        <td style={{ fontSize: "14px", padding: "16px 24px" }} className="text-slate-500">{tx.notes || "-"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} style={{ fontSize: "14px", padding: "48px 24px" }} className="text-center text-slate-400">
                                        Belum ada transaksi
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {txData && txData.totalPages > 1 && (
                    <div className="flex items-center justify-end gap-2" style={{ padding: "16px 24px" }} >
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page <= 1}
                            style={{ width: "36px", height: "36px", fontSize: "14px" }}
                            className="flex items-center justify-center border border-slate-200 rounded-lg text-slate-600 hover:border-emerald-600 transition-colors disabled:opacity-30"
                        >
                            ‹
                        </button>
                        <span style={{ fontSize: "13px" }} className="text-slate-500">{page} / {txData.totalPages}</span>
                        <button
                            onClick={() => setPage((p) => Math.min(txData.totalPages, p + 1))}
                            disabled={page >= txData.totalPages}
                            style={{ width: "36px", height: "36px", fontSize: "14px" }}
                            className="flex items-center justify-center border border-slate-200 rounded-lg text-slate-600 hover:border-emerald-600 transition-colors disabled:opacity-30"
                        >
                            ›
                        </button>
                    </div>
                )}
            </div>

            {showExpenseModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div style={{ maxWidth: "420px", padding: "24px" }} className="bg-white rounded-2xl shadow-2xl w-full">
                        <div className="flex items-center justify-between" style={{ marginBottom: "24px" }}>
                            <h2 style={{ fontSize: "18px" }} className="font-bold text-slate-900">Tambah Pengeluaran</h2>
                            <button onClick={() => setShowExpenseModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                                <svg style={{ width: "20px", height: "20px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleExpenseSubmit} className="flex flex-col" style={{ gap: "16px" }}>
                            <div>
                                <label style={{ fontSize: "13px" }} className="block font-medium text-slate-700 mb-1">Jumlah (Rp)</label>
                                <input
                                    type="text"
                                    value={expenseForm.amount ? parseInt(expenseForm.amount).toLocaleString("id-ID") : ""}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value.replace(/\D/g, "") })}
                                    placeholder="Contoh: 500.000"
                                    required
                                    style={{ fontSize: "14px", padding: "12px 16px" }}
                                    className="w-full border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: "13px" }} className="block font-medium text-slate-700 mb-1">Kategori</label>
                                <select
                                    value={expenseForm.category}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                                    style={{ fontSize: "14px", padding: "12px 16px" }}
                                    className="w-full border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                >
                                    <option value="OPERASIONAL">Operasional</option>
                                    <option value="PENYALURAN">Penyaluran</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ fontSize: "13px" }} className="block font-medium text-slate-700 mb-1">Keterangan</label>
                                <textarea
                                    value={expenseForm.notes}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
                                    placeholder="Deskripsi pengeluaran..."
                                    rows={3}
                                    style={{ fontSize: "14px", padding: "12px 16px" }}
                                    className="w-full border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={expenseLoading}
                                style={{ fontSize: "14px", padding: "12px 0" }}
                                className="w-full bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                            >
                                {expenseLoading ? "Menyimpan..." : "Simpan Pengeluaran"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
