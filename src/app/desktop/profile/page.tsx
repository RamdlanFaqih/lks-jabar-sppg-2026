"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CurrentUser {
  userId: number;
  username: string;
  fullName: string;
  role: string;
  position: string;
}

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/desktop/login");
  };

  if (!currentUser) {
    return (
      <div className="py-20 text-center">
        <p className="text-xs text-slate-500 font-mono">Memuat detail profil...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm max-w-xl">
      <div className="border-b border-slate-100 pb-3 flex items-center space-x-4">
        <div className="h-12 w-12 bg-sppg rounded-full flex items-center justify-center font-black text-slate-850 text-lg border border-sppg/40 shadow-sm">
          {currentUser.fullName.charAt(0)}
        </div>
        <div>
          <h3 className="text-base font-extrabold text-slate-900">{currentUser.fullName}</h3>
          <p className="text-xs text-slate-500 font-mono">User Profile Details</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Username</span>
          <p className="text-sm font-semibold text-slate-900 font-mono">{currentUser.username}</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Nama Lengkap</span>
          <p className="text-sm font-semibold text-slate-900">{currentUser.fullName}</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Sistem Role</span>
          <p className="text-sm font-semibold text-slate-900">
            {currentUser.role === "PetugasSPPG" ? "Petugas SPPG" : "Supervisor SPPG"}
          </p>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Jabatan / Posisi</span>
          <p className="text-sm font-semibold text-slate-900">{currentUser.position}</p>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-750 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition"
        >
          Logout dari Sistem SPPG
        </button>
      </div>
    </div>
  );
}
