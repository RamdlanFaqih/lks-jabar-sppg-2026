# Smart Meal Distribution System (LKS SMK Jabar 2026 - ITSSFB)

A reference implementation and learning platform for the **IT Software Solution for Business** (ITSSFB) competition category in **LKS SMK Jawa Barat 2026**, themed **Smart Meal Distribution System** (Studi Kasus: Sistem Operasional SPPG).

This repository contains a full Next.js App Router web simulation, alongside complete database schemas, seed scripts, and SQL Server reference files.

---

## 📂 Panduan Membaca Project (Folder Structure)

Aplikasi web ini menggunakan framework **Next.js App Router** dengan **Prisma ORM** untuk interaksi basis data. Berikut adalah struktur folder utama yang perlu dipelajari:

```
├── prisma/
│   ├── schema.prisma        # Definisi database model ORM (PostgreSQL)
│   └── seed.ts              # Seeder data awal untuk simulasi akun & transaksi
├── src/
│   └── app/
│       ├── page.tsx         # Portal Utama / Landing Hub
│       ├── docs/            # Dokumentasi API Hub (/docs)
│       ├── health/          # Database Console (Monitoring & raw query runner)
│       ├── desktop/         # Simulator Aplikasi Desktop Operator (C# Windows equivalent)
│       │   ├── layout.tsx   # Layout cangkang sidebar & otentikasi
│       │   ├── dashboard/   # Tampilan dashboard grafik metrik
│       │   ├── employees/   # CRUD data Pegawai
│       │   ├── materials/   # CRUD data Bahan Baku (Qty & Satuan terpisah)
│       │   ├── schools/     # CRUD data Sekolah Penerima
│       │   ├── kitchen-needs/# CRUD kebutuhan harian dapur
│       │   ├── orders/      # CRUD pesanan bahan baku ke Pemasok
│       │   ├── distributions/# Monitoring & Validasi distribusi makan siang
│       │   ├── reports/     # Laporan cetak 1, 2, 3, dan 4
│       │   └── login/       # Login Form khusus Petugas / Supervisor
│       └── mobile/          # Simulator Aplikasi Mobile Pemasok (Android equivalent)
│           ├── layout.tsx   # Frame mockup handphone & Context Toast global
│           ├── login/       # Login Form khusus Pemasok
│           ├── page.tsx     # List pesanan Aktif & Riwayat (tabbed view)
│           └── orders/[id]/ # Detail pesanan, status stepper timeline & aksi CTA
├── SQL_CRUD_GUIDE.md        # Cheat-Sheet Rancangan Database & SQL CRUD Standar
└── README.md                # Dokumentasi petunjuk penggunaan project ini
```

---

## 🎮 Fitur Utama & Cara Penggunaan

### 1. Landing Hub & Interceptor Alur Bisnis (`/`)
*   Mengarahkan penguji ke modul Desktop Simulator (`/desktop`) atau Mobile Simulator (`/mobile`).
*   Dilengkapi **Click Interceptor**: Jika Anda mengeklik langkah alur bisnis di diagram alir (misal: "Kelola Pegawai" atau "Validasi Distribusi"), sistem akan memeriksa sesi login aktif.
*   Jika belum login, sistem mengarahkan ke halaman login yang tepat dengan membawa tujuan pengalihan (*redirect url*). Jika role Anda salah, sistem akan menampilkan peringatan dan memaksa Anda login dengan akun ber-role yang tepat.

### 2. Desktop Simulator (`/desktop`)
*   **Akses**: `http://localhost:3000/desktop` (Login diperlukan).
*   **Desain Premium**: Menggunakan sidebar modern full-height di sebelah kiri dan area konten responsif di sebelah kanan.
*   **Role-Based Access Control**:
    *   **PetugasSPPG**: Memiliki akses CRUD penuh untuk mengelola Pegawai, Bahan Baku, Sekolah, Kebutuhan Dapur, dan Pesanan Pemasok.
    *   **SupervisorSPPG**: Bersifat read-only untuk seluruh menu master/transaksi, tetapi memiliki hak eksklusif untuk **Validasi Status** pada menu Monitoring Produksi & Distribusi.
*   **Pemisahan Terminologi Kuantitas & Satuan**: Nilai numerik jumlah barang dan unit satuannya (kg, butir, liter) dipisah secara konsisten ke dalam kolom terpisah di seluruh tabel dan laporan cetak.

### 3. Mobile Pemasok Simulator (`/mobile`)
*   **Akses**: `http://localhost:3000/mobile` (Login diperlukan).
*   **Mockup Fisik**: Dirender di dalam bingkai (frame) visual telepon genggam lengkap dengan navigasi tombol kembali (*back button*).
*   **Fitur Stepper Timeline**: Detail pesanan menampilkan lini masa proses pengiriman (Pending &rarr; Diproses &rarr; Dikirim &rarr; Selesai) secara interaktif dengan aksi tombol dinamis.
*   **Toast Notifications**: Setiap tindakan sukses/gagal akan memicu popup notifikasi modern di bagian atas layar simulator.

### 4. API Docs Hub (`/docs`)
*   **Akses**: `http://localhost:3000/docs`.
*   **Dokumentasi 27 API**: Menampilkan semua rute API yang digunakan oleh frontend Next.js.
*   **Pemisahan Parameter**: Menjabarkan parameter berdasarkan lokasi pengirimannya (Path Parameters, Query Parameters, Request Body).
*   **Dynamic Code Generator**: Menyediakan contoh potongan kode siap salin dalam format **cURL**, **JavaScript (Fetch)**, dan **Python** yang nilainya berubah dinamis sesuai default parameter.

### 5. Database Console (`/health`)
*   **Akses**: `http://localhost:3000/health`.
*   Konsol interaktif untuk melihat kesehatan koneksi database, struktur skema saat ini, dan melakukan kueri SQL mentah secara langsung.

---

## ⚙️ Cara Menjalankan Project Secara Lokal

Ikuti langkah-langkah berikut untuk menjalankan web simulation di komputer lokal Anda:

### 1. Prasyarat
Pastikan Anda sudah menginstal:
*   [Node.js](https://nodejs.org/) (versi 18 ke atas)
*   Database PostgreSQL (atau gunakan layanan cloud gratis seperti [Neon.tech](https://neon.tech/))

### 2. Konfigurasi Environment Variables
1.  Salin file `.env.example` menjadi `.env` baru:
    ```bash
    cp .env.example .env
    ```
2.  Buka file `.env` dan isi variabel `DATABASE_URL` dengan string koneksi database Anda.
    *Contoh:*
    ```env
    DATABASE_URL="postgresql://username:password@localhost:5432/sppg_db"
    ```

### 3. Instalasi Dependensi
Jalankan perintah berikut untuk menginstal modul pustaka node:
```bash
npm install
```

### 4. Setup Database & Migrasi Skema
Jalankan migrasi database Prisma untuk menyelaraskan struktur tabel PostgreSQL:
```bash
npx prisma migrate dev
```

### 5. Seeding Data Akun & Transaksi Awal
Jalankan skrip seeder untuk mengisi data awal (termasuk satu pesanan pemasok berstatus *Pending* untuk uji coba):
```bash
npx prisma db seed
```

### 6. Jalankan Server Development
Jalankan perintah berikut untuk memulai server lokal:
```bash
npm run dev
```
Setelah jalan, buka **`http://localhost:3000`** di browser Anda.

---

## 🔑 Akun Uji Coba (Credentials)

Gunakan akun beriku untuk masuk ke simulator:

| Username | Password | Role | Penjelasan Hak Akses |
| :--- | :--- | :--- | :--- |
| `petugas` | `password123` | `PetugasSPPG` | CRUD master data desktop, order pemasok. |
| `supervisor` | `password123` | `SupervisorSPPG` | Read-only desktop, validasi masak & kirim porsi. |
| `pemasok1` | `password123` | `Pemasok` | Login khusus aplikasi Mobile Simulator. |

---

## 📘 Pembelajaran Database SQL Server (Desktop Direct DB)

Bagi peserta LKS yang berfokus pada **Modul Desktop (Windows Forms / WPF)** yang langsung terhubung ke database **Microsoft SQL Server** tanpa perantara web API:

*   Silakan buka dokumen panduan **[SQL_CRUD_GUIDE.md](file:///Users/ramdlanfaqih/projects/research-and-development/lks-jabar-sppg/SQL_CRUD_GUIDE.md)**.
*   File tersebut berisi rancangan skema basis data resmi, naskah SQL DDL lengkap untuk pembuatan database di SSMS, query CRUD standar, dan rancangan query agregasi untuk modul pelaporan.
