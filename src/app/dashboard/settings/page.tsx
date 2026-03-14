/* File: src/app/dashboard/settings/page.tsx */

"use client";

import { useEffect, useState } from "react";

/* Halaman pengaturan — upload gambar QR Code untuk pembayaran donasi */
export default function SettingsPage() {
    const [qrPreview, setQrPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [saved, setSaved] = useState(false);

    /* Ambil QR yang sudah tersimpan dari settings */
    useEffect(() => {
        fetch("/api/settings")
            .then((r) => r.json())
            .then((data) => {
                if (data.settings?.qr_image) setQrPreview(data.settings.qr_image);
            })
            .catch(() => { });
    }, []);

    /* Upload gambar QR dan simpan URL ke settings */
    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setSaved(false);

        try {
            const formData = new FormData();
            formData.append("file", file);
            const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
            const uploadData = await uploadRes.json();

            if (!uploadData.url) {
                alert(uploadData.error || "Gagal upload");
                return;
            }

            const settingRes = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: "qr_image", value: uploadData.url }),
            });
            const settingData = await settingRes.json();

            if (settingData.success) {
                setQrPreview(uploadData.url);
                setSaved(true);
            } else {
                alert("Gagal menyimpan pengaturan");
            }
        } catch {
            alert("Terjadi kesalahan");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div>
            <h1 style={{ fontSize: "22px", marginBottom: "24px" }} className="font-bold text-slate-900">Pengaturan</h1>

            <div className="bg-white" style={{ padding: "28px", borderRadius: "16px", border: "1px solid #e2e8f0", maxWidth: "520px" }}>
                <h2 style={{ fontSize: "16px", marginBottom: "4px" }} className="font-bold text-slate-800">QR Code Pembayaran</h2>
                <p style={{ fontSize: "13px", marginBottom: "20px" }} className="text-slate-500">
                    Upload gambar QR code yang akan ditampilkan kepada donatur saat melakukan donasi.
                </p>

                {qrPreview && (
                    <div style={{ marginBottom: "20px", padding: "20px", borderRadius: "12px" }} className="bg-slate-50 text-center">
                        <img src={qrPreview} alt="QR Code" style={{ maxWidth: "200px", margin: "0 auto", borderRadius: "8px" }} />
                        <p style={{ fontSize: "11px", marginTop: "8px" }} className="text-slate-400">QR Code saat ini</p>
                    </div>
                )}

                <div>
                    <label
                        style={{ fontSize: "13px", padding: "10px 20px", borderRadius: "10px", border: "1px solid #e2e8f0", cursor: "pointer", display: "inline-block" }}
                        className="text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                    >
                        {uploading ? "Mengupload..." : "Pilih Gambar QR"}
                        <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
                    </label>
                </div>

                {saved && (
                    <div style={{ marginTop: "16px", padding: "12px", borderRadius: "10px" }} className="bg-emerald-50">
                        <p style={{ fontSize: "13px" }} className="text-emerald-700 font-medium">✓ QR Code berhasil disimpan</p>
                    </div>
                )}
            </div>
        </div>
    );
}
