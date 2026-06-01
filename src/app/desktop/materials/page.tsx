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

export default function MaterialsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [editId, setEditId] = useState<number | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [stock, setStock] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/materials");
      if (res.ok) setMaterials(await res.json());
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
    setName(""); setCategory(""); setUnit(""); setStock(""); setEstimatedPrice("");
    setShowModal(true);
  };

  const handleOpenEdit = (m: RawMaterial) => {
    setModalType("edit");
    setEditId(m.materialId);
    setName(m.materialName);
    setCategory(m.category);
    setUnit(m.unit);
    setStock(String(m.stock));
    setEstimatedPrice(String(m.estimatedPrice));
    setShowModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = modalType === "add" ? "/api/materials" : `/api/materials/${editId}`;
    const method = modalType === "add" ? "POST" : "PATCH";
    const bodyData = { materialName: name, category, unit, stock: Number(stock), estimatedPrice: Number(estimatedPrice) };

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
    if (!confirm("Apakah Anda yakin ingin menghapus data bahan baku ini?")) return;
    try {
      const res = await fetch(`/api/materials/${id}`, { method: "DELETE" });
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

  const filtered = materials.filter((m) =>
    m.materialName.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  const isPetugas = currentUser?.role === "PetugasSPPG";

  if (loading) {
    return (
      <div className="py-20 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-3 shadow-sm">
        <div className="animate-spin h-7 w-7 text-slate-455 border-2 border-slate-200 border-t-slate-500 rounded-full" />
        <p className="text-xs text-slate-550 font-mono">Sinkronisasi data bahan baku...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center border-b border-slate-50 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-950">Data Bahan Baku Dapur</h3>
          <p className="text-xs text-slate-455">Inventarisasi stok bahan gizi masakan</p>
        </div>
        {isPetugas && (
          <button
            onClick={handleOpenAdd}
            className="bg-sppg hover:bg-sppg-dark text-slate-850 px-4 py-2 rounded-xl text-xs font-bold border border-sppg/40 transition shadow-sm cursor-pointer"
          >
            + Tambah Bahan
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="Cari berdasarkan nama bahan..."
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
              <th className="px-4 py-3">Nama Bahan</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Stok</th>
              <th className="px-4 py-3">Satuan</th>
              <th className="px-4 py-3">Harga Perkiraan</th>
              {isPetugas && <th className="px-4 py-3 text-right">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-655">
            {filtered.map((m) => (
              <tr key={m.materialId} className="hover:bg-slate-50/50">
                <td className="px-4 py-3 font-mono text-xs">{m.materialId}</td>
                <td className="px-4 py-3 font-semibold text-slate-900">{m.materialName}</td>
                <td className="px-4 py-3">{m.category}</td>
                <td className="px-4 py-3 font-mono">{Number(m.stock).toFixed(2)}</td>
                <td className="px-4 py-3 font-medium text-slate-500">{m.unit}</td>
                <td className="px-4 py-3 font-mono">
                  Rp {Number(m.estimatedPrice).toLocaleString()}
                </td>
                {isPetugas && (
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(m)}
                      className="text-indigo-600 hover:underline text-xs cursor-pointer font-bold"
                    >
                      Ubah
                    </button>
                    <button
                      onClick={() => handleDelete(m.materialId)}
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
                {modalType === "add" ? "Tambah Bahan Baku" : "Ubah Bahan Baku"}
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
                <label className="text-xs font-bold text-slate-500">Nama Bahan Baku</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-sppg-dark focus:ring-1 focus:ring-sppg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Kategori</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-sppg-dark focus:ring-1 focus:ring-sppg"
                    placeholder="e.g. Karbohidrat, Protein"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Satuan</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-sppg-dark focus:ring-1 focus:ring-sppg"
                    placeholder="e.g. kg, liter, butir"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Stok Awal</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-sppg-dark focus:ring-1 focus:ring-sppg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Harga Perkiraan (Rp)</label>
                  <input
                    type="number"
                    required
                    value={estimatedPrice}
                    onChange={(e) => setEstimatedPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-sppg-dark focus:ring-1 focus:ring-sppg"
                  />
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
