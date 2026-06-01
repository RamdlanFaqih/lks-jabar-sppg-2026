"use client";

import { useEffect, useState } from "react";

interface RawMaterial {
  materialId: number;
  materialName: string;
  unit: string;
}

interface KitchenNeed {
  needId: number;
  needDate: string;
  materialId: number;
  quantity: number;
  unit: string;
  notes: string | null;
  material?: RawMaterial;
}

export default function KitchenNeedsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [needs, setNeeds] = useState<KitchenNeed[]>([]);
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [editId, setEditId] = useState<number | null>(null);

  // Form Fields
  const [needDate, setNeedDate] = useState("");
  const [materialId, setMaterialId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resNeeds, resMats] = await Promise.all([
        fetch("/api/kitchen-needs"),
        fetch("/api/materials"),
      ]);

      if (resNeeds.ok) setNeeds(await resNeeds.json());
      if (resMats.ok) setMaterials(await resMats.json());
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
    setNeedDate(new Date().toISOString().split("T")[0]);
    setMaterialId(materials[0]?.materialId ? String(materials[0].materialId) : "");
    setQuantity("");
    setNotes("");
    setShowModal(true);
  };

  const handleOpenEdit = (n: KitchenNeed) => {
    setModalType("edit");
    setEditId(n.needId);
    setNeedDate(n.needDate.split("T")[0]);
    setMaterialId(String(n.materialId));
    setQuantity(String(n.quantity));
    setNotes(n.notes || "");
    setShowModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = modalType === "add" ? "/api/kitchen-needs" : `/api/kitchen-needs/${editId}`;
    const method = modalType === "add" ? "POST" : "PATCH";
    const bodyData = { needDate, materialId: Number(materialId), quantity: Number(quantity), notes };

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
    if (!confirm("Apakah Anda yakin ingin menghapus data kebutuhan dapur ini?")) return;
    try {
      const res = await fetch(`/api/kitchen-needs/${id}`, { method: "DELETE" });
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

  const filtered = needs.filter((n) => {
    const matNameStr = n.material?.materialName || "";
    const dateStr = n.needDate.split("T")[0];
    const query = search.toLowerCase();
    return matNameStr.toLowerCase().includes(query) || dateStr.includes(query);
  });

  const isPetugas = currentUser?.role === "PetugasSPPG";

  if (loading) {
    return (
      <div className="py-20 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-3 shadow-sm">
        <div className="animate-spin h-7 w-7 text-slate-455 border-2 border-slate-200 border-t-slate-500 rounded-full" />
        <p className="text-xs text-slate-550 font-mono">Sinkronisasi data kebutuhan dapur...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center border-b border-slate-50 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-950">Data Kebutuhan Dapur SPPG</h3>
          <p className="text-xs text-slate-455">Pencatatan harian bahan makanan yang dikonsumsi</p>
        </div>
        {isPetugas && (
          <button
            onClick={handleOpenAdd}
            className="bg-sppg hover:bg-sppg-dark text-slate-850 px-4 py-2 rounded-xl text-xs font-bold border border-sppg/40 transition shadow-sm cursor-pointer"
          >
            + Catat Kebutuhan
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="Cari berdasarkan tanggal atau nama bahan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-sppg-dark focus:ring-1 focus:ring-sppg transition"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm divide-y divide-slate-100">
          <thead className="bg-slate-50 font-bold text-slate-700">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Tanggal Kebutuhan</th>
              <th className="px-4 py-3">Nama Bahan</th>
              <th className="px-4 py-3">Kebutuhan</th>
              <th className="px-4 py-3">Satuan</th>
              <th className="px-4 py-3">Catatan / Keterangan</th>
              {isPetugas && <th className="px-4 py-3 text-right">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-655">
            {filtered.map((n) => (
              <tr key={n.needId} className="hover:bg-slate-50/50">
                <td className="px-4 py-3 font-mono text-xs">{n.needId}</td>
                <td className="px-4 py-3 font-mono">{n.needDate.split("T")[0]}</td>
                <td className="px-4 py-3 font-semibold text-slate-900">{n.material?.materialName}</td>
                <td className="px-4 py-3 font-mono">{Number(n.quantity).toFixed(2)}</td>
                <td className="px-4 py-3 font-medium text-slate-500">{n.unit}</td>
                <td className="px-4 py-3">{n.notes || "-"}</td>
                {isPetugas && (
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(n)}
                      className="text-indigo-600 hover:underline text-xs cursor-pointer font-bold"
                    >
                      Ubah
                    </button>
                    <button
                      onClick={() => handleDelete(n.needId)}
                      className="text-rose-600 hover:underline text-xs cursor-pointer font-bold"
                    >
                      Hapus
                    </button>
                  </td>
                )}
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
                {modalType === "add" ? "Tambah Data Kebutuhan" : "Ubah Data Kebutuhan"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer"
              >
                &times; Tutup
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Tanggal Kebutuhan</label>
                <input
                  type="date"
                  required
                  value={needDate}
                  onChange={(e) => setNeedDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3.5 py-2.5 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Bahan Baku</label>
                  <select
                    required
                    value={materialId}
                    onChange={(e) => setMaterialId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3.5 py-2.5 text-sm"
                  >
                    {materials.map((m) => (
                      <option key={m.materialId} value={m.materialId}>
                        {m.materialName} ({m.unit})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Jumlah Pemakaian</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-sppg-dark focus:ring-1 focus:ring-sppg"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Catatan Kebutuhan</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-sppg-dark focus:ring-1 focus:ring-sppg"
                />
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
