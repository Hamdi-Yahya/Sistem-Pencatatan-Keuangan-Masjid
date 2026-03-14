// File: src/app/dashboard/expense/page.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import { formatRupiah, getCategoryLabel } from "@/lib/utils";

interface Transaction {
    id: string;
    amount: number;
    type: string;
    category: string;
    notes: string | null;
    createdAt: string;
}

interface TransactionsResponse {
    transactions: Transaction[];
    total: number;
    page: number;
    totalPages: number;
}

export default function ExpensePage() {
    const [data, setData] = useState<TransactionsResponse | null>(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/transactions?type=EXPENSE&page=${page}&limit=10`);
            const result = await res.json();
            setData(result);
        } catch {
            console.error("Failed to fetch");
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Pengeluaran</h1>
                <p className="text-sm text-slate-500">
                    Daftar semua transaksi pengeluaran masjid
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                                    Kategori
                                </th>
                                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                                    Nominal
                                </th>
                                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                                    Keterangan
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.transactions && data.transactions.length > 0 ? (
                                data.transactions.map((tx) => (
                                    <tr
                                        key={tx.id}
                                        className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-sm text-slate-800">
                                            {getCategoryLabel(tx.category)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-red-600 text-right">
                                            {formatRupiah(tx.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {tx.notes || "-"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-6 py-12 text-center text-sm text-slate-400"
                                    >
                                        Belum ada pengeluaran
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {data && data.totalPages > 1 && (
                    <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page <= 1}
                            className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-emerald-600 transition-colors disabled:opacity-30"
                        >
                            ‹
                        </button>
                        <span className="text-sm text-slate-500">
                            {page} / {data.totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                            disabled={page >= data.totalPages}
                            className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-emerald-600 transition-colors disabled:opacity-30"
                        >
                            ›
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
