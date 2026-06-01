# 📘 SQL Server CRUD Guide (LKS SMK Jabar 2026 - ITSSFB)

Dokumen ini berisi panduan lengkap *Transact-SQL (T-SQL)* untuk seluruh operasi **CRUD (Create, Read, Update, Delete)** dan query **Laporan** sesuai dengan kebutuhan modul Desktop pada **Smart Meal Distribution System** (LKS SMK Jawa Barat 2026). 

Untuk mempermudah pembelajaran dalam perlombaan, semua query di bawah ini ditulis spesifik untuk **Microsoft SQL Server** (menggunakan tipe data standard, penanganan parameter, dan query relasional dengan `INNER JOIN`).

---

## 🔑 1. Modul Autentikasi (Users)

Tabel `Users` menyimpan data login pengguna dengan role `PetugasSPPG` atau `SupervisorSPPG` (dan `Pemasok` untuk visualisasi mobile).

### 🔍 A. Read (Login Validation)
Mencocokkan *username* dan *password* untuk verifikasi kredensial serta mendapatkan informasi *role* dan hak akses.
```sql
SELECT UserId, Username, FullName, Role, Position 
FROM Users 
WHERE Username = @Username AND Password = @Password;
```
> [!NOTE]
> Parameter `@Username` dan `@Password` dilewatkan secara aman melalui objek Command Parameter di sisi aplikasi desktop (misal: `SqlCommand.Parameters.AddWithValue`).

---

## 👥 2. Modul Data Pegawai (Employees)

Mengelola informasi staf yang bekerja di SPPG (koki, petugas gudang, kurir, dll.).

### ➕ A. Create (Insert Employee)
```sql
INSERT INTO Employees (EmployeeName, Position, Phone, Address)
VALUES (@EmployeeName, @Position, @Phone, @Address);
-- Mendapatkan ID yang baru saja digenerate
SELECT SCOPE_IDENTITY() AS NewEmployeeId;
```

### 🔍 B. Read (Select All & Search)
*   **Mengambil semua data pegawai:**
    ```sql
    SELECT EmployeeId, EmployeeName, Position, Phone, Address 
    FROM Employees 
    ORDER BY EmployeeName ASC;
    ```
*   **Pencarian data pegawai berdasarkan Nama atau Jabatan:**
    ```sql
    SELECT EmployeeId, EmployeeName, Position, Phone, Address 
    FROM Employees 
    WHERE EmployeeName LIKE @SearchQuery OR Position LIKE @SearchQuery
    ORDER BY EmployeeName ASC;
    ```
    *(Parameter `@SearchQuery` dikirimkan dengan format `"%value%"` dari aplikasi)*

### ✏️ C. Update (Ubah Data Pegawai)
```sql
UPDATE Employees 
SET EmployeeName = @EmployeeName,
    Position = @Position,
    Phone = @Phone,
    Address = @Address
WHERE EmployeeId = @EmployeeId;
```

### ❌ D. Delete (Hapus Pegawai)
```sql
DELETE FROM Employees 
WHERE EmployeeId = @EmployeeId;
```

---

## 📦 3. Modul Data Bahan Baku (RawMaterials)

Mengelola inventori bahan baku masakan di gudang SPPG.

### ➕ A. Create (Insert Raw Material)
```sql
INSERT INTO RawMaterials (MaterialName, Category, Unit, Stock, EstimatedPrice)
VALUES (@MaterialName, @Category, @Unit, @Stock, @EstimatedPrice);
```

### 🔍 B. Read (Select & Filter)
*   **Mengambil semua bahan baku:**
    ```sql
    SELECT MaterialId, MaterialName, Category, Unit, Stock, EstimatedPrice 
    FROM RawMaterials 
    ORDER BY MaterialName ASC;
    ```
*   **Filter berdasarkan Kategori & Pencarian Kata Kunci:**
    ```sql
    SELECT MaterialId, MaterialName, Category, Unit, Stock, EstimatedPrice 
    FROM RawMaterials 
    WHERE Category = @Category AND (MaterialName LIKE @SearchQuery)
    ORDER BY MaterialName ASC;
    ```

### ✏️ C. Update (Ubah Bahan Baku / Update Stok & Harga)
```sql
UPDATE RawMaterials 
SET MaterialName = @MaterialName,
    Category = @Category,
    Unit = @Unit,
    Stock = @Stock,
    EstimatedPrice = @EstimatedPrice
WHERE MaterialId = @MaterialId;
```

### ❌ D. Delete (Hapus Bahan Baku)
```sql
DELETE FROM RawMaterials 
WHERE MaterialId = @MaterialId;
```

---

## 🏫 4. Modul Sekolah Penerima (Schools)

Mengelola sekolah penerima paket makan siang gratis SPPG.

### ➕ A. Create (Insert School)
```sql
INSERT INTO Schools (SchoolName, Address, PICName, PICPhone, StudentCount)
VALUES (@SchoolName, @Address, @PICName, @PICPhone, @StudentCount);
```

### 🔍 B. Read (Select All & Search)
```sql
-- Mengambil semua sekolah
SELECT SchoolId, SchoolName, Address, PICName, PICPhone, StudentCount 
FROM Schools 
ORDER BY SchoolName ASC;

-- Pencarian berdasarkan Nama Sekolah atau Alamat
SELECT SchoolId, SchoolName, Address, PICName, PICPhone, StudentCount 
FROM Schools 
WHERE SchoolName LIKE @SearchQuery OR Address LIKE @SearchQuery
ORDER BY SchoolName ASC;
```

### ✏️ C. Update (Ubah Data Sekolah)
```sql
UPDATE Schools 
SET SchoolName = @SchoolName,
    Address = @Address,
    PICName = @PICName,
    PICPhone = @PICPhone,
    StudentCount = @StudentCount
WHERE SchoolId = @SchoolId;
```

### ❌ D. Delete (Hapus Sekolah)
```sql
DELETE FROM Schools 
WHERE SchoolId = @SchoolId;
```

---

## 🍳 5. Modul Kebutuhan Dapur Harian (KitchenNeeds)

Mencatat kebutuhan harian bahan baku dapur SPPG berdasarkan menu hari tersebut.

### ➕ A. Create (Insert Kitchen Need)
```sql
INSERT INTO KitchenNeeds (NeedDate, MaterialId, Quantity, Unit, Notes)
VALUES (@NeedDate, @MaterialId, @Quantity, @Unit, @Notes);
```

### 🔍 B. Read (Relational Select with INNER JOIN)
Menampilkan data kebutuhan dapur lengkap dengan nama bahan baku relasional.
```sql
SELECT 
    k.NeedId,
    k.NeedDate,
    k.MaterialId,
    m.MaterialName,
    m.Category AS MaterialCategory,
    k.Quantity,
    k.Unit,
    k.Notes
FROM KitchenNeeds k
INNER JOIN RawMaterials m ON k.MaterialId = m.MaterialId
ORDER BY k.NeedDate DESC, m.MaterialName ASC;
```

### ✏️ C. Update (Ubah Kebutuhan Dapur)
```sql
UPDATE KitchenNeeds 
SET NeedDate = @NeedDate,
    MaterialId = @MaterialId,
    Quantity = @Quantity,
    Unit = @Unit,
    Notes = @Notes
WHERE NeedId = @NeedId;
```

### ❌ D. Delete (Hapus Data Kebutuhan)
```sql
DELETE FROM KitchenNeeds 
WHERE NeedId = @NeedId;
```

---

## 🚚 6. Modul Pesanan ke Pemasok (SupplierOrders)

Mengelola pemesanan bahan baku tambahan dari pemasok luar.

### ➕ A. Create (Insert Supplier Order)
Secara default status diset sebagai `'Pending'`.
```sql
INSERT INTO SupplierOrders (OrderDate, SupplierName, MaterialId, OrderQuantity, Unit, Status, Notes)
VALUES (@OrderDate, @SupplierName, @MaterialId, @OrderQuantity, @Unit, 'Pending', @Notes);
```

### 🔍 B. Read (Relational Select with INNER JOIN)
```sql
SELECT 
    o.OrderId,
    o.OrderDate,
    o.SupplierName,
    o.MaterialId,
    m.MaterialName,
    o.OrderQuantity,
    o.Unit,
    o.Status,
    o.Notes
FROM SupplierOrders o
INNER JOIN RawMaterials m ON o.MaterialId = m.MaterialId
ORDER BY o.OrderDate DESC, o.OrderId DESC;
```

### ✏️ C. Update (Ubah Pesanan & Update Status)
*   **Ubah Detail Pesanan (Untuk Petugas SPPG):**
    ```sql
    UPDATE SupplierOrders 
    SET OrderDate = @OrderDate,
        SupplierName = @SupplierName,
        MaterialId = @MaterialId,
        OrderQuantity = @OrderQuantity,
        Unit = @Unit,
        Notes = @Notes
    WHERE OrderId = @OrderId;
    ```
*   **Ubah Status Pengiriman (Digunakan oleh Pemasok Mobile/Desktop):**
    ```sql
    UPDATE SupplierOrders 
    SET Status = @Status -- Status: 'Pending', 'Diproses', 'Dikirim', 'Selesai'
    WHERE OrderId = @OrderId;
    ```
> [!IMPORTANT]
> Saat status pesanan berubah menjadi `'Selesai'`, aplikasi desktop biasanya harus secara otomatis menambah jumlah stok bahan baku terkait:
> ```sql
> UPDATE RawMaterials 
> SET Stock = Stock + @OrderQuantity 
> WHERE MaterialId = @MaterialId;
> ```

### ❌ D. Delete (Hapus Pesanan)
```sql
DELETE FROM SupplierOrders 
WHERE OrderId = @OrderId;
```

---

## 🍳 7. Monitoring Produksi & Distribusi (ProductionDistribution)

Memantau porsi makan siang sekolah yang dimasak (produksi) dan diantarkan (distribusi).

### ➕ A. Create (Insert Production Record)
```sql
INSERT INTO ProductionDistribution (ProcessDate, SchoolId, PortionCount, ProductionStatus, DistributionStatus, Notes)
VALUES (@ProcessDate, @SchoolId, @PortionCount, 'Belum Diproses', 'Belum Dikirim', @Notes);
```

### 🔍 B. Read (Relational Select with INNER JOIN)
```sql
SELECT 
    p.ProcessId,
    p.ProcessDate,
    p.SchoolId,
    s.SchoolName,
    s.StudentCount AS TargetPortions,
    p.PortionCount AS RealizedPortions,
    p.ProductionStatus,
    p.DistributionStatus,
    p.Notes
FROM ProductionDistribution p
INNER JOIN Schools s ON p.SchoolId = s.SchoolId
ORDER BY p.ProcessDate DESC, s.SchoolName ASC;
```

### ✏️ C. Update (Ubah Detail & Validasi Status)
*   **Ubah Detail Distribusi:**
    ```sql
    UPDATE ProductionDistribution 
    SET ProcessDate = @ProcessDate,
        SchoolId = @SchoolId,
        PortionCount = @PortionCount,
        Notes = @Notes
    WHERE ProcessId = @ProcessId;
    ```
*   **Validasi Status Produksi & Distribusi (Oleh SupervisorSPPG):**
    ```sql
    UPDATE ProductionDistribution 
    SET ProductionStatus = @ProductionStatus,      -- 'Belum Diproses', 'Diproses', 'Selesai'
        DistributionStatus = @DistributionStatus,  -- 'Belum Dikirim', 'Dikirim', 'Selesai'
        Notes = @Notes
    WHERE ProcessId = @ProcessId;
    ```

### ❌ D. Delete (Hapus Record)
```sql
DELETE FROM ProductionDistribution 
WHERE ProcessId = @ProcessId;
```

---

## 📊 8. Query Laporan (Hari ke-1)

Berikut adalah query analitik agregasi tingkat lanjut untuk menyusun 4 jenis Laporan yang biasa diminta dalam soal LKS:

### 📑 Laporan 1: Laporan Stok Bahan Baku & Estimasi Biaya
Menampilkan informasi sisa stok bahan baku dan estimasi nilai total inventori (Sisa Stok × Harga Perkiraan).
```sql
SELECT 
    MaterialId,
    MaterialName,
    Category,
    Stock AS SisaStok,
    Unit AS Satuan,
    EstimatedPrice AS HargaSatuan,
    (Stock * EstimatedPrice) AS EstimasiNilaiTotal
FROM RawMaterials
WHERE Stock > 0
ORDER BY Category ASC, MaterialName ASC;
```

### 📑 Laporan 2: Laporan Penggunaan Bahan Baku Dapur Harian
Menghitung akumulasi total bahan baku yang digunakan pada rentang waktu tertentu beserta kalkulasi pengeluaran biaya denda/kebutuhan.
```sql
SELECT 
    k.NeedDate AS TanggalKebutuhan,
    m.MaterialName AS NamaBahanBaku,
    SUM(k.Quantity) AS TotalKebutuhan,
    k.Unit AS Satuan,
    m.EstimatedPrice AS HargaSatuan,
    SUM(k.Quantity * m.EstimatedPrice) AS EstimasiBiayaPengeluaran
FROM KitchenNeeds k
INNER JOIN RawMaterials m ON k.MaterialId = m.MaterialId
WHERE k.NeedDate BETWEEN @StartDate AND @EndDate
GROUP BY k.NeedDate, m.MaterialName, k.Unit, m.EstimatedPrice
ORDER BY k.NeedDate DESC, NamaBahanBaku ASC;
```

### 📑 Laporan 3: Rekapitulasi Pesanan Bahan Baku Ke Pemasok
Menyajikan statistik total pesanan per pemasok yang dikelompokkan berdasarkan status pengiriman untuk menilai performa distributor.
```sql
SELECT 
    SupplierName AS NamaPemasok,
    Status,
    COUNT(OrderId) AS JumlahTransaksi,
    SUM(OrderQuantity) AS TotalKuantitasDipesan
FROM SupplierOrders
GROUP BY SupplierName, Status
ORDER BY SupplierName ASC, Status ASC;
```

### 📑 Laporan 4: Laporan Distribusi Makan Siang Sekolah
Menampilkan rekapitulasi realisasi pengiriman porsi makan siang ke sekolah serta selisih porsi jika ada ketidakcocokan jumlah siswa.
```sql
SELECT 
    p.ProcessDate AS TanggalPengiriman,
    s.SchoolName AS NamaSekolah,
    s.StudentCount AS JumlahTargetSiswa,
    p.PortionCount AS RealisasiPortiTerkirim,
    (p.PortionCount - s.StudentCount) AS SelisihPorsi,
    p.ProductionStatus AS StatusProduksi,
    p.DistributionStatus AS StatusDistribusi,
    p.Notes AS CatatanLogistik
FROM ProductionDistribution p
INNER JOIN Schools s ON p.SchoolId = s.SchoolId
WHERE p.ProcessDate = @TargetDate
ORDER BY s.SchoolName ASC;
```

---

## 💻 9. Implementasi Koneksi Database di C# (ADO.NET)
Untuk menyambungkan database ke aplikasi Desktop (misalnya **C# Windows Forms / WPF**), berikut contoh *best-practice* penggunaan kelas `SqlConnection` dan `SqlCommand`:

```csharp
using System;
using System.Data;
using Microsoft.Data.SqlClient; // Atau System.Data.SqlClient

public class DatabaseHelper
{
    private string connectionString = "Server=localhost\\SQLEXPRESS;Database=SmartMealDistributionDB;Trusted_Connection=True;TrustServerCertificate=True;";

    // Contoh Fungsi Create/Insert Data Pegawai
    public bool InsertEmployee(string name, string position, string phone, string address)
    {
        string query = "INSERT INTO Employees (EmployeeName, Position, Phone, Address) VALUES (@Name, @Position, @Phone, @Address)";
        
        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                // Mencegah SQL Injection dengan Parameterized Query
                cmd.Parameters.Add("@Name", SqlDbType.VarChar).Value = name;
                cmd.Parameters.Add("@Position", SqlDbType.VarChar).Value = position;
                cmd.Parameters.Add("@Phone", SqlDbType.VarChar).Value = (object)phone ?? DBNull.Value;
                cmd.Parameters.Add("@Address", SqlDbType.VarChar).Value = (object)address ?? DBNull.Value;

                try
                {
                    conn.Open();
                    int rows = cmd.ExecuteNonQuery();
                    return rows > 0;
                }
                catch (SqlException ex)
                {
                    Console.WriteLine("Error: " + ex.Message);
                    return false;
                }
            }
        }
    }

    // Contoh Fungsi Read Data ke DataTable (Untuk diikat ke DataGridView)
    public DataTable GetEmployeesList(string search = "")
    {
        DataTable dt = new DataTable();
        string query = "SELECT EmployeeId, EmployeeName, Position, Phone, Address FROM Employees";
        
        if (!string.IsNullOrEmpty(search))
        {
            query += " WHERE EmployeeName LIKE @Search OR Position LIKE @Search";
        }
        
        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                if (!string.IsNullOrEmpty(search))
                {
                    cmd.Parameters.AddWithValue("@Search", "%" + search + "%");
                }
                
                using (SqlDataAdapter adapter = new SqlDataAdapter(cmd))
                {
                    adapter.Fill(dt);
                }
            }
        }
        return dt;
    }
}
```

---
*Gunakan panduan query di atas sebagai acuan utama saat merancang query aksi pada kontrol UI desktop seperti Button Add, Edit, Delete, dan form print laporan.*
