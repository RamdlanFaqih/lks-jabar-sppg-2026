# 📘 Database Schema & SQL CRUD Guide (LKS SMK Jabar 2026 - ITSSFB)

Dokumen ini berisi spesifikasi **Rancangan Database Schema** dan **SQL Statement Guide (ANSI SQL)** untuk seluruh operasi **DDL, DML, CRUD,** serta query **Laporan** sesuai dengan modul Desktop pada **Smart Meal Distribution System** (LKS SMK Jawa Barat 2026).

---

## 📂 1. Database Schema Design (MS SQL Server / Windows)

Sistem ini membutuhkan basis data relasional yang terdiri dari 7 tabel utama:

### 1. Table: `Users`
Menyimpan data login pengguna dan role akses.
*   `UserId` (INT, Primary Key, Identity): ID pengguna (auto-increment).
*   `Username` (VARCHAR(50), Unique): Username unik untuk login.
*   `Password` (VARCHAR(50)): Password sederhana berbentuk teks biasa (plain text).
*   `FullName` (VARCHAR(100)): Nama lengkap pengguna.
*   `Role` (VARCHAR(30)): Peran pengguna (`PetugasSPPG` atau `SupervisorSPPG` atau `Pemasok`).
*   `Position` (VARCHAR(50)): Jabatan resmi pengguna.

### 2. Table: `Employees`
Menyimpan informasi staf/pegawai SPPG.
*   `EmployeeId` (INT, Primary Key, Identity): ID pegawai (auto-increment).
*   `EmployeeName` (VARCHAR(100)): Nama lengkap pegawai.
*   `Position` (VARCHAR(50)): Jabatan pegawai (contoh: Staf Dapur, Koki Utama, Kurir).
*   `Phone` (VARCHAR(30)): Nomor HP kontak.
*   `Address` (VARCHAR(200)): Alamat tempat tinggal.

### 3. Table: `RawMaterials`
Inventori bahan baku masakan di gudang SPPG.
*   `MaterialId` (INT, Primary Key, Identity): ID bahan baku (auto-increment).
*   `MaterialName` (VARCHAR(100)): Nama bahan baku (contoh: Beras Cianjur, Telur Ayam).
*   `Category` (VARCHAR(50)): Kategori klasifikasi makanan (contoh: Karbohidrat, Protein, Sayur).
*   `Unit` (VARCHAR(20)): Satuan ukur (contoh: kg, liter, butir).
*   `Stock` (DECIMAL(18,2)): Jumlah stok tersedia.
*   `EstimatedPrice` (DECIMAL(18,2)): Harga estimasi per satuan.

### 4. Table: `Schools`
Sekolah penerima paket makan siang gratis catering SPPG.
*   `SchoolId` (INT, Primary Key, Identity): ID sekolah (auto-increment).
*   `SchoolName` (VARCHAR(100)): Nama sekolah penerima.
*   `Address` (VARCHAR(200)): Alamat sekolah lengkap.
*   `PICName` (VARCHAR(100)): Nama PIC/penanggung jawab di sekolah.
*   `PICPhone` (VARCHAR(30)): Nomor HP PIC.
*   `StudentCount` (INT): Jumlah siswa penerima (target porsi makan siang).

### 5. Table: `KitchenNeeds`
Konsumsi harian bahan baku dapur SPPG berdasarkan menu hari terkait.
*   `NeedId` (INT, Primary Key, Identity): ID kebutuhan (auto-increment).
*   `NeedDate` (DATE): Tanggal konsumsi dapur.
*   `MaterialId` (INT, Foreign Key): Terhubung ke tabel `RawMaterials`.
*   `Quantity` (DECIMAL(18,2)): Jumlah kebutuhan bahan.
*   `Unit` (VARCHAR(20)): Satuan ukur kebutuhan.
*   `Notes` (VARCHAR(200)): Catatan/keterangan tambahan.

### 6. Table: `SupplierOrders`
Pemesanan bahan baku tambahan dari pemasok luar (Pemasok).
*   `OrderId` (INT, Primary Key, Identity): ID pesanan (auto-increment).
*   `OrderDate` (DATE): Tanggal pemesanan.
*   `SupplierName` (VARCHAR(100)): Nama pemasok.
*   `MaterialId` (INT, Foreign Key): Terhubung ke tabel `RawMaterials`.
*   `OrderQuantity` (DECIMAL(18,2)): Jumlah kuantitas pesanan.
*   `Unit` (VARCHAR(20)): Satuan ukur pesanan.
*   `Status` (VARCHAR(30)): Status pengiriman (`Pending`, `Diproses`, `Dikirim`, `Selesai`).
*   `Notes` (VARCHAR(200)): Catatan instruksi pengiriman.

### 7. Table: `ProductionDistribution`
Memantau realisasi masak porsi masakan dan validasi pengiriman logistik.
*   `ProcessId` (INT, Primary Key, Identity): ID proses monitoring (auto-increment).
*   `ProcessDate` (DATE): Tanggal monitoring harian.
*   `SchoolId` (INT, Foreign Key): Terhubung ke tabel `Schools`.
*   `PortionCount` (INT): Jumlah porsi makan siang yang direalisasikan.
*   `ProductionStatus` (VARCHAR(30)): Status masak (`Belum Diproses`, `Diproses`, `Selesai`).
*   `DistributionStatus` (VARCHAR(30)): Status kirim (`Belum Dikirim`, `Dikirim`, `Selesai`).
*   `Notes` (VARCHAR(200)): Keterangan validasi atau kendala logistik.

---

## 💾 2. Transact-SQL DDL Script (Table Creation)

Jalankan script SQL Server berikut di **SQL Server Management Studio (SSMS)** untuk membuat database dan mengisi data simulasi awal:

```sql
-- 1. Create the Database
CREATE DATABASE SmartMealDistributionDB;
GO

USE SmartMealDistributionDB;
GO

-- 2. Create Users Table
CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(50) NOT NULL,
    FullName VARCHAR(100) NOT NULL,
    Role VARCHAR(30) NOT NULL CHECK (Role IN ('PetugasSPPG', 'SupervisorSPPG', 'Pemasok')),
    Position VARCHAR(50) NOT NULL
);

-- 3. Create Employees Table
CREATE TABLE Employees (
    EmployeeId INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeName VARCHAR(100) NOT NULL,
    Position VARCHAR(50) NOT NULL,
    Phone VARCHAR(30) NULL,
    Address VARCHAR(200) NULL
);

-- 4. Create RawMaterials Table
CREATE TABLE RawMaterials (
    MaterialId INT IDENTITY(1,1) PRIMARY KEY,
    MaterialName VARCHAR(100) NOT NULL,
    Category VARCHAR(50) NOT NULL,
    Unit VARCHAR(20) NOT NULL,
    Stock DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    EstimatedPrice DECIMAL(18,2) NOT NULL DEFAULT 0.00
);

-- 5. Create Schools Table
CREATE TABLE Schools (
    SchoolId INT IDENTITY(1,1) PRIMARY KEY,
    SchoolName VARCHAR(100) NOT NULL,
    Address VARCHAR(200) NOT NULL,
    PICName VARCHAR(100) NULL,
    PICPhone VARCHAR(30) NULL,
    StudentCount INT NOT NULL DEFAULT 0
);

-- 6. Create KitchenNeeds Table
CREATE TABLE KitchenNeeds (
    NeedId INT IDENTITY(1,1) PRIMARY KEY,
    NeedDate DATE NOT NULL,
    MaterialId INT NOT NULL,
    Quantity DECIMAL(18,2) NOT NULL,
    Unit VARCHAR(20) NOT NULL,
    Notes VARCHAR(200) NULL,
    FOREIGN KEY (MaterialId) REFERENCES RawMaterials(MaterialId) ON DELETE CASCADE
);

-- 7. Create SupplierOrders Table
CREATE TABLE SupplierOrders (
    OrderId INT IDENTITY(1,1) PRIMARY KEY,
    OrderDate DATE NOT NULL,
    SupplierName VARCHAR(100) NOT NULL,
    MaterialId INT NOT NULL,
    OrderQuantity DECIMAL(18,2) NOT NULL,
    Unit VARCHAR(20) NOT NULL,
    Status VARCHAR(30) NOT NULL DEFAULT 'Pending' CHECK (Status IN ('Pending', 'Diproses', 'Dikirim', 'Selesai')),
    Notes VARCHAR(200) NULL,
    FOREIGN KEY (MaterialId) REFERENCES RawMaterials(MaterialId) ON DELETE CASCADE
);

-- 8. Create ProductionDistribution Table
CREATE TABLE ProductionDistribution (
    ProcessId INT IDENTITY(1,1) PRIMARY KEY,
    ProcessDate DATE NOT NULL,
    SchoolId INT NOT NULL,
    PortionCount INT NOT NULL,
    ProductionStatus VARCHAR(30) NOT NULL DEFAULT 'Belum Diproses' CHECK (ProductionStatus IN ('Belum Diproses', 'Diproses', 'Selesai')),
    DistributionStatus VARCHAR(30) NOT NULL DEFAULT 'Belum Dikirim' CHECK (DistributionStatus IN ('Belum Dikirim', 'Dikirim', 'Selesai')),
    Notes VARCHAR(200) NULL,
    FOREIGN KEY (SchoolId) REFERENCES Schools(SchoolId) ON DELETE CASCADE
);
GO

-- 9. Seed Mock Data
-- Seed Users
INSERT INTO Users (Username, Password, FullName, Role, Position) VALUES
('petugas', 'password123', 'Andi Saputra', 'PetugasSPPG', 'Staf Dapur'),
('supervisor', 'password123', 'Budi Santoso', 'SupervisorSPPG', 'Kepala Pelayanan'),
('pemasok1', 'password123', 'CV Pangan Sejahtera', 'Pemasok', 'Distributor Utama');

-- Seed Employees
INSERT INTO Employees (EmployeeName, Position, Phone, Address) VALUES
('Andi Saputra', 'Staf Dapur', '08123456789', 'Jl. Dahlia No. 5, Purwakarta'),
('Siti Aminah', 'Koki Utama', '08776543210', 'Jl. Mawar No. 12, Purwakarta'),
('Rahmat Hidayat', 'Kurir Distribusi', '08998877665', 'Jl. Melati No. 8, Purwakarta');

-- Seed RawMaterials
INSERT INTO RawMaterials (MaterialName, Category, Unit, Stock, EstimatedPrice) VALUES
('Beras Cianjur', 'Karbohidrat', 'kg', 500.00, 14000.00),
('Telur Ayam', 'Protein', 'butir', 1000.00, 2000.00),
('Daging Ayam Fillet', 'Protein', 'kg', 200.00, 35000.00),
('Minyak Goreng Bimoli', 'Minyak', 'liter', 150.00, 18000.00),
('Wortel Segar', 'Sayur', 'kg', 100.00, 12000.00);

-- Seed Schools
INSERT INTO Schools (SchoolName, Address, PICName, PICPhone, StudentCount) VALUES
('SDN 1 Purwakarta', 'Jl. Veteran No. 12, Purwakarta', 'Pak Joko', '08123456789', 320),
('SDN 2 Purwakarta', 'Jl. Sudirman No. 45, Purwakarta', 'Ibu Sri', '08776543210', 240),
('SMPN 1 Purwakarta', 'Jl. Cipaisan No. 2, Purwakarta', 'Pak Heru', '08998877665', 450);

-- Seed KitchenNeeds
INSERT INTO KitchenNeeds (NeedDate, MaterialId, Quantity, Unit, Notes) VALUES
(CAST(GETDATE() AS DATE), 1, 50.00, 'kg', 'Menu nasi tim siang'),
(CAST(GETDATE() AS DATE), 2, 320.00, 'butir', 'Lauk telur dadar SDN 1'),
(CAST(GETDATE() AS DATE), 5, 15.00, 'kg', 'Wortel untuk sayur sop');

-- Seed SupplierOrders
INSERT INTO SupplierOrders (OrderDate, SupplierName, MaterialId, OrderQuantity, Unit, Status, Notes) VALUES
(CAST(GETDATE() AS DATE), 'CV Pangan Sejahtera', 1, 200.00, 'kg', 'Pending', 'Tambahan stok beras cianjur');

-- Seed ProductionDistribution
INSERT INTO ProductionDistribution (ProcessDate, SchoolId, PortionCount, ProductionStatus, DistributionStatus, Notes) VALUES
(CAST(GETDATE() AS DATE), 1, 320, 'Selesai', 'Selesai', 'Terkirim lengkap'),
(CAST(GETDATE() AS DATE), 2, 240, 'Selesai', 'Dikirim', 'Sedang diantarkan kurir Rahmat'),
(CAST(GETDATE() AS DATE), 3, 450, 'Diproses', 'Belum Dikirim', 'Proses memasak koki Siti');
GO
```

---

## 🔑 3. Modul Autentikasi (Users)

### 🔍 Read (Login Validation)
```sql
SELECT UserId, Username, FullName, Role, Position 
FROM Users 
WHERE Username = @Username AND Password = @Password;
```

---

## 👥 4. Modul Data Pegawai (Employees)

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

## 📦 5. Modul Data Bahan Baku (RawMaterials)

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

## 🏫 6. Modul Sekolah Penerima (Schools)

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

## 🍳 7. Modul Kebutuhan Dapur Harian (KitchenNeeds)

### ➕ Create (Insert Kitchen Need)
```sql
INSERT INTO KitchenNeeds (NeedDate, MaterialId, Quantity, Unit, Notes)
VALUES (@NeedDate, @MaterialId, @Quantity, @Unit, @Notes);
```

### 🔍 Read (Relational Select with INNER JOIN)
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

## 🚚 8. Modul Pesanan ke Pemasok (SupplierOrders)

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
*   **Ubah Status Pengiriman:**
    ```sql
    UPDATE SupplierOrders 
    SET Status = @Status -- Status: 'Pending', 'Diproses', 'Dikirim', 'Selesai'
    WHERE OrderId = @OrderId;
    ```
*   **Update Stok Bahan Baku (Dijalankan otomatis saat Status Pesanan di-set 'Selesai'):**
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

## 🍳 9. Monitoring Produksi & Distribusi (ProductionDistribution)

### ➕ Create (Insert Record)
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
*   **Validasi Status (Oleh SupervisorSPPG):**
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

## 📊 10. Query Laporan (Hari ke-1)

### 📑 Laporan 1: Laporan Stok Bahan Baku & Estimasi Biaya
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
