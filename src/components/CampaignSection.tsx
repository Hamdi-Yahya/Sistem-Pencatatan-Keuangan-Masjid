/* File: src/components/CampaignSection.tsx */

"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface Campaign {
    id: string;
    title: string;
    description: string;
    targetAmount: number;
    image: string;
    badgeLabel: string;
    badgeColor: string;
}

const CAMPAIGNS: Campaign[] = [
    {
        id: "zakat-fitrah",
        title: "Zakat Fitrah 1446H",
        description: "Menyalurkan zakat fitrah untuk kaum fakir miskin di lingkungan sekitar Masjid Al-Ikhlas.",
        targetAmount: 15_000_000,
        image: "/campaign-zakat.png",
        badgeLabel: "AKTIF",
        badgeColor: "#059669",
    },
    {
        id: "qurban",
        title: "Qurban Idul Adha 1446H",
        description: "Tuntaskan Qurban untuk di Antero masyarakat. Mari bersama kemanusiaan dan berbagi.",
        targetAmount: 45_000_000,
        image: "/campaign-qurban.png",
        badgeLabel: "AKTIF",
        badgeColor: "#059669",
    },
    {
        id: "sedekah-jumat",
        title: "Sedekah Jumat Berkah",
        description: "Menyalurkan sedekah kamu & jamaah shalat Jumat untuk warga yang membutuhkan.",
        targetAmount: 8_000_000,
        image: "/campaign-sedekah.png",
        badgeLabel: "AKTIF",
        badgeColor: "#059669",
    },
];

function formatRp(amount: number) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
}

/* Komponen popup form donasi */
function DonationModal({
    campaign,
    qrImageUrl,
    onClose,
}: {
    campaign: Campaign;
    qrImageUrl: string;
    onClose: () => void;
}) {
    const [form, setForm] = useState({ donorName: "", phone: "", message: "", amount: "" });
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    /* Kirim donasi ke API */
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            let proofImageUrl = "";

            if (proofFile) {
                const uploadForm = new FormData();
                uploadForm.append("file", proofFile);
                const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadForm });
                const uploadData = await uploadRes.json();
                if (uploadData.url) proofImageUrl = uploadData.url;
            }

            const res = await fetch("/api/donations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    campaignId: campaign.id,
                    donorName: form.donorName,
                    phone: form.phone,
                    message: form.message,
                    proofImage: proofImageUrl,
                    amount: parseInt(form.amount.replace(/\D/g, ""), 10),
                }),
            });

            const data = await res.json();
            if (data.success) {
                setSuccess(true);
            } else {
                alert(data.error || "Gagal mengirim donasi");
            }
        } catch {
            alert("Terjadi kesalahan jaringan");
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
                <div style={{ maxWidth: "400px", padding: "32px" }} className="bg-white rounded-2xl shadow-2xl w-full text-center" onClick={(e) => e.stopPropagation()}>
                    <div style={{ width: "56px", height: "56px", borderRadius: "50%", margin: "0 auto 16px" }} className="bg-emerald-100 flex items-center justify-center">
                        <svg style={{ width: "28px", height: "28px" }} className="text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 style={{ fontSize: "18px", marginBottom: "8px" }} className="font-bold text-slate-900">Donasi Terkirim!</h3>
                    <p style={{ fontSize: "13px", marginBottom: "20px" }} className="text-slate-500">Terima kasih atas donasi Anda. Tim kami akan memverifikasi bukti transfer Anda.</p>
                    <button onClick={onClose} style={{ fontSize: "13px", padding: "10px 24px", borderRadius: "10px" }} className="bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors">
                        Tutup
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
            <div style={{ maxWidth: "480px", padding: "28px", maxHeight: "90vh", overflowY: "auto" }} className="bg-white rounded-2xl shadow-2xl w-full" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between" style={{ marginBottom: "20px" }}>
                    <h2 style={{ fontSize: "17px" }} className="font-bold text-slate-900">Donasi — {campaign.title}</h2>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
                        <svg style={{ width: "20px", height: "20px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {qrImageUrl && (
                    <div style={{ marginBottom: "20px", padding: "16px", borderRadius: "12px" }} className="bg-slate-50 text-center">
                        <p style={{ fontSize: "12px", marginBottom: "8px" }} className="text-slate-500 font-medium">Scan QR untuk transfer:</p>
                        <img src={qrImageUrl} alt="QR Pembayaran" style={{ maxWidth: "180px", margin: "0 auto", borderRadius: "8px" }} />
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: "14px" }}>
                    <div>
                        <label style={{ fontSize: "12px" }} className="block font-medium text-slate-600 mb-1">Nama Lengkap *</label>
                        <input type="text" required value={form.donorName} onChange={(e) => setForm({ ...form, donorName: e.target.value })}
                            placeholder="Masukkan nama" style={{ fontSize: "13px", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}
                            className="w-full text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>

                    <div>
                        <label style={{ fontSize: "12px" }} className="block font-medium text-slate-600 mb-1">No. Handphone *</label>
                        <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            placeholder="08xxxxxxxxxx" style={{ fontSize: "13px", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}
                            className="w-full text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>

                    <div>
                        <label style={{ fontSize: "12px" }} className="block font-medium text-slate-600 mb-1">Jumlah Donasi (Rp) *</label>
                        <input type="text" required
                            value={form.amount ? parseInt(form.amount).toLocaleString("id-ID") : ""}
                            onChange={(e) => setForm({ ...form, amount: e.target.value.replace(/\D/g, "") })}
                            placeholder="Contoh: 100.000" style={{ fontSize: "13px", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}
                            className="w-full text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>

                    <div>
                        <label style={{ fontSize: "12px" }} className="block font-medium text-slate-600 mb-1">Pesan (opsional)</label>
                        <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                            placeholder="Tuliskan pesan/doa..." rows={2}
                            style={{ fontSize: "13px", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}
                            className="w-full text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
                    </div>

                    <div>
                        <label style={{ fontSize: "12px" }} className="block font-medium text-slate-600 mb-1">Upload Bukti Transfer *</label>
                        <input type="file" required accept="image/*" onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                            style={{ fontSize: "12px" }} className="w-full text-slate-600" />
                    </div>

                    <button type="submit" disabled={loading}
                        style={{ fontSize: "13px", padding: "11px 0", borderRadius: "10px", marginTop: "4px" }}
                        className="w-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50">
                        {loading ? "Mengirim..." : "Kirim Donasi"}
                    </button>
                </form>
            </div>
        </div>
    );
}

/* Komponen utama section kampanye donasi */
export default function CampaignSection() {
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [qrImageUrl, setQrImageUrl] = useState("");
    const [collectedAmounts, setCollectedAmounts] = useState<Record<string, number>>({});

    /* Ambil QR dari settings dan jumlah terkumpul dari database */
    useEffect(() => {
        fetch("/api/settings")
            .then((r) => r.json())
            .then((data) => { if (data.settings?.qr_image) setQrImageUrl(data.settings.qr_image); })
            .catch(() => { });

        fetch("/api/donations?status=VERIFIED")
            .then((r) => r.json())
            .then((data) => {
                const amounts: Record<string, number> = {};
                if (data.donations) {
                    data.donations.forEach((d: { campaignId: string; amount: number }) => {
                        amounts[d.campaignId] = (amounts[d.campaignId] || 0) + d.amount;
                    });
                }
                setCollectedAmounts(amounts);
            })
            .catch(() => { });
    }, []);

    return (
        <section id="donasi" style={{ padding: "60px 0" }} className="bg-slate-50">
            <div style={{ maxWidth: "1140px", padding: "0 24px" }} className="mx-auto">
                <div className="text-center" style={{ marginBottom: "36px" }}>
                    <h2 style={{ fontSize: "22px", marginBottom: "8px" }} className="font-bold text-slate-900">Program Kebaikan</h2>
                    <p style={{ fontSize: "13px" }} className="text-slate-500">Partisipasi dalam berbagai program sosial dan pembangunan masjid kami.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "24px" }}>
                    {CAMPAIGNS.map((campaign) => {
                        const collected = collectedAmounts[campaign.id] || 0;
                        return (
                            <div key={campaign.id} className="bg-white overflow-hidden hover:shadow-lg transition-shadow" style={{ borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                                <div style={{ height: "180px", position: "relative" }} className="overflow-hidden">
                                    <Image src={campaign.image} alt={campaign.title} fill className="object-cover" />
                                    <span style={{ fontSize: "10px", padding: "3px 10px", borderRadius: "20px", backgroundColor: campaign.badgeColor, position: "absolute", top: "12px", left: "12px" }} className="text-white font-semibold">
                                        {campaign.badgeLabel}
                                    </span>
                                </div>
                                <div style={{ padding: "20px" }}>
                                    <h3 style={{ fontSize: "15px", marginBottom: "6px" }} className="font-bold text-slate-900">{campaign.title}</h3>
                                    <p style={{ fontSize: "12px", lineHeight: "1.6", marginBottom: "16px", height: "38px" }} className="text-slate-500 overflow-hidden">{campaign.description}</p>
                                    <div style={{ marginBottom: "16px" }}>
                                        <div className="flex justify-between" style={{ fontSize: "10px", marginBottom: "6px" }}>
                                            <span className="text-slate-500">Terkumpul: <span className="font-semibold text-emerald-600">{formatRp(collected)}</span></span>
                                            <span className="text-slate-400">Target: {formatRp(campaign.targetAmount)}</span>
                                        </div>
                                        <div style={{ height: "6px", borderRadius: "3px" }} className="bg-slate-100 overflow-hidden">
                                            <div className="h-full bg-emerald-500" style={{ width: `${Math.min((collected / campaign.targetAmount) * 100, 100)}%`, borderRadius: "3px", transition: "width 0.5s ease" }} />
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedCampaign(campaign)} style={{ fontSize: "12px", padding: "9px 0", borderRadius: "10px", border: "2px solid #059669" }}
                                        className="w-full text-emerald-600 font-semibold hover:bg-emerald-600 hover:text-white transition-colors">
                                        Donasi Sekarang
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {selectedCampaign && (
                <DonationModal campaign={selectedCampaign} qrImageUrl={qrImageUrl} onClose={() => setSelectedCampaign(null)} />
            )}
        </section>
    );
}
