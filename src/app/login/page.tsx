// File: src/app/login/page.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login gagal");
                return;
            }

            router.push("/dashboard");
        } catch {
            setError("Terjadi kesalahan jaringan");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
            <div style={{ width: "100%", maxWidth: "420px" }}>
                <div style={{ padding: "40px 36px" }} className="bg-white rounded-2xl shadow-xl shadow-slate-200/50">
                    <div className="flex justify-center" style={{ marginBottom: "24px" }}>
                        <div
                            style={{ width: "56px", height: "56px", padding: "8px" }}
                            className="bg-emerald-50 rounded-2xl flex items-center justify-center"
                        >
                            <div
                                style={{ width: "40px", height: "40px", fontSize: "16px" }}
                                className="bg-emerald-600 rounded-xl flex items-center justify-center"
                            >
                                <span className="text-white font-bold">M</span>
                            </div>
                        </div>
                    </div>

                    <h1 style={{ fontSize: "22px", marginBottom: "4px" }} className="font-bold text-center text-slate-900">
                        Login Pengurus
                    </h1>
                    <p style={{ fontSize: "13px", marginBottom: "32px" }} className="text-center text-slate-500">
                        Sistem Informasi Keuangan Masjid
                    </p>

                    {error && (
                        <div style={{ marginBottom: "24px", padding: "12px" }} className="bg-red-50 border border-red-200 rounded-xl">
                            <p style={{ fontSize: "13px" }} className="text-red-600 text-center">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="flex flex-col" style={{ gap: "20px" }}>
                        <div>
                            <label style={{ fontSize: "13px", marginBottom: "6px" }} className="block font-medium text-slate-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="nama@masjid.com"
                                required
                                style={{ fontSize: "14px", padding: "12px 16px" }}
                                className="w-full border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between" style={{ marginBottom: "6px" }}>
                                <label style={{ fontSize: "13px" }} className="font-medium text-slate-700">
                                    Password
                                </label>
                                <button type="button" style={{ fontSize: "12px" }} className="text-emerald-600 hover:text-emerald-700 font-medium">
                                    Lupa Password?
                                </button>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{ fontSize: "14px", padding: "12px 16px" }}
                                className="w-full border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="remember"
                                style={{ width: "16px", height: "16px" }}
                                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <label htmlFor="remember" style={{ fontSize: "13px" }} className="text-slate-600">
                                Ingat saya
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{ fontSize: "14px", padding: "12px 0" }}
                            className="w-full bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Memproses..." : "Masuk Dashboard"}
                        </button>
                    </form>

                    <div style={{ marginTop: "24px", paddingTop: "24px" }} className="border-t border-slate-100 text-center">
                        <Link
                            href="/"
                            style={{ fontSize: "13px" }}
                            className="text-slate-500 hover:text-emerald-600 transition-colors inline-flex items-center gap-1"
                        >
                            ← Kembali ke Beranda
                        </Link>
                    </div>
                </div>

                <p style={{ fontSize: "12px", marginTop: "32px" }} className="text-center text-slate-400">
                    © {new Date().getFullYear()} Mosque Financial System. All rights reserved.
                </p>
            </div>
        </div>
    );
}
