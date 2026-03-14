/* File: src/components/ZakatCalculator.tsx */

"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/utils";

/* Kalkulator Zakat Penghasilan — menghitung 2.5% dari penghasilan jika sudah mencapai nisab */
export default function ZakatCalculator() {
    const [income, setIncome] = useState("");
    const [zakatAmount, setZakatAmount] = useState(0);
    const [calculated, setCalculated] = useState(false);

    const NISAB_YEARLY = 85 * 1_500_000;
    const NISAB_RATE = Math.round(NISAB_YEARLY / 12);
    const ZAKAT_PERCENTAGE = 0.025;

    /* Hitung zakat berdasarkan input penghasilan */
    function handleCalculate() {
        const numericValue = income.replace(/\D/g, "");
        const parsed = parseInt(numericValue, 10);
        if (isNaN(parsed) || parsed <= 0) {
            setZakatAmount(0);
            setCalculated(true);
            return;
        }
        if (parsed >= NISAB_RATE) {
            setZakatAmount(Math.round(parsed * ZAKAT_PERCENTAGE));
        } else {
            setZakatAmount(0);
        }
        setCalculated(true);
    }

    /* Format input penghasilan ke format Rupiah */
    function handleInputChange(value: string) {
        const numericValue = value.replace(/\D/g, "");
        setIncome(numericValue);
        setCalculated(false);
        setZakatAmount(0);
    }

    return (
        <section id="kalkulator" style={{ padding: "60px 0" }} className="bg-white">
            <div style={{ maxWidth: "1140px", padding: "0 24px" }} className="mx-auto">
                <div style={{ borderRadius: "20px", overflow: "hidden" }} className="bg-emerald-800">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div style={{ padding: "40px" }} className="text-white">
                            <h2 style={{ fontSize: "24px", marginBottom: "12px" }} className="font-bold">
                                Kalkulator Zakat Penghasilan
                            </h2>
                            <p style={{ fontSize: "13px", marginBottom: "28px", lineHeight: "1.7" }} className="text-emerald-200">
                                Hitung kewajiban zakat maal dari penghasilan bulanan Anda dengan
                                mudah sesuai syariat (2,5%).
                            </p>
                            <div className="flex flex-col" style={{ gap: "14px" }}>
                                {["Mudah & Cepat", "Penyaluran Tepat Sasaran", "Konfirmasi via Email"].map((text) => (
                                    <div key={text} className="flex items-center" style={{ gap: "10px" }}>
                                        <div
                                            style={{ width: "22px", height: "22px", minWidth: "22px", borderRadius: "50%" }}
                                            className="bg-emerald-500 flex items-center justify-center"
                                        >
                                            <svg style={{ width: "12px", height: "12px" }} className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span style={{ fontSize: "13px" }}>{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ padding: "40px", borderRadius: "20px" }} className="bg-white">
                            <div style={{ marginBottom: "16px" }}>
                                <label style={{ fontSize: "12px", marginBottom: "6px", display: "block" }} className="font-medium text-slate-600">
                                    Penghasilan /bulan (Rp)
                                </label>
                                <input
                                    type="text"
                                    value={income ? parseInt(income).toLocaleString("id-ID") : ""}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                    placeholder="Contoh: 10.000.000"
                                    style={{ fontSize: "13px", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}
                                    className="w-full text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>

                            <button
                                onClick={handleCalculate}
                                style={{ fontSize: "13px", padding: "10px 0", borderRadius: "10px", marginBottom: "20px" }}
                                className="w-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
                            >
                                Hitung Zakat
                            </button>

                            <div style={{ padding: "14px", marginBottom: "16px", borderRadius: "10px" }} className="bg-slate-50">
                                <p style={{ fontSize: "12px" }} className="text-slate-500 mb-1">Kewajiban Zakat Anda</p>
                                <p style={{ fontSize: "24px" }} className="font-bold text-slate-900">{formatRupiah(zakatAmount)}</p>
                                {calculated && income && parseInt(income) > 0 && parseInt(income) < NISAB_RATE && (
                                    <p style={{ fontSize: "11px", marginTop: "4px" }} className="text-amber-600">
                                        Penghasilan belum mencapai nisab ({formatRupiah(NISAB_RATE)})
                                    </p>
                                )}
                            </div>

                            {calculated && zakatAmount > 0 && (
                                <div style={{ padding: "14px", borderRadius: "10px", border: "1px solid #d1fae5" }} className="bg-emerald-50 text-center">
                                    <p style={{ fontSize: "12px" }} className="text-emerald-700 font-medium">
                                        Zakat Anda sebesar {formatRupiah(zakatAmount)}/bulan.
                                        <br />
                                        Silakan salurkan melalui program donasi di bawah.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
