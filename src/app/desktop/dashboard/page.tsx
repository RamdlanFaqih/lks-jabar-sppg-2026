"use client";

import { useEffect, useState } from "react";

interface Employee { employeeId: number; }
interface RawMaterial { materialId: number; }
interface School { schoolId: number; }
interface SupplierOrder { orderId: number; status: string; }
interface ProductionDistribution { processId: number; distributionStatus: string; }

export default function DashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [distributions, setDistributions] = useState<ProductionDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resEmp, resMat, resSch, resOrd, resDist] = await Promise.all([
          fetch("/api/employees"),
          fetch("/api/materials"),
          fetch("/api/schools"),
          fetch("/api/orders"),
          fetch("/api/production-distribution"),
        ]);

        if (resEmp.ok) setEmployees(await resEmp.json());
        if (resMat.ok) setMaterials(await resMat.json());
        if (resSch.ok) setSchools(await resSch.json());
        if (resOrd.ok) setOrders(await resOrd.json());
        if (resDist.ok) setDistributions(await resDist.json());
      } catch (error) {
        console.error(error);
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
        <p className="text-xs text-slate-500 font-mono">Sinkronisasi ringkasan dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metric Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450">Total Pegawai</span>
          <p className="text-2xl font-black text-slate-950 font-mono">{employees.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450">Jenis Bahan Baku</span>
          <p className="text-2xl font-black text-slate-950 font-mono">{materials.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450">Sekolah Penerima</span>
          <p className="text-2xl font-black text-slate-950 font-mono">{schools.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450">Pesanan Aktif</span>
          <p className="text-2xl font-black text-slate-950 font-mono">
            {orders.filter((o) => o.status !== "Selesai").length}
          </p>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Fulfillment Pemasok</h4>
          <div className="space-y-3.5 pt-1">
            {["Pending", "Diproses", "Dikirim", "Selesai"].map((st) => {
              const count = orders.filter((o) => o.status === st).length;
              const pct = orders.length ? (count / orders.length) * 100 : 0;
              return (
                <div key={st} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">{st} ({count})</span>
                    <span className="text-slate-800 font-mono">{pct.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full ${st === "Pending" ? "bg-amber-400" : st === "Diproses" ? "bg-sky-400" : st === "Dikirim" ? "bg-indigo-400" : "bg-emerald-400"
                        }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Alur Distribusi Gizi</h4>
          <div className="space-y-3.5 pt-1">
            {["Belum Dikirim", "Dikirim", "Selesai"].map((ds) => {
              const count = distributions.filter((d) => d.distributionStatus === ds).length;
              const pct = distributions.length ? (count / distributions.length) * 100 : 0;
              return (
                <div key={ds} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-650">{ds} ({count})</span>
                    <span className="text-slate-800 font-mono">{pct.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full ${ds === "Belum Dikirim" ? "bg-slate-300" : ds === "Dikirim" ? "bg-sky-400" : "bg-emerald-400"}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
