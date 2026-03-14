/* File: src/app/dashboard/wishlist/page.tsx */

"use client";

import { useEffect, useState, useCallback } from "react";
import { formatRupiah } from "@/lib/utils";

interface WishlistItem {
    id: string;
    name: string;
    description: string | null;
    amount: number;
    priority: string;
    status: string;
    createdAt: string;
}

const PRIORITY_MAP: Record<string, { label: string; color: string; bg: string }> = {
    LOW: { label: "Rendah", color: "text-slate-600", bg: "bg-slate-100" },
    MEDIUM: { label: "Sedang", color: "text-amber-600", bg: "bg-amber-50" },
    HIGH: { label: "Tinggi", color: "text-red-600", bg: "bg-red-50" },
};

/* Halaman daftar rencana pembelian */
export default function WishlistPage() {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [totalPlanned, setTotalPlanned] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: "", description: "", amount: "", priority: "MEDIUM" });
    const [saving, setSaving] = useState(false);

    /* Ambil data rencana pembelian dari API */
    const fetchData = useCallback(async () => {
        try {
            const res = await fetch("/api/wishlist");
            const data = await res.json();
            setItems(data.wishlists || []);
            setTotalPlanned(data.totalPlanned || 0);
        } catch { /* empty */ }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    /* Simpan rencana pembelian baru */
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, amount: parseInt(form.amount.replace(/\D/g, ""), 10) }),
            });
            const data = await res.json();
            if (data.success) {
                setShowModal(false);
                setForm({ name: "", description: "", amount: "", priority: "MEDIUM" });
                fetchData();
            } else { alert(data.error); }
        } catch { alert("Gagal menyimpan"); }
        finally { setSaving(false); }
    }

    /* Tandai sebagai sudah dibeli */
    async function handleMarkPurchased(id: string) {
        try {
            await fetch(`/api/wishlist/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "PURCHASED" }),
            });
            fetchData();
        } catch { alert("Gagal memperbarui"); }
    }

    /* Hapus rencana pembelian */
    async function handleDelete(id: string) {
        if (!confirm("Yakin ingin menghapus item ini?")) return;
        try {
            await fetch(`/api/wishlist/${id}`, { method: "DELETE" });
            fetchData();
        } catch { alert("Gagal menghapus"); }
    }

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
                <div>
                    <h1 style={{ fontSize: "22px", marginBottom: "4px" }} className="font-bold text-slate-900">Rencana Pembelian</h1>
                    <p style={{ fontSize: "13px" }} className="text-slate-500">
                        Total kebutuhan: <span className="font-semibold text-emerald-600">{formatRupiah(totalPlanned)}</span>
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    style={{ fontSize: "13px", padding: "10px 20px", borderRadius: "10px", marginTop: "12px" }}
                    className="bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2 sm:mt-0"
                >
                    <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Rencana
                </button>
            </div>

            <div className="bg-white overflow-hidden" style={{ borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <th style={{ fontSize: "11px", padding: "14px 20px" }} className="text-left font-semibold text-slate-500 uppercase tracking-wider">Nama</th>
                                <th style={{ fontSize: "11px", padding: "14px 20px" }} className="text-left font-semibold text-slate-500 uppercase tracking-wider">Prioritas</th>
                                <th style={{ fontSize: "11px", padding: "14px 20px" }} className="text-right font-semibold text-slate-500 uppercase tracking-wider">Nominal</th>
                                <th style={{ fontSize: "11px", padding: "14px 20px" }} className="text-left font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th style={{ fontSize: "11px", padding: "14px 20px" }} className="text-center font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length > 0 ? items.map((item) => {
                                const pri = PRIORITY_MAP[item.priority] || PRIORITY_MAP.MEDIUM;
                                return (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors" style={{ borderBottom: "1px solid #f8fafc" }}>
                                        <td style={{ padding: "14px 20px" }}>
                                            <p style={{ fontSize: "14px" }} className="font-medium text-slate-800">{item.name}</p>
                                            {item.description && <p style={{ fontSize: "12px" }} className="text-slate-400">{item.description}</p>}
                                        </td>
                                        <td style={{ padding: "14px 20px" }}>
                                            <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px" }} className={`font-semibold ${pri.color} ${pri.bg}`}>{pri.label}</span>
                                        </td>
                                        <td style={{ fontSize: "14px", padding: "14px 20px" }} className="text-right font-semibold text-slate-800">{formatRupiah(item.amount)}</td>
                                        <td style={{ padding: "14px 20px" }}>
                                            <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px" }}
                                                className={`font-semibold ${item.status === "PURCHASED" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
                                                {item.status === "PURCHASED" ? "Sudah Dibeli" : "Direncanakan"}
                                            </span>
                                        </td>
                                        <td style={{ padding: "14px 20px" }} className="text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {item.status === "PLANNED" && (
                                                    <button onClick={() => handleMarkPurchased(item.id)} style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "8px" }}
                                                        className="bg-emerald-50 text-emerald-600 font-medium hover:bg-emerald-100 transition-colors">Beli</button>
                                                )}
                                                <button onClick={() => handleDelete(item.id)} style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "8px" }}
                                                    className="bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors">Hapus</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={5} style={{ fontSize: "14px", padding: "48px 20px" }} className="text-center text-slate-400">Belum ada rencana pembelian</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div style={{ maxWidth: "420px", padding: "24px" }} className="bg-white rounded-2xl shadow-2xl w-full">
                        <div className="flex items-center justify-between" style={{ marginBottom: "20px" }}>
                            <h2 style={{ fontSize: "17px" }} className="font-bold text-slate-900">Tambah Rencana</h2>
                            <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                                <svg style={{ width: "20px", height: "20px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: "14px" }}>
                            <div>
                                <label style={{ fontSize: "12px" }} className="block font-medium text-slate-600 mb-1">Nama Barang *</label>
                                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Contoh: Speaker Masjid" style={{ fontSize: "13px", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}
                                    className="w-full text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                            </div>
                            <div>
                                <label style={{ fontSize: "12px" }} className="block font-medium text-slate-600 mb-1">Deskripsi</label>
                                <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Penjelasan singkat" style={{ fontSize: "13px", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}
                                    className="w-full text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                            </div>
                            <div>
                                <label style={{ fontSize: "12px" }} className="block font-medium text-slate-600 mb-1">Estimasi Harga (Rp) *</label>
                                <input type="text" required
                                    value={form.amount ? parseInt(form.amount).toLocaleString("id-ID") : ""}
                                    onChange={(e) => setForm({ ...form, amount: e.target.value.replace(/\D/g, "") })}
                                    placeholder="Contoh: 2.500.000" style={{ fontSize: "13px", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}
                                    className="w-full text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                            </div>
                            <div>
                                <label style={{ fontSize: "12px" }} className="block font-medium text-slate-600 mb-1">Prioritas</label>
                                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                                    style={{ fontSize: "13px", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}
                                    className="w-full text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                    <option value="LOW">Rendah</option>
                                    <option value="MEDIUM">Sedang</option>
                                    <option value="HIGH">Tinggi</option>
                                </select>
                            </div>
                            <button type="submit" disabled={saving} style={{ fontSize: "13px", padding: "11px 0", borderRadius: "10px", marginTop: "4px" }}
                                className="w-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50">
                                {saving ? "Menyimpan..." : "Simpan Rencana"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
