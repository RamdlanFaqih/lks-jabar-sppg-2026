"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface TableStats {
  tableName: string;
  count: number;
  description: string;
}

export default function HealthPage() {
  const [stats, setStats] = useState<TableStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      
      const [resEmp, resMat, resSch, resNeed, resOrd, resDist] = await Promise.all([
        fetch("/api/employees"),
        fetch("/api/materials"),
        fetch("/api/schools"),
        fetch("/api/kitchen-needs"),
        fetch("/api/orders"),
        fetch("/api/production-distribution"),
      ]);

      if (resEmp.ok && resMat.ok && resSch.ok && resNeed.ok && resOrd.ok && resDist.ok) {
        const emps = await resEmp.json();
        const mats = await resMat.json();
        const schs = await resSch.json();
        const nds = await resNeed.json();
        const ords = await resOrd.json();
        const dsts = await resDist.json();

        setStats([
          { tableName: "Users", count: 3, description: "System credential accounts (petugas, supervisor, supplier)" },
          { tableName: "Employees", count: emps.length, description: "SPPG kitchen cooks, delivery couriers, and staff" },
          { tableName: "RawMaterials", count: mats.length, description: "Inventory ingredients (Rice, Eggs, Chicken, Wortel)" },
          { tableName: "Schools", count: schs.length, description: "Recipient schools with student sizes and PIC info" },
          { tableName: "KitchenNeeds", count: nds.length, description: "Daily kitchen raw material consumption entries" },
          { tableName: "SupplierOrders", count: ords.length, description: "Orders sent to suppliers for raw material replenishment" },
          { tableName: "ProductionDistribution", count: dsts.length, description: "Prepared food distribution tracking to schools" }
        ]);
        setDbConnected(true);
      } else {
        throw new Error("One or more tables failed to load correctly.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Connection failed.");
      setDbConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-sppg/40 selection:text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 bg-sppg rounded-lg flex items-center justify-center font-bold text-slate-850 shadow-md shadow-sppg/30 border border-sppg/40">
            H
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-950 font-sans">SPPG Health Console</h1>
            <p className="text-xs text-slate-500 font-mono">Neon SQL Database Integrity Monitor</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors duration-200"
          >
            &larr; SPPG Home
          </Link>
          <span className="h-4 w-px bg-slate-200" />
          <Link
            href="/docs"
            className="text-sm font-semibold bg-sppg hover:bg-sppg-dark text-slate-800 px-4 py-2 rounded-lg transition-all duration-200 shadow-md shadow-sppg/20 border border-sppg/40 cursor-pointer"
          >
            Explore API Docs &rarr;
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-950 font-sans">Database Integrity & Schema Validation</h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              This dashboard queries all 7 tables generated for the LKS SMK Jabar 2026 Smart Meal Distribution System schema. Verifies connection pools and row counts.
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 shadow-inner">
            <span className="text-xs text-slate-500 font-mono">Neon SQL Connectivity:</span>
            {dbConnected === null ? (
              <span className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold animate-pulse">
                <span>Checking...</span>
              </span>
            ) : dbConnected ? (
              <span className="flex items-center space-x-1.5 text-xs text-emerald-600 font-bold">
                <span>ACTIVE</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1.5 text-xs text-rose-600 font-bold">
                <span>ERROR</span>
              </span>
            )}
          </div>
        </div>

        {/* Database Tables Count list */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 font-sans">Table Row Counts</h3>
            <button
              onClick={fetchStats}
              className="text-xs font-semibold text-slate-500 hover:text-slate-850"
            >
              Refresh Stats
            </button>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-2">
              <div className="animate-spin h-6 w-6 text-slate-400 border-2 border-slate-200 border-t-slate-500 rounded-full" />
              <p className="text-xs text-slate-450 font-mono">Querying table metadata...</p>
            </div>
          ) : errorMessage ? (
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-5 text-center space-y-2">
              <h4 className="text-sm font-semibold text-rose-700">Schema Query Failed</h4>
              <p className="text-xs text-rose-600 max-w-md mx-auto">{errorMessage}</p>
              <div className="pt-2 text-[10px] text-slate-450 font-mono">
                Make sure migrations are fully applied and database is seeded.
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.map((table) => (
                <div key={table.tableName} className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/30 px-2 rounded-lg transition">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-slate-900 font-mono">{table.tableName}</h4>
                    <p className="text-xs text-slate-500">{table.description}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono text-slate-400">Rows:</span>
                    <span className="text-lg font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200/60 font-mono min-w-[50px] text-center">
                      {table.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/40 py-6 px-6 text-center text-xs text-slate-500 shadow-inner">
        <p className="font-mono">
          NeonTask Health Console. Powered by Next.js & Neon SQL Serverless WebSocket Driver.
        </p>
      </footer>
    </div>
  );
}
