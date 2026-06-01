/*
  Warnings:

  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Task";

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "position" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Employee" (
    "employeeId" SERIAL NOT NULL,
    "employeeName" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("employeeId")
);

-- CreateTable
CREATE TABLE "RawMaterial" (
    "materialId" SERIAL NOT NULL,
    "materialName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "stock" DECIMAL(18,2) NOT NULL,
    "estimatedPrice" DECIMAL(18,2) NOT NULL,

    CONSTRAINT "RawMaterial_pkey" PRIMARY KEY ("materialId")
);

-- CreateTable
CREATE TABLE "School" (
    "schoolId" SERIAL NOT NULL,
    "schoolName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "picName" TEXT NOT NULL,
    "picPhone" TEXT NOT NULL,
    "studentCount" INTEGER NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("schoolId")
);

-- CreateTable
CREATE TABLE "KitchenNeed" (
    "needId" SERIAL NOT NULL,
    "needDate" DATE NOT NULL,
    "materialId" INTEGER NOT NULL,
    "quantity" DECIMAL(18,2) NOT NULL,
    "unit" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "KitchenNeed_pkey" PRIMARY KEY ("needId")
);

-- CreateTable
CREATE TABLE "SupplierOrder" (
    "orderId" SERIAL NOT NULL,
    "orderDate" DATE NOT NULL,
    "supplierName" TEXT NOT NULL,
    "materialId" INTEGER NOT NULL,
    "orderQuantity" DECIMAL(18,2) NOT NULL,
    "unit" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "SupplierOrder_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "ProductionDistribution" (
    "processId" SERIAL NOT NULL,
    "processDate" DATE NOT NULL,
    "schoolId" INTEGER NOT NULL,
    "portionCount" INTEGER NOT NULL,
    "productionStatus" TEXT NOT NULL,
    "distributionStatus" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "ProductionDistribution_pkey" PRIMARY KEY ("processId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "KitchenNeed" ADD CONSTRAINT "KitchenNeed_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "RawMaterial"("materialId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierOrder" ADD CONSTRAINT "SupplierOrder_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "RawMaterial"("materialId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionDistribution" ADD CONSTRAINT "ProductionDistribution_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("schoolId") ON DELETE CASCADE ON UPDATE CASCADE;
