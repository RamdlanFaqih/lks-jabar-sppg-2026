# Smart Meal Distribution System (LKS SMK Jabar 2026 - ITSSFB)

A reference implementation and learning platform for the **IT Software Solution for Business** competition category in **LKS SMK Jawa Barat 2026**, themed **Smart Meal Distribution System** (Studi Kasus: Sistem Operasional SPPG).

This repository contains a full Next.js App Router implementation backed by Prisma ORM and Neon PostgreSQL (for deployment/learning purposes), alongside complete database schemas, Transact-SQL (T-SQL) scripts, and setup documentation for **Microsoft SQL Server (Windows)**.

---

## 📂 Database Schema Design (MS SQL Server / Windows)

The system requires a relational database comprising 7 core tables:

### 1. Table: `Users`
Stores user credentials and access permissions.
*   `UserId` (INT, Primary Key, Identity): Auto-incremented user ID.
*   `Username` (VARCHAR(50), Unique): Unique login name.
*   `Password` (VARCHAR(50)): Simple plain text password (as per LKS simplification).
*   `FullName` (VARCHAR(100)): Full name of the user.
*   `Role` (VARCHAR(30)): Roles (`PetugasSPPG` or `SupervisorSPPG` or `Pemasok`).
*   `Position` (VARCHAR(50)): Official job position.

### 2. Table: `Employees`
Stores staff information.
*   `EmployeeId` (INT, Primary Key, Identity): Auto-incremented employee ID.
*   `EmployeeName` (VARCHAR(100)): Employee full name.
*   `Position` (VARCHAR(50)): Job designation (e.g., Cook, Courier).
*   `Phone` (VARCHAR(30)): Contact phone number.
*   `Address` (VARCHAR(200)): Home address.

### 3. Table: `RawMaterials`
Inventory tracking for kitchen ingredients.
*   `MaterialId` (INT, Primary Key, Identity): Auto-incremented material ID.
*   `MaterialName` (VARCHAR(100)): Ingredient name (e.g., Rice, Eggs).
*   `Category` (VARCHAR(50)): Food category (e.g., Protein, Vegetable).
*   `Unit` (VARCHAR(20)): Measurement unit (e.g., kg, liter, piece).
*   `Stock` (DECIMAL(18,2)): Available stock quantity.
*   `EstimatedPrice` (DECIMAL(18,2)): Estimated cost per unit.

### 4. Table: `Schools`
List of recipient schools.
*   `SchoolId` (INT, Primary Key, Identity): Auto-incremented school ID.
*   `SchoolName` (VARCHAR(100)): School name.
*   `Address` (VARCHAR(200)): School address.
*   `PICName` (VARCHAR(100)): School point of contact.
*   `PICPhone` (VARCHAR(30)): Phone number of PIC.
*   `StudentCount` (INT): Total students (number of portions needed).

### 5. Table: `KitchenNeeds`
Daily kitchen raw material consumption tracking.
*   `NeedId` (INT, Primary Key, Identity): Auto-incremented record ID.
*   `NeedDate` (DATE): Intake date.
*   `MaterialId` (INT, Foreign Key): Links to `RawMaterials`.
*   `Quantity` (DECIMAL(18,2)): Quantity needed.
*   `Unit` (VARCHAR(20)): Unit of measurement.
*   `Notes` (VARCHAR(200)): Special notes.

### 6. Table: `SupplierOrders`
Replenishment orders sent to raw material suppliers (Pemasok).
*   `OrderId` (INT, Primary Key, Identity): Auto-incremented order ID.
*   `OrderDate` (DATE): Purchase order date.
*   `SupplierName` (VARCHAR(100)): Name of the supplier.
*   `MaterialId` (INT, Foreign Key): Links to `RawMaterials`.
*   `OrderQuantity` (DECIMAL(18,2)): Quantity ordered.
*   `Unit` (VARCHAR(20)): Unit of measurement.
*   `Status` (VARCHAR(30)): Delivery state (`Pending`, `Diproses`, `Dikirim`, `Selesai`).
*   `Notes` (VARCHAR(200)): Special instructions.

### 7. Table: `ProductionDistribution`
Tracks cooking progress and delivery validation.
*   `ProcessId` (INT, Primary Key, Identity): Auto-incremented record ID.
*   `ProcessDate` (DATE): Daily kitchen cooking date.
*   `SchoolId` (INT, Foreign Key): Links to `Schools`.
*   `PortionCount` (INT): Portion counts prepared.
*   `ProductionStatus` (VARCHAR(30)): Status (`Belum Diproses`, `Diproses`, `Selesai`).
*   `DistributionStatus` (VARCHAR(30)): Status (`Belum Dikirim`, `Dikirim`, `Selesai`).
*   `Notes` (VARCHAR(200)): Logistics notes.

---

## 💾 Transact-SQL DDL Script (Table Creation)

Run the following SQL script in **SQL Server Management Studio (SSMS)** to generate the database structure on Windows:

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

-- 9. Seed Mock Data (Optional, for testing)
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

-- Seed KitchenNeeds (Assumes MaterialId 1, 2, 5 match Beras, Telur, Wortel)
INSERT INTO KitchenNeeds (NeedDate, MaterialId, Quantity, Unit, Notes) VALUES
(CAST(GETDATE() AS DATE), 1, 50.00, 'kg', 'Menu nasi tim siang'),
(CAST(GETDATE() AS DATE), 2, 320.00, 'butir', 'Lauk telur dadar SDN 1'),
(CAST(GETDATE() AS DATE), 5, 15.00, 'kg', 'Wortel untuk sayur sop');

-- Seed SupplierOrders (Only 1 Pending supplier order, matches our updated seeder!)
INSERT INTO SupplierOrders (OrderDate, SupplierName, MaterialId, OrderQuantity, Unit, Status, Notes) VALUES
(CAST(GETDATE() AS DATE), 'CV Pangan Sejahtera', 1, 200.00, 'kg', 'Pending', 'Tambahan stok beras cianjur');

-- Seed ProductionDistribution (Assumes SchoolId 1, 2, 3 match SDN 1, SDN 2, SMPN 1)
INSERT INTO ProductionDistribution (ProcessDate, SchoolId, PortionCount, ProductionStatus, DistributionStatus, Notes) VALUES
(CAST(GETDATE() AS DATE), 1, 320, 'Selesai', 'Selesai', 'Terkirim lengkap'),
(CAST(GETDATE() AS DATE), 2, 240, 'Selesai', 'Dikirim', 'Sedang diantarkan kurir Rahmat'),
(CAST(GETDATE() AS DATE), 3, 450, 'Diproses', 'Belum Dikirim', 'Proses memasak koki Siti');
GO
```
```

---

## 📈 Transact-SQL DML Script (Common Queries)

Here are the standard DML scripts frequently tested during the LKS SMK competition:

### 1. User Authentication (Login Check)
```sql
SELECT UserId, Username, FullName, Role, Position 
FROM Users 
WHERE Username = 'petugas' AND Password = 'password123';
```

### 2. Daily Kitchen Need Report (INNER JOIN)
Joins `KitchenNeeds` with `RawMaterials` to display ingredient names and total costs.
```sql
SELECT 
    k.NeedId,
    k.NeedDate,
    m.MaterialName,
    k.Quantity,
    k.Unit,
    m.EstimatedPrice,
    (k.Quantity * m.EstimatedPrice) AS TotalCost,
    k.Notes
FROM KitchenNeeds k
INNER JOIN RawMaterials m ON k.MaterialId = m.MaterialId
ORDER BY k.NeedDate DESC;
```

### 3. Active Supplier Order Status Update
Updates order status when supplier processes or delivers stock:
```sql
UPDATE SupplierOrders 
SET Status = 'Dikirim', Notes = 'On the way via Courier'
WHERE OrderId = 1;
```

### 4. Summary Statistics Dashboard Aggregation
Runs count aggregations for summary KPI boxes:
```sql
SELECT 
    (SELECT COUNT(*) FROM Employees) AS TotalEmployees,
    (SELECT COUNT(*) FROM RawMaterials) AS TotalMaterials,
    (SELECT COUNT(*) FROM Schools) AS TotalSchools,
    (SELECT COUNT(*) FROM SupplierOrders WHERE Status <> 'Selesai') AS ActiveOrders;
```

### 5. Production & Distribution Report
Generates validation details for supervisors:
```sql
SELECT 
    p.ProcessId,
    p.ProcessDate,
    s.SchoolName,
    p.PortionCount,
    p.ProductionStatus,
    p.DistributionStatus,
    p.Notes
FROM ProductionDistribution p
INNER JOIN Schools s ON p.SchoolId = s.SchoolId
ORDER BY p.ProcessDate DESC;
```

---

## 💻 Running the App (NextJS / Neon SQL Playground)

To run this reference Next.js implementation locally for learning:

1.  **Configure environment variables**: Copy `.env.example` to `.env` and fill in your Neon database credentials.
2.  **Run migrations**:
    ```bash
    npx prisma migrate dev
    ```
3.  **Seed mock data**:
    ```bash
    npx prisma db seed
    ```
4.  **Start development server**:
    ```bash
    npm run dev
    ```
5.  **Access Portals**: Open `http://localhost:3000` to access the console, and `http://localhost:3000/docs` to test endpoints.
