"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [activeDayTab, setActiveDayTab] = useState<"day1" | "day2">("day1");

  const day1Steps = [
    {
      num: 1,
      title: "Login Petugas SPPG",
      desc: "Petugas SPPG login ke aplikasi desktop menggunakan kredensial petugas.",
      linkText: "Buka Login Desktop",
      href: "/desktop/login",
      role: "Petugas",
      badge: "Auth"
    },
    {
      num: 2,
      title: "Input Data Pegawai",
      desc: "Petugas mengelola data pegawai yang bekerja di dapur SPPG.",
      linkText: "Kelola Pegawai",
      href: "/desktop/employees",
      role: "Petugas",
      badge: "CRUD"
    },
    {
      num: 3,
      title: "Input Data Bahan Baku",
      desc: "Petugas menginput inventori bahan baku masakan dan estimasi harga.",
      linkText: "Kelola Bahan Baku",
      href: "/desktop/materials",
      role: "Petugas",
      badge: "CRUD"
    },
    {
      num: 4,
      title: "Input Sekolah Penerima",
      desc: "Petugas mendaftarkan sekolah penerima makanan beserta jumlah siswa (porsi).",
      linkText: "Kelola Sekolah",
      href: "/desktop/schools",
      role: "Petugas",
      badge: "CRUD"
    },
    {
      num: 5,
      title: "Input Kebutuhan Dapur",
      desc: "Petugas menginput data pengeluaran bahan baku harian dapur untuk masak.",
      linkText: "Kebutuhan Dapur",
      href: "/desktop/kitchen-needs",
      role: "Petugas",
      badge: "CRUD"
    },
    {
      num: 6,
      title: "Buat Pesanan Bahan Baku",
      desc: "Petugas memesan bahan baku ke Pemasok (status awal otomatis Pending).",
      linkText: "Buat Pesanan",
      href: "/desktop/orders",
      role: "Petugas",
      badge: "Pemesanan"
    },
    {
      num: 7,
      title: "Ubah Status Pesanan",
      desc: "Petugas mengubah status pesanan menjadi Diproses atau Selesai.",
      linkText: "Update Status Pesanan",
      href: "/desktop/orders",
      role: "Petugas",
      badge: "Update Status"
    },
    {
      num: 8,
      title: "Input Produksi & Distribusi",
      desc: "Petugas menginput progress masakan dan status pengantaran ke sekolah.",
      linkText: "Produksi & Distribusi",
      href: "/desktop/distributions",
      role: "Petugas",
      badge: "Distribusi"
    },
    {
      num: 9,
      title: "Login Supervisor SPPG",
      desc: "Supervisor login ke sistem desktop menggunakan akun supervisor.",
      linkText: "Buka Login Desktop",
      href: "/desktop/login",
      role: "Supervisor",
      badge: "Auth"
    },
    {
      num: 10,
      title: "Pantau Real-Time Dashboard",
      desc: "Supervisor melihat visualisasi statistik pesanan, sisa stok, dan status porsi.",
      linkText: "Lihat Dashboard",
      href: "/desktop/dashboard",
      role: "Supervisor",
      badge: "Dashboard"
    },
    {
      num: 11,
      title: "Validasi Distribusi",
      desc: "Supervisor memantau dan memvalidasi penyelesaian porsi distribusi.",
      linkText: "Validasi Distribusi",
      href: "/desktop/distributions",
      role: "Supervisor",
      badge: "Validasi"
    },
    {
      num: 12,
      title: "Buka Laporan Sederhana",
      desc: "Supervisor melihat 4 jenis Laporan Operasional SPPG untuk evaluasi.",
      linkText: "Buka Laporan",
      href: "/desktop/reports",
      role: "Supervisor",
      badge: "Laporan"
    }
  ];

  const day2Steps = [
    {
      num: 1,
      title: "Login Pemasok Mobile",
      desc: "Pemasok masuk ke aplikasi simulator mobile menggunakan akun supplier.",
      linkText: "Buka Aplikasi Mobile",
      href: "/mobile",
      role: "Pemasok",
      badge: "Auth"
    },
    {
      num: 2,
      title: "Kirim Request Login ke API Juri",
      desc: "Aplikasi mobile memanggil endpoint POST /api/auth/login untuk autentikasi.",
      linkText: "Cek API Docs Login",
      href: "/docs",
      role: "Pemasok",
      badge: "POST API"
    },
    {
      num: 3,
      title: "Lihat Daftar Pesanan",
      desc: "Pemasok melihat feed daftar order bahan baku yang dipesan oleh SPPG.",
      linkText: "Daftar Pesanan",
      href: "/mobile",
      role: "Pemasok",
      badge: "GET API"
    },
    {
      num: 4,
      title: "Buka Detail Pesanan",
      desc: "Pemasok melihat rincian item, unit, kuantitas, dan catatan pesanan.",
      linkText: "Rincian Pesanan",
      href: "/mobile",
      role: "Pemasok",
      badge: "GET API [id]"
    },
    {
      num: 5,
      title: "Ubah Status Jadi 'Diproses'",
      desc: "Pemasok mengupdate status pengolahan pesanan menjadi 'Diproses'.",
      linkText: "Proses Pengiriman",
      href: "/mobile",
      role: "Pemasok",
      badge: "PUT API Status"
    },
    {
      num: 6,
      title: "Ubah Status Jadi 'Dikirim'",
      desc: "Setelah barang siap, pemasok menandai status pesanan menjadi 'Dikirim'.",
      linkText: "Kirim Pesanan",
      href: "/mobile",
      role: "Pemasok",
      badge: "PUT API Status"
    },
    {
      num: 7,
      title: "Tanggapan Response API",
      desc: "Aplikasi mobile menampilkan pesan berhasil atau gagal sesuai dengan status response API.",
      linkText: "Coba API Playground",
      href: "/docs",
      role: "Pemasok",
      badge: "Response Handling"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafcfd] text-slate-800 flex flex-col font-sans relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sppg/20 via-slate-50 to-slate-50 pointer-events-none z-0" />

      {/* Header bar */}
      <header className="relative z-10 border-b border-slate-200/80 bg-white/70 backdrop-blur px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 bg-sppg rounded-lg flex items-center justify-center font-black text-slate-850 shadow-md shadow-sppg/35 border border-sppg/40">
            S
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-slate-950 uppercase">SPPG Portal Hub</h1>
            <p className="text-[10px] text-slate-500 font-mono">LKS SMK Jawa Barat 2026 ITSSFB Reference Platform</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/health"
            className="text-xs font-bold text-slate-600 hover:text-slate-950 transition duration-150"
          >
            Health Monitor
          </Link>
          <span className="h-3 w-px bg-slate-200" />
          <Link
            href="/docs"
            className="text-xs font-bold text-slate-655 hover:text-slate-950 transition duration-150"
          >
            API Playground
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto p-6 md:p-10 flex flex-col justify-center space-y-12">
        
        {/* Title Hero */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-sppg text-slate-800 border border-sppg-dark/20 uppercase tracking-wider shadow-sm">
            Interactive Learning Guide
          </span>
          <h2 className="text-3xl font-black text-slate-950 tracking-tight leading-tight md:text-4xl">
            Smart Meal Distribution System
          </h2>
          <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
            Simulasi operasional Satuan Pelayanan Pemenuhan Gizi (SPPG) Jawa Barat. Sesuai dengan spesifikasi Kisi-Kisi LKS SMK Bidang IT Software Solution for Business.
          </p>
        </div>

        {/* Dual Card Simulator Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Desktop Application Simulator */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-lg flex flex-col justify-between hover:shadow-xl hover:border-slate-350 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-sppg/10 rounded-bl-[80px] pointer-events-none -z-10 group-hover:scale-110 transition-transform duration-350" />
            <div className="space-y-4">
              <div className="h-10 w-10 bg-sppg rounded-xl flex items-center justify-center font-black text-slate-800 shadow shadow-sppg/35 border border-sppg/45">
                D
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-950 group-hover:text-slate-800 transition">
                  Aplikasi Desktop SPPG
                </h3>
                <p className="text-[10px] text-slate-450 uppercase font-mono tracking-wider font-bold">
                  Simulasi Hari ke-1 (C# Windows App Mock)
                </p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Diakses oleh **Petugas SPPG** (memiliki akses penuh CRUD pegawai, bahan baku, sekolah, kebutuhan dapur, dan pembuatan order) serta **Supervisor SPPG** (memantau dashboard visual, validasi distribusi, dan laporan).
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/desktop"
                className="w-full py-3 rounded-xl bg-sppg hover:bg-sppg-dark text-slate-800 font-extrabold text-xs transition border border-sppg/40 shadow-md hover:shadow-lg flex items-center justify-center space-x-1.5"
              >
                <span>Buka Desktop Simulator</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Card 2: Mobile Application Simulator */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-lg flex flex-col justify-between hover:shadow-xl hover:border-slate-350 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-slate-100 rounded-bl-[80px] pointer-events-none -z-10 group-hover:scale-110 transition-transform duration-350" />
            <div className="space-y-4">
              <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-850 shadow border border-slate-200">
                M
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-950 group-hover:text-slate-700 transition">
                  Aplikasi Mobile Pemasok
                </h3>
                <p className="text-[10px] text-slate-450 uppercase font-mono tracking-wider font-bold">
                  Simulasi Hari ke-2 (Android App Simulator)
                </p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Diakses khusus oleh **Pemasok (Supplier)**. Terhubung dengan database via API Juri untuk menampilkan order bahan baku, meninjau rincian item, dan melakukan perubahan status delivery (*Diproses*, *Dikirim*).
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/mobile"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs transition border border-slate-950 shadow-md hover:shadow-lg flex items-center justify-center space-x-1.5"
              >
                <span>Buka Mobile Simulator</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Interactive Business Flow Roadmap */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Alur Bisnis Sistem (Sesuai Kisi-Kisi LKS)</h3>
              <p className="text-xs text-slate-500 mt-0.5">Panduan langkah-demi-langkah simulasi untuk pembelajaran dan penilaian juri.</p>
            </div>

            {/* Day Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs w-full sm:w-auto">
              <button
                onClick={() => setActiveDayTab("day1")}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-bold transition-all duration-150 ${
                  activeDayTab === "day1"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Hari ke-1 (Desktop SPPG)
              </button>
              <button
                onClick={() => setActiveDayTab("day2")}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-bold transition-all duration-150 ${
                  activeDayTab === "day2"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Hari ke-2 (Mobile Pemasok)
              </button>
            </div>
          </div>

          {/* Timeline Steps Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(activeDayTab === "day1" ? day1Steps : day2Steps).map((step) => (
              <div
                key={step.num}
                className="bg-slate-50/50 border border-slate-150 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:bg-white hover:border-slate-250 transition-all duration-200 shadow-sm"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                      LANGKAH {step.num}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        step.role === "Petugas"
                          ? "bg-sky-50 text-sky-700 border border-sky-100"
                          : step.role === "Supervisor"
                          ? "bg-purple-50 text-purple-700 border border-purple-100"
                          : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}>
                        {step.role}
                      </span>
                      <span className="text-[9px] font-bold font-mono bg-slate-150 text-slate-550 px-2 py-0.5 rounded-full border border-slate-200">
                        {step.badge}
                      </span>
                    </div>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900">{step.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>

                <div className="pt-1.5 border-t border-slate-100">
                  <Link
                    href={step.href}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
                  >
                    <span>{step.linkText}</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-indigo-50/40 border border-indigo-100/50 rounded-2xl p-4 text-xs text-slate-600 leading-relaxed font-semibold">
            💡 <strong>Saran Praktik:</strong> Jalankan alur secara berurutan! Mulai dengan login sebagai <strong>Petugas</strong> di simulator desktop untuk membuat data dasar & pesanan bahan baku (status awal: <em>Pending</em>). Kemudian buka simulator <strong>Mobile</strong> sebagai Pemasok untuk mengupdate pesanan tersebut menjadi <em>Diproses</em> lalu <em>Dikirim</em>. Terakhir, login sebagai <strong>Supervisor</strong> di desktop untuk memantau status secara keseluruhan.
          </div>
        </div>

        {/* Diagnostic shortcuts bar */}
        <div className="bg-slate-100/60 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-inner">
          <div className="text-left">
            <p className="font-bold text-slate-900">Validasi Integrasi Database & API</p>
            <p className="text-[10px] text-slate-505 font-medium">Gunakan console diagnosa dan dokumentasi interaktif untuk menguji response API secara real-time.</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/health"
              className="bg-white hover:bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-750 font-bold shadow-sm transition"
            >
              Database Console
            </Link>
            <Link
              href="/docs"
              className="bg-white hover:bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-750 font-bold shadow-sm transition"
            >
              Endpoint API Docs
            </Link>
          </div>
        </div>
      </main>

      {/* Footer bar */}
      <footer className="border-t border-slate-200/80 bg-white/40 py-6 px-6 text-center text-xs text-slate-550 shadow-inner">
        <p className="font-mono">
          &copy; 2026 SPPG. LKS SMK Jawa Barat 2026 ITSSFB Reference Implementation.
        </p>
      </footer>
    </div>
  );
}
