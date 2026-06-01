"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DesktopLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e?: React.FormEvent, customCreds?: { u: string; p: string }) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    const u = customCreds ? customCreds.u : username;
    const p = customCreds ? customCreds.p : password;

    if (!u || !p) {
      setError("Username dan password wajib diisi.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, password: p }),
      });

      if (res.ok) {
        const data = await res.json();
        const role = data.user.role;

        if (role === "PetugasSPPG" || role === "SupervisorSPPG") {
          localStorage.setItem("currentUser", JSON.stringify(data.user));
          router.replace("/desktop/dashboard");
        } else {
          setError("Akses Ditolak. Role Pemasok hanya diizinkan login di Aplikasi Mobile.");
        }
      } else {
        const err = await res.json();
        setError(err.message || "Username atau password salah.");
      }
    } catch (err: any) {
      setError(`Koneksi error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafcfd] text-slate-800 flex flex-col items-center justify-center font-sans p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sppg/20 via-slate-50 to-slate-50 pointer-events-none z-0" />

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-2xl relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 bg-sppg rounded-xl items-center justify-center font-black text-slate-800 shadow-md shadow-sppg/40 border border-sppg/50 mb-2 text-xl">
            S
          </div>
          <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">SPPG Desktop App</h2>
          <p className="text-xs text-slate-500">Sistem Operasional Pemenuhan Gizi (Hari ke-1)</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-xs text-rose-600 font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Username</label>
            <input
              type="text"
              required
              placeholder="Masukkan username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sppg-dark focus:ring-1 focus:ring-sppg transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
            <input
              type="password"
              required
              placeholder="Masukkan password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sppg-dark focus:ring-1 focus:ring-sppg transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sppg hover:bg-sppg-dark text-slate-800 font-extrabold py-3 rounded-xl text-sm transition border border-sppg/40 shadow-md cursor-pointer disabled:opacity-50"
          >
            {loading ? "Menghubungkan..." : "Sign In"}
          </button>
        </form>

        {/* Quick Login box */}
        <div className="border-t border-slate-100 pt-5 space-y-3">
          <p className="text-[10px] uppercase font-bold text-slate-450 tracking-wider text-center">
            Quick Authenticate (Simulasi Evaluasi)
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleLogin(undefined, { u: "petugas", p: "password123" })}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 py-2 rounded-xl text-xs font-bold text-slate-700 text-center cursor-pointer transition shadow-sm"
            >
              As Petugas
            </button>
            <button
              onClick={() => handleLogin(undefined, { u: "supervisor", p: "password123" })}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 py-2 rounded-xl text-xs font-bold text-slate-700 text-center cursor-pointer transition shadow-sm"
            >
              As Supervisor
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            &larr; Kembali Ke Portal Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
