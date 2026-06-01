"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

interface CurrentUser {
  userId: number;
  username: string;
  fullName: string;
  role: string;
  position: string;
}

export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      try {
        const user = JSON.parse(userStr) as CurrentUser;
        setCurrentUser(user);

        // Redirect away from login if already authenticated
        if (pathname === "/desktop/login" || pathname === "/desktop") {
          router.replace("/desktop/dashboard");
        }
      } catch (e) {
        localStorage.removeItem("currentUser");
        if (pathname !== "/desktop/login") {
          router.replace("/desktop/login");
        }
      }
    } else {
      if (pathname !== "/desktop/login") {
        router.replace("/desktop/login");
      }
    }
    setLoading(false);
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    router.push("/desktop/login");
  };

  // If loading or route is login (login does not render layout sidebar)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafcfd] flex flex-col items-center justify-center font-sans">
        <div className="animate-spin h-7 w-7 text-slate-450 border-2 border-slate-200 border-t-slate-500 rounded-full" />
        <p className="text-xs text-slate-550 font-mono mt-3">Verifikasi sesi operasional...</p>
      </div>
    );
  }

  if (pathname === "/desktop/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans selection:bg-sppg/40 selection:text-slate-900">
      {/* Navigation Sidebar - Docked Full Height on Left */}
      <nav className="w-64 h-screen sticky top-0 bg-white border-r border-slate-200 flex flex-col justify-between p-5 z-20 flex-shrink-0 shadow-sm">
        <div className="space-y-6">
          {/* Brand/Logo inside Sidebar */}
          <div className="flex items-center space-x-3 px-1">
            <div className="h-9 w-9 bg-sppg rounded-lg flex items-center justify-center font-bold text-slate-800 shadow-md shadow-sppg/30 border border-sppg/40">
              S
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight text-slate-950 uppercase leading-none">SPPG Desktop</h1>
              <p className="text-[9px] text-slate-500 mt-1 font-semibold">Simulated Environment</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider px-3 mb-2">Main Menu</p>
            {[
              { id: "dashboard", href: "/desktop/dashboard", label: "Dashboard Overview" },
              { id: "employees", href: "/desktop/employees", label: "Data Pegawai" },
              { id: "materials", href: "/desktop/materials", label: "Data Bahan Baku" },
              { id: "schools", href: "/desktop/schools", label: "Sekolah Penerima" },
              { id: "needs", href: "/desktop/kitchen-needs", label: "Kebutuhan Dapur" },
              { id: "orders", href: "/desktop/orders", label: "Pesanan ke Pemasok" },
              { id: "distributions", href: "/desktop/distributions", label: "Produksi & Distribusi" },
              { id: "reports", href: "/desktop/reports", label: "Laporan Operasional" },
              { id: "profile", href: "/desktop/profile", label: "Profil Saya" },
            ].map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition duration-150 flex items-center justify-between ${
                    isActive
                      ? "bg-sppg text-slate-800 shadow-md border border-sppg/40"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-3">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer transition flex items-center space-x-2 border-0"
          >
            <span>🚪</span>
            <span>Logout dari Sistem</span>
          </button>
        </div>
      </nav>

      {/* Right Side Pane: Header + Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Main Header */}
        <header className="border-b border-slate-200 bg-white/70 backdrop-blur px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
          <div>
            <h2 className="text-xs font-bold text-slate-500 font-mono">LKS Jabar 2026 Reference Implementation</h2>
          </div>

          {/* Current Active Account Header widget */}
          {currentUser && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900">{currentUser.fullName}</p>
                <p className="text-[9px] text-slate-455 font-mono uppercase tracking-wider font-bold">
                  {currentUser.role === "PetugasSPPG" ? "Petugas SPPG" : "Supervisor SPPG"} ({currentUser.position})
                </p>
              </div>
              <span className="h-6 w-px bg-slate-200" />
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer font-sans"
              >
                Logout
              </button>
            </div>
          )}
        </header>

        {/* Content Viewport */}
        <main className="p-6 md:p-8 flex-1 overflow-y-auto bg-slate-50">
          <section className="w-full max-w-full">
            {children}
          </section>
        </main>
      </div>
    </div>
  );
}
