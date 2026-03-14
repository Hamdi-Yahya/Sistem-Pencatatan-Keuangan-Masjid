// File: src/components/Footer.tsx

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer id="kontak" className="bg-slate-900 text-slate-300">
            <div style={{ maxWidth: "1140px", padding: "48px 24px" }} className="mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "40px" }}>
                    <div>
                        <div className="flex items-center" style={{ gap: "8px", marginBottom: "12px" }}>
                            <div style={{ width: "32px", height: "32px", borderRadius: "8px", fontSize: "12px" }} className="bg-emerald-600 flex items-center justify-center">
                                <span className="text-white font-bold">M</span>
                            </div>
                            <span style={{ fontSize: "15px" }} className="font-bold text-white">Masjid Al-Ikhlas</span>
                        </div>
                        <p style={{ fontSize: "12px", lineHeight: "1.7" }} className="text-slate-400">
                            Mewujudkan kemandirian umat melalui transparansi dan optimalisasi
                            dana zakat, infaq, dan sedekah secara terpercaya.
                        </p>
                    </div>

                    <div>
                        <h3 style={{ fontSize: "13px", marginBottom: "14px" }} className="text-white font-semibold">Kontak Takmir</h3>
                        <div className="flex flex-col" style={{ gap: "10px", fontSize: "12px" }}>
                            <div className="flex items-center" style={{ gap: "8px" }}>
                                <svg style={{ width: "14px", height: "14px", flexShrink: 0 }} className="text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>info@masjid-alikhlas.id</span>
                            </div>
                            <div className="flex items-center" style={{ gap: "8px" }}>
                                <svg style={{ width: "14px", height: "14px", flexShrink: 0 }} className="text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>+62 812-3456-7890</span>
                            </div>
                            <div className="flex items-start" style={{ gap: "8px" }}>
                                <svg style={{ width: "14px", height: "14px", flexShrink: 0, marginTop: "2px" }} className="text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Jl. Masjid Raya No. 123, Kota Muslim, Indonesia</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 style={{ fontSize: "13px", marginBottom: "14px" }} className="text-white font-semibold">Navigasi</h3>
                        <div className="flex flex-col" style={{ gap: "8px", fontSize: "12px" }}>
                            <a href="#" className="hover:text-emerald-400 transition-colors">Beranda</a>
                            <a href="#transparansi" className="hover:text-emerald-400 transition-colors">Laporan Kas</a>
                            <a href="#kalkulator" className="hover:text-emerald-400 transition-colors">Hitung Zakat</a>
                            <a href="#donasi" className="hover:text-emerald-400 transition-colors">Donasi Program</a>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ borderTop: "1px solid #334155" }}>
                <div style={{ maxWidth: "1140px", padding: "20px 24px" }} className="mx-auto">
                    <p style={{ fontSize: "12px" }} className="text-center text-slate-500">
                        © {currentYear} Masjid Al-Ikhlas. Seluruh Hak Cipta Dilindungi.
                    </p>
                </div>
            </div>
        </footer>
    );
}
