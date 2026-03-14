# Sistem Informasi Manajemen Keuangan Masjid Terpadu

Sebuah aplikasi manajemen keuangan berbasis web yang dirancang khusus untuk memenuhi kebutuhan administrasi masjid modern. Sistem ini memiliki antarmuka (UI) publik bagi jamaah serta dasbor admin yang aman untuk mengelola pemasukan, pengeluaran, donasi, program Ziswaf (Zakat, Infaq, Sedekah, Wakaf), dan rencana anggaran/pembelian masjid.

---

## 🚀 Fitur Utama

### 🕌 Halaman Publik (Jamaah)
- **Ringkasan Transparansi Keuangan**: Laporan total saldo, pemasukan, dan pengeluaran secara _real-time_.
- **Kalkulator Zakat Fitrah & Maal**: Hitung otomatis berdasarkan nisab bulanan/tahunan secara *client-side* murni untuk privasi dan kecepatan.
- **Portofolio Program Ziswaf**: Menampilkan berbagai program unggulan masjid yang sedang berjalan.
- **Donasi Cepat (Quick Donation Form)**: Dukungan form donasi dengan konfirmasi nominal, unggah bukti bayar (transfer bank), dan petunjuk QR Code dinamis langsung dari pengurus masjid.

### 🔒 Dasbor Admin (Pengurus)
- **Insight Dasbor**: Ringkasan performa pemasukan (Zakat, Donasi, Infaq) dan pengeluaran.
- **Manajer Pemasukan & Donasi**: Laporan kas dari donasi publik. Dilengkapi fitur filtrasi kategori (Zakat, Qurban, Sedekah, Operasional) serta kemampuan **Verifikasi Bukti Transfer Donasi** (Terima / Tolak / Pending).
- **Manajer Pengeluaran**: Sistem pencatatan kas keluar secara instan.
- **Rencana Pembelian (Wishlist)**: Menu khusus untuk merancang anggaran pembelian aset masjid (Misal: Karpet, Sound System) dengan penentuan skala prioritas (Tinggi/Sedang/Rendah) dan target nominal.
- **Pengaturan (Settings)**: Manajemen konten mandiri. Memungkinkan admin mengunggah dan memperbarui otomatis QR Code pembayaran tanpa campur tangan teknis *developer*.

---

## 🛠️ Technology Stack (Tech Stack)

Sistem ini dibangun dengan stack teknologi *modern* Javascript/Typescript ekosistem untuk memastikan skalabilitas, keamanan, dan *developer experience* terbaik:

### Frontend
- **Framework**: [Next.js v15/16 (App Router)](https://nextjs.org/)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/) untuk *Type Safety*
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) dengan Vanilla CSS. (Tidak menggunakan engine lama, langsung V4).
- **Icons**: SVG / Lucide React / Heroicons

### Backend & Database
- **Runtime API**: Next.js Route Handlers (Serverless/API Routes)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (High-performance relational DB)
- **ORM**: [Prisma ORM v6](https://www.prisma.io/) (Untuk interaksi ke Database yang asinkron, stabil dengan Next.js App Router, tanpa isu *WASM bundling*)
- **Auth**: Implementasi JWT/Middleware dengan Next.js Middleware dan standar enkripsi `bcryptjs` / `jose`.

---

## 📦 Struktur Database (Prisma Schema)

Proyek ini menggunakan struktur tabel *Relational Database* dasar berikut:
1. `transactions`: Tabel utama pembukuan buku kas induk (tipe Pemasukan / Pengeluaran, klasifikasi jenis Zakat, Operasional, Penyaluran).
2. `donations`: Tabel form publik transaksi jamaah yang terekam namun *menunggu* status diterjemahkan oleh Admin menjadi *Transaction* resmi masjid.
3. `wishlists`: Tabel rencana anggaran prioritas pengadaan (PLANNED / PURCHASED).
4. `settings`: Skema Key-Value (berbasis KV) untuk menyimpan metadata gambar (Misal URL bukti QR payment Masjid).

---

## ⚙️ Panduan Instalasi (Development Setup)

### Prasyarat:
1. Node.js v18 atau v20+
2. PostgreSQL (Lokal atau Cloud seperti Supabase/Neon)

### Langkah Pemasangan:

**1. Clone Repositori**
```bash
git clone https://github.com/Hamdi-Yahya/Sistem-Pencatatan-Keuangan-Masjid.git
cd masjid-keuangan
```

**2. Install Dependensi**
```bash
npm install
```

**3. Konfigurasi Environment Variables**
Ubah atau buat file `.env` di _root directory_:
```env
DATABASE_URL="postgresql://[USER]:[PASSWORD]@localhost:5432/masjid_db?schema=public"

# Rahasia untuk pengelolaan sesi JWT Middleware
NEXTAUTH_SECRET="rahasia_anda_disini"
NEXTAUTH_URL="http://localhost:3000"

# Kredensial hardcoded untuk Admin (Atau diubah ke database nantinya)
ADMIN_EMAIL="admin@masjid.com"
ADMIN_PASSWORD="admin" 
```

**4. Migrasi Database Database (Prisma v6)**
Eksekusi pembaruan tabel agar PostgreSQL kamu terindeks ke _schema_ sistem:
```bash
npx prisma db push
# ATAU untuk workflow lengkap migration:
npx prisma migrate dev --name init
```

**5. Hasilkan Tipe Klien Prisma Terkini**
```bash
npx prisma generate
```

**6. Jalankan Server Development**
```bash
npm run dev
```

Kini aplikasi bisa kamu akses di browser dengan url standar: `http://localhost:3000`

---
*Dibangun dengan ❤️ untuk efisiensi ekosistem masjid digital masa kini.*
