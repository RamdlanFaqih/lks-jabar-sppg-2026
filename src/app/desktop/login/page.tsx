"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectUrl = searchParams.get("redirect") || "/desktop/dashboard";
  const requiredRole = searchParams.get("role"); // "Petugas" or "Supervisor"

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
        const role = data.user.role; // "PetugasSPPG" or "SupervisorSPPG" or "Pemasok"

        if (role === "PetugasSPPG" || role === "SupervisorSPPG") {
          // Check role alignment if requested from portal
          if (requiredRole === "Petugas" && role !== "PetugasSPPG") {
            setError("Akses Ditolak. Langkah ini memerlukan akun dengan role PetugasSPPG.");
            setLoading(false);
            return;
          }
          if (requiredRole === "Supervisor" && role !== "SupervisorSPPG") {
            setError("Akses Ditolak. Langkah ini memerlukan akun dengan role SupervisorSPPG.");
            setLoading(false);
            return;
          }

          localStorage.setItem("currentUser", JSON.stringify(data.user));
          router.replace(redirectUrl);
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
    <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-2xl relative z-10">
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 bg-sppg rounded-xl items-center justify-center font-black text-slate-800 shadow-md shadow-sppg/40 border border-sppg/50 mb-2 text-xl">
          S
        </div>
        <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">SPPG Desktop App</h2>
        <p className="text-xs text-slate-500">Sistem Operasional Pemenuhan Gizi (Hari ke-1)</p>
        {requiredRole && (
          <div className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-250 rounded-full text-[10px] font-bold">
            ⚠️ Login khusus akun: {requiredRole === "Petugas" ? "Petugas SPPG" : "Supervisor SPPG"}
          </div>
        )}
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
        <p className="text-[10px] uppercase font-bold text-slate-455 tracking-wider text-center">
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
  );
}

export default function DesktopLoginPage() {
  return (
    <div className="min-h-screen bg-[#fafcfd] text-slate-800 flex flex-col items-center justify-center font-sans p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sppg/20 via-slate-50 to-slate-50 pointer-events-none z-0" />
      <Suspense fallback={
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-2xl relative z-10 flex flex-col justify-center items-center py-20">
          <div className="animate-spin h-7 w-7 text-slate-450 border-2 border-slate-200 border-t-slate-500 rounded-full" />
          <p className="text-xs mt-3 text-slate-550">Memuat form login...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
