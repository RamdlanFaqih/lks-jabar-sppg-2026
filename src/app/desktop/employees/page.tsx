"use client";

import { useEffect, useState } from "react";

interface Employee {
  employeeId: number;
  employeeName: string;
  position: string;
  phone: string;
  address: string;
}

export default function EmployeesPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [editId, setEditId] = useState<number | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [pos, setPos] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/employees");
      if (res.ok) setEmployees(await res.json());
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
    setName(""); setPos(""); setPhone(""); setAddress("");
    setShowModal(true);
  };

  const handleOpenEdit = (e: Employee) => {
    setModalType("edit");
    setEditId(e.employeeId);
    setName(e.employeeName);
    setPos(e.position);
    setPhone(e.phone);
    setAddress(e.address);
    setShowModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = modalType === "add" ? "/api/employees" : `/api/employees/${editId}`;
    const method = modalType === "add" ? "POST" : "PATCH";
    const bodyData = { employeeName: name, position: pos, phone, address };

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
    if (!confirm("Apakah Anda yakin ingin menghapus data pegawai ini?")) return;
    try {
      const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
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

  const filtered = employees.filter((e) =>
    e.employeeName.toLowerCase().includes(search.toLowerCase()) ||
    e.position.toLowerCase().includes(search.toLowerCase())
  );

  const isPetugas = currentUser?.role === "PetugasSPPG";

  if (loading) {
    return (
      <div className="py-20 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-3 shadow-sm">
        <div className="animate-spin h-7 w-7 text-slate-450 border-2 border-slate-200 border-t-slate-500 rounded-full" />
        <p className="text-xs text-slate-550 font-mono">Sinkronisasi data pegawai...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center border-b border-slate-50 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-950">Data Pegawai SPPG</h3>
          <p className="text-xs text-slate-455">Kelola dan lihat daftar staf dapur & logistik</p>
        </div>
        {isPetugas && (
          <button
            onClick={handleOpenAdd}
            className="bg-sppg hover:bg-sppg-dark text-slate-850 px-4 py-2 rounded-xl text-xs font-bold border border-sppg/40 transition shadow-sm cursor-pointer"
          >
            + Tambah Pegawai
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="Cari berdasarkan nama atau jabatan..."
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
              <th className="px-4 py-3">Nama Pegawai</th>
              <th className="px-4 py-3">Jabatan</th>
              <th className="px-4 py-3">Nomor HP</th>
              <th className="px-4 py-3">Alamat</th>
              {isPetugas && <th className="px-4 py-3 text-right">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-650">
            {filtered.map((e) => (
              <tr key={e.employeeId} className="hover:bg-slate-50/50">
                <td className="px-4 py-3 font-mono text-xs">{e.employeeId}</td>
                <td className="px-4 py-3 font-semibold text-slate-900">{e.employeeName}</td>
                <td className="px-4 py-3">{e.position}</td>
                <td className="px-4 py-3">{e.phone}</td>
                <td className="px-4 py-3 max-w-xs truncate">{e.address}</td>
                {isPetugas && (
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(e)}
                      className="text-indigo-600 hover:underline text-xs cursor-pointer font-bold"
                    >
                      Ubah
                    </button>
                    <button
                      onClick={() => handleDelete(e.employeeId)}
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
                {modalType === "add" ? "Tambah Data Pegawai" : "Ubah Data Pegawai"}
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
                <label className="text-xs font-bold text-slate-500">Nama Pegawai</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-sppg-dark focus:ring-1 focus:ring-sppg"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Jabatan</label>
                <input
                  type="text"
                  required
                  value={pos}
                  onChange={(e) => setPos(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-sppg-dark focus:ring-1 focus:ring-sppg"
                  placeholder="e.g. Staf Dapur, Supervisor"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Nomor HP</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-sppg-dark focus:ring-1 focus:ring-sppg"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Alamat</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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
