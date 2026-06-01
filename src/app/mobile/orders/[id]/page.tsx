"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "../../layout";

interface SupplierOrder {
  orderId: number;
  supplierName: string;
  status: string;
  notes?: string | null;
  orderDate?: string;
  items?: {
    itemName: string;
    quantity: number;
    unit: string;
  }[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MobileOrderDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const orderId = Number(id);

  const [order, setOrder] = useState<SupplierOrder | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();
  const { showToast } = useToast();

  const loadOrderDetail = async () => {
    try {
      setLoadingDetail(true);
      setErrorMsg("");
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        const msg = "Gagal memuat detail pesanan.";
        setErrorMsg(msg);
        showToast("error", msg);
      }
    } catch (err: any) {
      const msg = "Koneksi gagal saat mengambil detail.";
      setErrorMsg(msg);
      showToast("error", msg);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    if (!isNaN(orderId)) {
      loadOrderDetail();
    }
  }, [orderId]);

  // Perform status update PUT /api/orders/[id]/status
  const handleUpdateStatus = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Refresh details
        await loadOrderDetail();
        showToast("success", `Response 200 OK: Status order #${orderId} diubah ke "${newStatus}".`);
      } else {
        const err = await res.json();
        showToast("error", `Response ${res.status}: ${err.message || "Gagal update status."}`);
      }
    } catch (error: any) {
      showToast("error", `Koneksi gagal: ${error.message}`);
    }
  };

  if (loadingDetail) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-24 space-y-2">
        <div className="animate-spin h-5 w-5 text-slate-450 border-2 border-slate-200 border-t-slate-500 rounded-full" />
        <p className="text-[10px] text-slate-400 font-mono">Loading details...</p>
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="space-y-4 py-1 flex-1 flex flex-col justify-center items-center text-center">
        <p className="text-xs text-rose-600 font-medium">{errorMsg || "Pesanan tidak ditemukan."}</p>
        <button
          onClick={() => router.push("/mobile")}
          className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
        >
          Kembali ke Daftar Pesanan
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-1 animate-fadeIn flex-1 flex flex-col justify-between">
      <div className="space-y-4">
        <button
          onClick={() => router.push("/mobile")}
          className="text-xs font-bold text-slate-500 hover:text-slate-850 flex items-center space-x-1.5 cursor-pointer bg-transparent border-0 outline-none p-0"
        >
          <span>&larr; Kembali ke Pesanan</span>
        </button>

        {/* Order Card Info */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
          <div className="flex justify-between items-start border-b border-slate-100 pb-3">
            <div>
              <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider">Order Rincian</span>
              <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">{order.supplierName}</h4>
              <p className="text-[9px] text-slate-450 font-mono mt-0.5">
                Order ID: #{order.orderId}
              </p>
            </div>
            <span
              className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                order.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200/50" :
                order.status === "Diproses" ? "bg-sky-50 text-sky-700 border-sky-200/50" :
                order.status === "Dikirim" ? "bg-indigo-50 text-indigo-700 border-indigo-200/50" :
                "bg-emerald-50 text-emerald-700 border-emerald-200/50"
              }`}
            >
              {order.status}
            </span>
          </div>

          {/* Items list */}
          <div className="space-y-2">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Bahan Baku Dipesan</span>
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center bg-slate-50 border border-slate-150 p-3 rounded-xl">
                <div className="flex items-center space-x-2.5">
                  <div className="h-7 w-7 bg-white rounded-lg flex items-center justify-center border border-slate-200 text-xs">
                    📦
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{item.itemName}</p>
                    <p className="text-[9px] text-slate-400 font-mono">Bahan Baku Dapur</p>
                  </div>
                </div>
                <span className="text-xs font-black text-slate-950 font-mono bg-white px-2.5 py-1 rounded-lg border border-slate-150 shadow-sm">
                  {item.quantity} {item.unit}
                </span>
              </div>
            ))}
          </div>

          {order.notes && (
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Catatan SPPG</span>
              <p className="text-[10px] text-slate-650 bg-slate-50 p-3 rounded-xl leading-relaxed border border-slate-150">
                {order.notes}
              </p>
            </div>
          )}
        </div>

        {/* Shipment Tracking Timeline / Stepper */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
          <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Lacak Pengiriman</h5>
          <div className="space-y-4 relative">
            {[
              { key: "Pending", label: "Pesanan Dibuat", sub: "Menunggu konfirmasi pemasok" },
              { key: "Diproses", label: "Sedang Diproses", sub: "Pemasok menyiapkan bahan baku" },
              { key: "Dikirim", label: "Dalam Pengiriman", sub: "Kurir mengirim bahan baku ke SPPG" },
              { key: "Selesai", label: "Selesai Diterima", sub: "Dapur SPPG memverifikasi bahan baku" }
            ].map((st, idx, arr) => {
              const statusesOrder = ["Pending", "Diproses", "Dikirim", "Selesai"];
              const currentIdx = statusesOrder.indexOf(order.status);
              const isCompleted = idx <= currentIdx;
              const isActive = idx === currentIdx;
              
              return (
                <div key={st.key} className="flex space-x-3.5 relative" style={{ zIndex: 10 - idx }}>
                  {idx < arr.length - 1 && (
                    <div className={`absolute left-3.5 top-6 bottom-[-20px] w-0.5 -translate-x-1/2 -z-10 ${
                      idx < currentIdx ? "bg-indigo-500" : "bg-slate-200"
                    }`} />
                  )}
                  
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-black border transition-all ${
                    isActive ? "bg-indigo-600 text-white border-indigo-600 ring-4 ring-indigo-100" :
                    isCompleted ? "bg-indigo-550 text-white border-indigo-550" :
                    "bg-white text-slate-350 border-slate-200"
                  }`}>
                    {isCompleted ? "✓" : idx + 1}
                  </div>
                  
                  <div className="flex-1 pt-0.5">
                    <p className={`text-xs font-bold ${isActive ? "text-indigo-900" : isCompleted ? "text-slate-800" : "text-slate-400"}`}>
                      {st.label}
                    </p>
                    <p className={`text-[10px] mt-0.5 ${isActive ? "text-indigo-600 font-medium" : "text-slate-400"}`}>
                      {st.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contextual Action Button */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mt-4">
        {order.status === "Pending" && (
          <button
            onClick={() => handleUpdateStatus("Diproses")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3.5 rounded-xl text-xs transition shadow-md flex items-center justify-center space-x-2 cursor-pointer border-0"
          >
            <span>⚙</span>
            <span>Terima & Proses Pesanan</span>
          </button>
        )}
        {order.status === "Diproses" && (
          <button
            onClick={() => handleUpdateStatus("Dikirim")}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl text-xs transition shadow-md flex items-center justify-center space-x-2 cursor-pointer border-0"
          >
            <span>🚚</span>
            <span>Kirim Bahan Baku Sekarang</span>
          </button>
        )}
        {order.status === "Dikirim" && (
          <div className="bg-slate-100 border border-slate-200 rounded-xl p-3.5 text-center text-xs text-slate-500 font-semibold flex items-center justify-center space-x-2">
            <span className="h-2 w-2 bg-indigo-500 rounded-full animate-ping" />
            <span>Dalam Pengantaran (Menunggu Konfirmasi Dapur SPPG)</span>
          </div>
        )}
        {order.status === "Selesai" && (
          <div className="bg-emerald-50 border border-emerald-150 rounded-xl p-3.5 text-center text-xs text-emerald-800 font-extrabold flex items-center justify-center space-x-1.5">
            <span>✓ Bahan Baku Telah Diterima & Selesai</span>
          </div>
        )}
      </div>
    </div>
  );
}
