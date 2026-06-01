"use client";

import { useEffect, useState } from "react";

interface RawMaterial {
  materialId: number;
  materialName: string;
  category: string;
  unit: string;
  stock: number;
  estimatedPrice: number;
}

interface KitchenNeed {
  needId: number;
  needDate: string;
  materialId: number;
  quantity: number;
  unit: string;
  notes: string | null;
  material?: { materialName: string };
}

interface SupplierOrder {
  orderId: number;
  orderDate: string;
  supplierName: string;
  materialId: number;
  orderQuantity: number;
  unit: string;
  status: string;
  material?: { materialName: string };
}

interface ProductionDistribution {
  processId: number;
  processDate: string;
  schoolId: number;
  portionCount: number;
  productionStatus: string;
  distributionStatus: string;
  notes: string | null;
  school?: { schoolName: string };
}

export default function ReportsPage() {
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [needs, setNeeds] = useState<KitchenNeed[]>([]);
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [distributions, setDistributions] = useState<ProductionDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resMat, resNeed, resOrd, resDist] = await Promise.all([
          fetch("/api/materials"),
          fetch("/api/kitchen-needs"),
          fetch("/api/orders"),
          fetch("/api/production-distribution"),
        ]);

        if (resMat.ok) setMaterials(await resMat.json());
        if (resNeed.ok) setNeeds(await resNeed.json());
        if (resOrd.ok) setOrders(await resOrd.json());
        if (resDist.ok) setDistributions(await resDist.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-3 shadow-sm">
        <div className="animate-spin h-7 w-7 text-slate-455 border-2 border-slate-200 border-t-slate-500 rounded-full" />
        <p className="text-xs text-slate-550 font-mono">Menyusun laporan operasional...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Report 1: Raw Materials Stock */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Laporan 1: Stok & Estimasi Biaya Bahan Baku</h4>
        <table className="min-w-full text-left text-xs divide-y divide-slate-100">
          <thead className="bg-slate-50 font-bold text-slate-700">
            <tr>
              <th className="px-4 py-2">Bahan Baku</th>
              <th className="px-4 py-2">Kategori</th>
              <th className="px-4 py-2">Stok</th>
              <th className="px-4 py-2">Satuan</th>
              <th className="px-4 py-2">Estimasi Harga</th>
              <th className="px-4 py-2">Total Nilai Aset</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-650">
            {materials.map((m) => (
              <tr key={m.materialId} className="hover:bg-slate-50/20">
                <td className="px-4 py-2.5 font-semibold text-slate-850">{m.materialName}</td>
                <td className="px-4 py-2">{m.category}</td>
                <td className="px-4 py-2 font-mono">{Number(m.stock).toFixed(2)}</td>
                <td className="px-4 py-2 font-medium text-slate-500">{m.unit}</td>
                <td className="px-4 py-2 font-mono">Rp {Number(m.estimatedPrice).toLocaleString()}</td>
                <td className="px-4 py-2 font-mono font-semibold text-slate-900">
                  Rp {(Number(m.stock) * Number(m.estimatedPrice)).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Report 2: Kitchen Needs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Laporan 2: Penggunaan Bahan Baku Dapur SPPG</h4>
        <table className="min-w-full text-left text-xs divide-y divide-slate-100">
          <thead className="bg-slate-50 font-bold text-slate-700">
            <tr>
              <th className="px-4 py-2">Tanggal Kebutuhan</th>
              <th className="px-4 py-2">Item Bahan Baku</th>
              <th className="px-4 py-2">Jumlah</th>
              <th className="px-4 py-2">Satuan</th>
              <th className="px-4 py-2">Notes Kebutuhan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-655">
            {needs.map((n) => (
              <tr key={n.needId} className="hover:bg-slate-50/20">
                <td className="px-4 py-2.5 font-mono">{n.needDate.split("T")[0]}</td>
                <td className="px-4 py-2 font-semibold text-slate-900">{n.material?.materialName}</td>
                <td className="px-4 py-2 font-mono">{Number(n.quantity).toFixed(2)}</td>
                <td className="px-4 py-2 font-medium text-slate-500">{n.unit}</td>
                <td className="px-4 py-2">{n.notes || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Report 3: Supplier Orders */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Laporan 3: Rekapitulasi Pesanan ke Pemasok</h4>
        <table className="min-w-full text-left text-xs divide-y divide-slate-100">
          <thead className="bg-slate-50 font-bold text-slate-700">
            <tr>
              <th className="px-4 py-2">Tanggal Order</th>
              <th className="px-4 py-2">Supplier</th>
              <th className="px-4 py-2">Bahan Baku</th>
              <th className="px-4 py-2">Jumlah</th>
              <th className="px-4 py-2">Satuan</th>
              <th className="px-4 py-2">Status Pengiriman</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-655">
            {orders.map((o) => (
              <tr key={o.orderId} className="hover:bg-slate-50/20">
                <td className="px-4 py-2.5 font-mono">{o.orderDate}</td>
                <td className="px-4 py-2 font-semibold text-slate-900">{o.supplierName}</td>
                <td className="px-4 py-2">{o.material?.materialName}</td>
                <td className="px-4 py-2 font-mono">{Number(o.orderQuantity).toFixed(2)}</td>
                <td className="px-4 py-2 font-medium text-slate-500">{o.unit}</td>
                <td className="px-4 py-2">
                  <span className="font-semibold text-slate-800">{o.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Report 4: Production & Distributions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Laporan 4: Distribusi & Produksi Makanan ke Sekolah</h4>
        <table className="min-w-full text-left text-xs divide-y divide-slate-100">
          <thead className="bg-slate-50 font-bold text-slate-700">
            <tr>
              <th className="px-4 py-2">Tanggal Proses</th>
              <th className="px-4 py-2">Sekolah Penerima</th>
              <th className="px-4 py-2">Jumlah Porsi</th>
              <th className="px-4 py-2">Status Produksi</th>
              <th className="px-4 py-2">Status Distribusi</th>
              <th className="px-4 py-2">Catatan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-655">
            {distributions.map((d) => (
              <tr key={d.processId} className="hover:bg-slate-50/20">
                <td className="px-4 py-2.5 font-mono">{d.processDate.split("T")[0]}</td>
                <td className="px-4 py-2 font-semibold text-slate-900">{d.school?.schoolName || `Sekolah #${d.schoolId}`}</td>
                <td className="px-4 py-2 font-mono">{d.portionCount} porsi</td>
                <td className="px-4 py-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    d.productionStatus === "Belum Diproses"
                      ? "bg-slate-100 text-slate-600 border-slate-200"
                      : d.productionStatus === "Diproses"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}>
                    {d.productionStatus}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    d.distributionStatus === "Belum Dikirim"
                      ? "bg-slate-100 text-slate-650 border-slate-200"
                      : d.distributionStatus === "Dikirim"
                      ? "bg-sky-50 text-sky-700 border-sky-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}>
                    {d.distributionStatus}
                  </span>
                </td>
                <td className="px-4 py-2">{d.notes || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
