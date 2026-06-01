# 📘 SQL CRUD Guide (LKS SMK Jabar 2026 - ITSSFB)

Dokumen ini berisi panduan lengkap **SQL Statement (ANSI SQL)** untuk seluruh operasi **CRUD (Create, Read, Update, Delete)** dan query **Laporan** sesuai dengan kebutuhan modul Desktop pada **Smart Meal Distribution System** (LKS SMK Jawa Barat 2026).

Semua query di bawah menggunakan sintaks **SQL standar (ANSI SQL)** yang global dan kompatibel dengan berbagai RDBMS seperti **SQL Server, PostgreSQL, MySQL, SQLite, dsb.**

---

## 🔑 1. Modul Autentikasi (Users)

Tabel `Users` menyimpan data kredensial login pengguna dengan role `PetugasSPPG` atau `SupervisorSPPG` (dan `Pemasok`).

### 🔍 Read (Login Validation)
Mencocokkan username dan password untuk verifikasi masuk.
```sql
SELECT UserId, Username, FullName, Role, Position 
FROM Users 
WHERE Username = @Username AND Password = @Password;
```

---

## 👥 2. Modul Data Pegawai (Employees)

Mengelola informasi staf yang bekerja di SPPG (koki, petugas gudang, kurir, dll.).

### ➕ Create (Insert Employee)
```sql
INSERT INTO Employees (EmployeeName, Position, Phone, Address)
VALUES (@EmployeeName, @Position, @Phone, @Address);
```

### 🔍 Read (Select All & Search)
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
    *(Keterangan: `@SearchQuery` dilewatkan dengan format `'%keyword%'`)*

### ✏️ Update (Ubah Data Pegawai)
```sql
UPDATE Employees 
SET EmployeeName = @EmployeeName,
    Position = @Position,
    Phone = @Phone,
    Address = @Address
WHERE EmployeeId = @EmployeeId;
```

### ❌ Delete (Hapus Pegawai)
```sql
DELETE FROM Employees 
WHERE EmployeeId = @EmployeeId;
```

---

## 📦 3. Modul Data Bahan Baku (RawMaterials)

Mengelola inventori bahan baku makanan di gudang SPPG.

### ➕ Create (Insert Raw Material)
```sql
INSERT INTO RawMaterials (MaterialName, Category, Unit, Stock, EstimatedPrice)
VALUES (@MaterialName, @Category, @Unit, @Stock, @EstimatedPrice);
```

### 🔍 Read (Select & Filter)
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
    WHERE Category = @Category AND MaterialName LIKE @SearchQuery
    ORDER BY MaterialName ASC;
    ```

### ✏️ Update (Ubah Bahan Baku)
```sql
UPDATE RawMaterials 
SET MaterialName = @MaterialName,
    Category = @Category,
    Unit = @Unit,
    Stock = @Stock,
    EstimatedPrice = @EstimatedPrice
WHERE MaterialId = @MaterialId;
```

### ❌ Delete (Hapus Bahan Baku)
```sql
DELETE FROM RawMaterials 
WHERE MaterialId = @MaterialId;
```

---

## 🏫 4. Modul Sekolah Penerima (Schools)

Mengelola sekolah penerima paket makan siang gratis SPPG.

### ➕ Create (Insert School)
```sql
INSERT INTO Schools (SchoolName, Address, PICName, PICPhone, StudentCount)
VALUES (@SchoolName, @Address, @PICName, @PICPhone, @StudentCount);
```

### 🔍 Read (Select All & Search)
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

### ✏️ Update (Ubah Data Sekolah)
```sql
UPDATE Schools 
SET SchoolName = @SchoolName,
    Address = @Address,
    PICName = @PICName,
    PICPhone = @PICPhone,
    StudentCount = @StudentCount
WHERE SchoolId = @SchoolId;
```

### ❌ Delete (Hapus Sekolah)
```sql
DELETE FROM Schools 
WHERE SchoolId = @SchoolId;
```

---

## 🍳 5. Modul Kebutuhan Dapur Harian (KitchenNeeds)

Mencatat kebutuhan harian bahan baku dapur SPPG berdasarkan menu hari tersebut.

### ➕ Create (Insert Kitchen Need)
```sql
INSERT INTO KitchenNeeds (NeedDate, MaterialId, Quantity, Unit, Notes)
VALUES (@NeedDate, @MaterialId, @Quantity, @Unit, @Notes);
```

### 🔍 Read (Relational Select with INNER JOIN)
Menampilkan data kebutuhan dapur lengkap dengan nama bahan baku yang terelasi.
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

### ✏️ Update (Ubah Kebutuhan Dapur)
```sql
UPDATE KitchenNeeds 
SET NeedDate = @NeedDate,
    MaterialId = @MaterialId,
    Quantity = @Quantity,
    Unit = @Unit,
    Notes = @Notes
WHERE NeedId = @NeedId;
```

### ❌ Delete (Hapus Data Kebutuhan)
```sql
DELETE FROM KitchenNeeds 
WHERE NeedId = @NeedId;
```

---

## 🚚 6. Modul Pesanan ke Pemasok (SupplierOrders)

Mengelola pemesanan bahan baku tambahan dari pemasok luar.

### ➕ Create (Insert Supplier Order)
```sql
INSERT INTO SupplierOrders (OrderDate, SupplierName, MaterialId, OrderQuantity, Unit, Status, Notes)
VALUES (@OrderDate, @SupplierName, @MaterialId, @OrderQuantity, @Unit, 'Pending', @Notes);
```

### 🔍 Read (Relational Select with INNER JOIN)
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

### ✏️ Update (Ubah Pesanan & Update Status)
*   **Ubah Detail Pesanan:**
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
*   **Ubah Status Pengiriman saja:**
    ```sql
    UPDATE SupplierOrders 
    SET Status = @Status -- Pilihan status: 'Pending', 'Diproses', 'Dikirim', 'Selesai'
    WHERE OrderId = @OrderId;
    ```
*   **Menambah Stok Bahan Baku (Dijalankan otomatis saat Status Pesanan diset 'Selesai'):**
    ```sql
    UPDATE RawMaterials 
    SET Stock = Stock + @OrderQuantity 
    WHERE MaterialId = @MaterialId;
    ```

### ❌ Delete (Hapus Pesanan)
```sql
DELETE FROM SupplierOrders 
WHERE OrderId = @OrderId;
```

---

## 🍳 7. Monitoring Produksi & Distribusi (ProductionDistribution)

Memantau porsi makan siang sekolah yang dimasak (produksi) dan diantarkan (distribusi).

### ➕ Create (Insert Production Record)
```sql
INSERT INTO ProductionDistribution (ProcessDate, SchoolId, PortionCount, ProductionStatus, DistributionStatus, Notes)
VALUES (@ProcessDate, @SchoolId, @PortionCount, 'Belum Diproses', 'Belum Dikirim', @Notes);
```

### 🔍 Read (Relational Select with INNER JOIN)
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

### ✏️ Update (Ubah Detail & Validasi Status)
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

### ❌ Delete (Hapus Record)
```sql
DELETE FROM ProductionDistribution 
WHERE ProcessId = @ProcessId;
```

---

## 📊 8. Query Laporan (Hari ke-1)

Query analitik untuk menyusun 4 jenis Laporan utama:

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
