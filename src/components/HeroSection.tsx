// File: src/components/HeroSection.tsx

export default function HeroSection() {
    return (
        <section className="bg-white" style={{ paddingTop: "110px", paddingBottom: "60px" }}>
            <div style={{ maxWidth: "1140px", padding: "0 24px" }} className="mx-auto text-center">
                <span
                    style={{ fontSize: "11px", padding: "5px 14px", borderRadius: "20px", letterSpacing: "0.3px" }}
                    className="inline-block bg-emerald-50 text-emerald-600 font-semibold mb-5"
                >
                    Platform Kebaikan Masjid Digital
                </span>

                <h1 style={{ fontSize: "36px", lineHeight: "1.2", marginBottom: "16px" }} className="font-extrabold text-slate-900">
                    Transparansi Umat Untuk
                    <br />
                    <span className="text-emerald-600">Keberkahan Bersama</span>
                </h1>

                <p style={{ fontSize: "14px", maxWidth: "480px", marginBottom: "32px", lineHeight: "1.7" }} className="text-slate-500 mx-auto">
                    Wujudkan pengelolaan dana umat yang amanah, transparan, dan profesional
                    melalui platform digital Masjid Al-Ikhlas.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center" style={{ gap: "12px" }}>
                    <a
                        href="#donasi"
                        style={{ fontSize: "13px", padding: "11px 28px", borderRadius: "10px" }}
                        className="bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200/50"
                    >
                        Bayar Zakat Sekarang
                    </a>
                    <a
                        href="#transparansi"
                        style={{ fontSize: "13px", padding: "11px 28px", borderRadius: "10px", border: "1px solid #cbd5e1" }}
                        className="text-slate-600 font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-all"
                    >
                        Lihat Transparansi
                    </a>
                </div>
            </div>
        </section>
    );
}
