"use client";

import { useEffect, useState } from "react";

interface School {
  schoolId: number;
  schoolName: string;
  studentCount: number;
}

interface ProductionDistribution {
  processId: number;
  processDate: string;
  schoolId: number;
  portionCount: number;
  productionStatus: string;
  distributionStatus: string;
  notes: string | null;
  school?: School;
}

export default function DistributionsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [distributions, setDistributions] = useState<ProductionDistribution[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [editId, setEditId] = useState<number | null>(null);

  // Form Fields
  const [distDate, setDistDate] = useState("");
  const [distSchId, setDistSchId] = useState("");
  const [distPortions, setDistPortions] = useState("");
  const [distProdStatus, setDistProdStatus] = useState("Belum Diproses");
  const [distStatus, setDistStatus] = useState("Belum Dikirim");
  const [distNotes, setDistNotes] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resDist, resSch] = await Promise.all([
        fetch("/api/production-distribution"),
        fetch("/api/schools"),
      ]);

      if (resDist.ok) setDistributions(await resDist.json());
      if (resSch.ok) setSchools(await resSch.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) setCurrentUser(JSON.parse(userStr));
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setModalType("add");
    setEditId(null);
    setDistDate(new Date().toISOString().split("T")[0]);
    setDistSchId(schools[0]?.schoolId ? String(schools[0].schoolId) : "");
    setDistPortions("");
    setDistProdStatus("Belum Diproses");
    setDistStatus("Belum Dikirim");
    setDistNotes("");
    setShowModal(true);
  };

  const handleOpenEdit = (d: ProductionDistribution) => {
    setModalType("edit");
    setEditId(d.processId);
    setDistDate(d.processDate.split("T")[0]);
    setDistSchId(String(d.schoolId));
    setDistPortions(String(d.portionCount));
    setDistProdStatus(d.productionStatus);
    setDistStatus(d.distributionStatus);
    setDistNotes(d.notes || "");
    setShowModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = modalType === "add" ? "/api/production-distribution" : `/api/production-distribution/${editId}`;
    const method = modalType === "add" ? "POST" : "PATCH";
    const bodyData = {
      processDate: distDate,
      schoolId: Number(distSchId),
      portionCount: Number(distPortions),
      productionStatus: distProdStatus,
      distributionStatus: distStatus,
      notes: distNotes,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        setShowModal(false);
        fetchData();
      } else {
        const err = await res.json();
        alert(`Error: ${err.message}`);
      }
    } catch (error: any) {
      alert(`Koneksi error: ${error.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data monitoring ini?")) return;
    try {
      const res = await fetch(`/api/production-distribution/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
      } else {
        const err = await res.json();
        alert(`Gagal menghapus: ${err.message}`);
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handlePatchStatus = async (id: number, prodSt: string, distSt?: string) => {
    try {
      const res = await fetch(`/api/production-distribution/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productionStatus: prodSt,
          ...(distSt !== undefined && { distributionStatus: distSt }),
        }),
      });
      if (res.ok) fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = distributions.filter((d) => {
    const statusMatch =
      !filterStatus ||
      d.distributionStatus === filterStatus ||
      d.productionStatus === filterStatus;
    const dateMatch = !filterDate || d.processDate.split("T")[0] === filterDate;
    return statusMatch && dateMatch;
  });

  const isPetugas = currentUser?.role === "PetugasSPPG";
  const isSupervisor = currentUser?.role === "SupervisorSPPG";

  if (loading) {
    return (
      <div className="py-20 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-3 shadow-sm">
        <div className="animate-spin h-7 w-7 text-slate-455 border-2 border-slate-200 border-t-slate-500 rounded-full" />
        <p className="text-xs text-slate-550 font-mono">Sinkronisasi data monitoring...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center border-b border-slate-50 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-950">Monitoring Produksi & Distribusi</h3>
          <p className="text-xs text-slate-455">Pelacakan proses memasak koki dan status pengiriman sekolah</p>
        </div>
        {isPetugas && (
          <button
            onClick={handleOpenAdd}
            className="bg-sppg hover:bg-sppg-dark text-slate-850 px-4 py-2 rounded-xl text-xs font-bold border border-sppg/40 transition shadow-sm cursor-pointer"
          >
            + Catat Distribusi
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-150">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Filter Status</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-slate-205 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
          >
            <option value="">Semua Status</option>
            <option value="Belum Diproses">Belum Diproses</option>
            <option value="Diproses">Diproses</option>
            <option value="Belum Dikirim">Belum Dikirim</option>
            <option value="Dikirim">Dikirim/OTW</option>
            <option value="Selesai">Selesai/Terkirim</option>
          </select>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Filter Tanggal</span>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-white border border-slate-205 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
          />
        </div>

        {(filterStatus || filterDate) && (
          <button
            onClick={() => {
              setFilterStatus("");
              setFilterDate("");
            }}
            className="text-xs font-bold text-rose-600 hover:underline mt-4 cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm divide-y divide-slate-100">
          <thead className="bg-slate-50 font-bold text-slate-700">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Sekolah Penerima</th>
              <th className="px-4 py-3">Jumlah Porsi</th>
              <th className="px-4 py-3">Status Produksi</th>
              <th className="px-4 py-3">Status Distribusi</th>
              <th className="px-4 py-3 text-right">Aksi / Validasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-655">
            {filtered.map((d) => (
              <tr key={d.processId} className="hover:bg-slate-50/50">
                <td className="px-4 py-3 font-mono text-xs">{d.processId}</td>
                <td className="px-4 py-3">{d.processDate.split("T")[0]}</td>
                <td className="px-4 py-3 font-semibold text-slate-900">{d.school?.schoolName || `Sekolah #${d.schoolId}`}</td>
                <td className="px-4 py-3 font-mono">{d.portionCount} porsi</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      d.productionStatus === "Belum Diproses"
                        ? "bg-slate-100 text-slate-650 border-slate-200"
                        : d.productionStatus === "Diproses"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    {d.productionStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      d.distributionStatus === "Belum Dikirim"
                        ? "bg-slate-100 text-slate-600 border-slate-200"
                        : d.distributionStatus === "Dikirim"
                        ? "bg-sky-50 text-sky-700 border-sky-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    {d.distributionStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  {/* Supervisor Validation Actions */}
                  {isSupervisor && (
                    <div className="inline-flex gap-1.5">
                      {d.distributionStatus !== "Selesai" && (
                        <button
                          onClick={() => handlePatchStatus(d.processId, "Selesai", "Selesai")}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-1 rounded-lg font-bold cursor-pointer transition"
                        >
                          Selesaikan
                        </button>
                      )}
                      {d.productionStatus !== "Diproses" && d.productionStatus !== "Selesai" && (
                        <button
                          onClick={() => handlePatchStatus(d.processId, "Diproses")}
                          className="bg-sky-50 hover:bg-sky-100 text-sky-750 border border-sky-250 text-xs px-2.5 py-1 rounded-lg font-bold cursor-pointer transition"
                        >
                          Mulai Masak
                        </button>
                      )}
                    </div>
                  )}

                  {/* Petugas normal edit/delete */}
                  {isPetugas && (
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => handleOpenEdit(d)}
                        className="text-indigo-600 hover:underline text-xs cursor-pointer font-bold"
                      >
                        Ubah
                      </button>
                      <button
                        onClick={() => handleDelete(d.processId)}
                        className="text-rose-600 hover:underline text-xs cursor-pointer font-bold"
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Universal CRUD Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider">
                {modalType === "add" ? "Tambah Catatan Distribusi" : "Ubah Catatan Distribusi"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer"
              >
                &times; Tutup
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Tanggal Proses</label>
                  <input
                    type="date"
                    required
                    value={distDate}
                    onChange={(e) => setDistDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Sekolah Penerima</label>
                  <select
                    required
                    value={distSchId}
                    onChange={(e) => setDistSchId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3.5 py-2.5 text-sm"
                  >
                    {schools.map((s) => (
                      <option key={s.schoolId} value={s.schoolId}>
                        {s.schoolName} ({s.studentCount} porsi)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Porsi Didistribusikan</label>
                  <input
                    type="number"
                    required
                    value={distPortions}
                    onChange={(e) => setDistPortions(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Notes Operasional</label>
                  <input
                    type="text"
                    value={distNotes}
                    onChange={(e) => setDistNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-sppg-dark focus:ring-1 focus:ring-sppg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Status Produksi</label>
                  <select
                    value={distProdStatus}
                    onChange={(e) => setDistProdStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3.5 py-2.5 text-sm"
                  >
                    <option value="Belum Diproses">Belum Diproses</option>
                    <option value="Diproses">Diproses</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Status Distribusi</label>
                  <select
                    value={distStatus}
                    onChange={(e) => setDistStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3.5 py-2.5 text-sm"
                  >
                    <option value="Belum Dikirim">Belum Dikirim</option>
                    <option value="Dikirim">Dikirim</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-sppg hover:bg-sppg-dark text-slate-800 font-extrabold py-3.5 rounded-xl text-sm transition border border-sppg/40 shadow-md cursor-pointer"
              >
                Simpan Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
