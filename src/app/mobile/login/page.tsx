"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "../layout";

export default function MobileLoginPage() {
  const [loginUsername, setLoginUsername] = useState("pemasok1");
  const [loginPassword, setLoginPassword] = useState("password123");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { showToast } = useToast();

  const handleMobileLogin = async (e: React.FormEvent, customCreds?: { u: string; p: string }) => {
    if (e) e.preventDefault();
    setLoginError("");
    setLoading(true);

    const username = customCreds ? customCreds.u : loginUsername;
    const password = customCreds ? customCreds.p : loginPassword;

    if (!username || !password) {
      setLoginError("Username dan password wajib diisi.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        const userRole = data.user.role;

        if (userRole === "Pemasok") {
          localStorage.setItem("currentMobileUser", JSON.stringify(data.user));
          showToast("success", `Response 200 OK: Autentikasi berhasil.`);
          router.push("/mobile");
        } else {
          setLoginError("Akses Ditolak. Hanya role Pemasok yang dapat menggunakan aplikasi mobile ini.");
          showToast("error", "Akses Ditolak: Role bukan Pemasok.");
        }
      } else {
        const err = await res.json();
        setLoginError(err.message || "Username atau password salah.");
        showToast("error", err.message || "Autentikasi gagal.");
      }
    } catch (err: any) {
      setLoginError(`Koneksi error: ${err.message}`);
      showToast("error", `Koneksi gagal: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-center space-y-6 py-12">
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 bg-sppg rounded-xl items-center justify-center font-black text-slate-800 shadow shadow-sppg/35 border border-sppg/40 mb-1">
          P
        </div>
        <h3 className="text-lg font-extrabold text-slate-900">Pemasok Login</h3>
        <p className="text-xs text-slate-500">Aplikasi Pengiriman Bahan Baku (Hari ke-2)</p>
      </div>

      {loginError && (
        <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-xs text-rose-600 font-medium text-center leading-normal">
          {loginError}
        </div>
      )}

      <form onSubmit={(e) => handleMobileLogin(e)} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Username</label>
          <input
            type="text"
            required
            placeholder="Username pemasok..."
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-xs focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 text-slate-800"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Password</label>
          <input
            type="password"
            required
            placeholder="Password..."
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-xs focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 text-slate-800"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sppg hover:bg-sppg-dark text-slate-800 font-extrabold py-3 rounded-xl text-xs transition border border-sppg/40 shadow cursor-pointer mt-1 disabled:opacity-50"
        >
          {loading ? "Authenticating..." : "Authenticate Account"}
        </button>
      </form>

      {/* Quick evaluation selector */}
      <div className="border-t border-slate-150 pt-5 text-center space-y-2">
        <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
          Quick Login (Evaluator Juri)
        </span>
        <button
          onClick={() => handleMobileLogin(null as any, { u: "pemasok1", p: "password123" })}
          className="bg-slate-100 hover:bg-slate-200 border border-slate-250 py-2.5 px-4 rounded-xl text-[10px] font-bold text-slate-750 cursor-pointer transition shadow-sm"
        >
          CV Pangan Sejahtera (Pemasok)
        </button>
      </div>
    </div>
  );
}
