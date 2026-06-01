"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./layout";

interface SupplierOrder {
  orderId: number;
  orderDate: string;
  supplierName: string;
  materialId?: number;
  orderQuantity?: number;
  unit?: string;
  status: string;
  notes?: string | null;
}

export default function MobileOrdersPage() {
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listTab, setListTab] = useState<"active" | "history">("active");
  const [networkError, setNetworkError] = useState("");

  const router = useRouter();
  const { showToast } = useToast();

  // Load orders list
  const loadOrdersList = async () => {
    try {
      setLoadingList(true);
      setNetworkError("");
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        const errMsg = "Gagal mengambil data pesanan.";
        setNetworkError(errMsg);
        showToast("error", errMsg);
      }
    } catch (err: any) {
      const errMsg = "API Offline atau kesalahan koneksi.";
      setNetworkError(errMsg);
      showToast("error", errMsg);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadOrdersList();
  }, []);

  if (loadingList && orders.length === 0) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-24 space-y-2">
        <div className="animate-spin h-6 w-6 text-slate-455 border-2 border-slate-200 border-t-slate-500 rounded-full" />
        <p className="text-[10px] text-slate-400 font-mono">Sinkronisasi pesanan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-1 animate-fadeIn flex-1 flex flex-col">
      <div className="flex justify-between items-center border-b border-slate-150 pb-2">
        <div>
          <h3 className="text-xs font-black text-slate-900 uppercase">Daftar Pengiriman</h3>
          <p className="text-[9px] text-slate-455 font-mono">Bahan Baku Dapur SPPG</p>
        </div>
        <button
          onClick={loadOrdersList}
          className="text-[10px] font-bold text-slate-550 hover:text-slate-800 cursor-pointer"
        >
          Refresh
        </button>
      </div>

      {networkError && (
        <div className="bg-rose-50 border border-rose-100 rounded-xl p-2.5 text-[10px] text-rose-600 font-medium text-center leading-normal">
          {networkError}
        </div>
      )}

      {/* Standard List Tabs */}
      <div className="flex bg-slate-200/50 p-1 rounded-xl border border-slate-200 text-xs">
        <button
          onClick={() => setListTab("active")}
          className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
            listTab === "active" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Pesanan Aktif ({orders.filter(o => ["Pending", "Diproses", "Dikirim"].includes(o.status)).length})
        </button>
        <button
          onClick={() => setListTab("history")}
          className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
            listTab === "history" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Riwayat ({orders.filter(o => o.status === "Selesai").length})
        </button>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {(() => {
          const filtered = orders.filter((o) => {
            if (listTab === "active") {
              return ["Pending", "Diproses", "Dikirim"].includes(o.status);
            } else {
              return o.status === "Selesai";
            }
          });

          if (filtered.length === 0) {
            return (
              <div className="bg-white border border-slate-205 rounded-2xl py-12 px-4 text-center">
                <p className="text-xs text-slate-400 font-medium">
                  Tidak ada pesanan {listTab === "active" ? "aktif" : "selesai"}.
                </p>
              </div>
            );
          }

          return filtered.map((o) => (
            <button
              key={o.orderId}
              onClick={() => router.push(`/mobile/orders/${o.orderId}`)}
              className="w-full text-left bg-white border border-slate-200 hover:border-slate-350 p-4 rounded-2xl shadow-sm transition-all duration-150 flex items-center space-x-3 cursor-pointer group"
            >
              {/* Icon */}
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                o.status === "Pending" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                o.status === "Diproses" ? "bg-sky-50 text-sky-600 border border-sky-100" :
                o.status === "Dikirim" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                "bg-emerald-50 text-emerald-600 border border-emerald-100"
              }`}>
                <span className="text-sm">
                  {o.status === "Selesai" ? "✓" : "📦"}
                </span>
              </div>

              {/* Middle Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-mono text-slate-400 font-semibold block">Order #{o.orderId}</span>
                  <span className="text-[9px] font-mono text-slate-400 block">{o.orderDate}</span>
                </div>
                <span className="text-xs font-extrabold text-slate-900 truncate block mt-0.5">{o.supplierName}</span>
                <span className="text-[9px] text-slate-450 block truncate mt-0.5">Bahan baku dapur SPPG</span>
              </div>

              {/* Right Chevron & Badge */}
              <div className="flex flex-col items-end space-y-1.5 flex-shrink-0">
                <span
                  className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    o.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-250/30" :
                    o.status === "Diproses" ? "bg-sky-50 text-sky-700 border-sky-250/30" :
                    o.status === "Dikirim" ? "bg-indigo-50 text-indigo-700 border-indigo-250/30" :
                    "bg-emerald-50 text-emerald-700 border-emerald-250/30"
                  }`}
                >
                  {o.status}
                </span>
                <span className="text-slate-350 group-hover:text-slate-600 transition-colors text-xs font-bold">&rarr;</span>
              </div>
            </button>
          ));
        })()}
      </div>
    </div>
  );
}
