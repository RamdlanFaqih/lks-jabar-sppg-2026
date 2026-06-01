"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

interface Toast {
  type: "success" | "error";
  message: string;
}

interface ToastContextType {
  showToast: (type: "success" | "error", message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  useEffect(() => {
    const userStr = localStorage.getItem("currentMobileUser");
    const user = userStr ? JSON.parse(userStr) : null;
    
    // Auth redirect checks
    if (!user) {
      if (pathname !== "/mobile/login") {
        router.push("/mobile/login");
      }
    } else {
      if (user.role !== "Pemasok") {
        localStorage.removeItem("currentMobileUser");
        showToast("error", "Hanya akun role Pemasok yang diizinkan.");
        router.push("/mobile/login");
      } else {
        setCurrentUser(user);
        if (pathname === "/mobile/login") {
          router.push("/mobile");
        }
      }
    }
    setCheckedAuth(true);
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("currentMobileUser");
    setCurrentUser(null);
    showToast("success", "Sesi login Pemasok telah berakhir.");
    router.push("/mobile/login");
  };

  // Prevent flash before authentication check completes
  if (!checkedAuth) {
    return (
      <div className="min-h-screen bg-slate-100 flex justify-center font-sans relative">
        <div className="w-full max-w-md min-h-screen bg-slate-50 shadow-xl flex flex-col justify-center items-center relative z-10 border-x border-slate-200">
          <div className="animate-spin h-6 w-6 text-slate-450 border-2 border-slate-200 border-t-slate-500 rounded-full" />
          <p className="text-[10px] mt-2 text-slate-400 font-mono">Memuat simulator mobile...</p>
        </div>
      </div>
    );
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div className="min-h-screen bg-slate-100 flex justify-center font-sans relative">
        {/* Background Graphic */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sppg/10 via-slate-100 to-slate-100 pointer-events-none z-0" />

        {/* Screen Content Wrapper - Full Height but Mobile Width */}
        <div className="w-full max-w-md min-h-screen bg-slate-50 shadow-xl flex flex-col relative z-10 text-slate-855 border-x border-slate-200">
          
          {/* Header Bar */}
          <header className="bg-white border-b border-slate-150 px-4 py-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
            <span className="text-xs font-black tracking-tight text-slate-900 font-sans uppercase">
              Pemasok Mobile System
            </span>
            {currentUser && (
              <button
                onClick={handleLogout}
                className="text-[10px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-100 cursor-pointer"
              >
                Sign Out
              </button>
            )}
          </header>

          {/* Toast Notification Banner (centered relative to mobile container) */}
          {toast && (
            <div className="absolute top-16 inset-x-4 z-50 animate-fade-in">
              <div className={`px-4 py-2.5 text-[11px] font-semibold text-center border rounded-xl shadow-md transition-all duration-300 flex items-center justify-center space-x-2 ${
                toast.type === "success" 
                  ? "bg-emerald-50 text-emerald-800 border-emerald-150" 
                  : "bg-rose-50 text-rose-800 border-rose-150"
              }`}>
                <span>{toast.type === "success" ? "✓" : "⚠"}</span>
                <span>{toast.message}</span>
              </div>
            </div>
          )}

          {/* View Body */}
          <div className="flex-1 p-5 flex flex-col overflow-y-auto">
            {children}
          </div>

          {/* Bottom Screen Navigation Mockup */}
          <footer className="bg-white border-t border-slate-150 px-4 py-3.5 flex items-center justify-between text-slate-400 text-[10px] font-bold sticky bottom-0 z-30">
            <Link
              href="/"
              className="text-[10px] font-bold text-slate-500 hover:text-slate-800 transition"
            >
              &larr; Portal Utama
            </Link>
            <span className="font-mono text-[9px]">WiFi 5G</span>
            <span className="font-mono text-[9px]">BAT 99%</span>
          </footer>
        </div>
      </div>
    </ToastContext.Provider>
  );
}
