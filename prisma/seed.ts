import { PrismaClient } from "../src/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

const getPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not defined.");
  }
  neonConfig.webSocketConstructor = ws;
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
};

const prisma = getPrismaClient();

async function main() {
  console.log("Start seeding...");

  // 1. Clear existing data
  await prisma.productionDistribution.deleteMany({});
  await prisma.supplierOrder.deleteMany({});
  await prisma.kitchenNeed.deleteMany({});
  await prisma.school.deleteMany({});
  await prisma.rawMaterial.deleteMany({});
  await prisma.employee.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Seed Users
  const user1 = await prisma.user.create({
    data: {
      username: "petugas",
      password: "password123",
      fullName: "Andi Saputra",
      role: "PetugasSPPG",
      position: "Staf Dapur",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: "supervisor",
      password: "password123",
      fullName: "Budi Santoso",
      role: "SupervisorSPPG",
      position: "Kepala Pelayanan",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      username: "pemasok1",
      password: "password123",
      fullName: "CV Pangan Sejahtera",
      role: "Pemasok",
      position: "Distributor Utama",
    },
  });

  console.log("Seeded Users:", { user1: user1.username, user2: user2.username, user3: user3.username });

  // 3. Seed Employees
  const emp1 = await prisma.employee.create({
    data: {
      employeeName: "Andi Saputra",
      position: "Staf Dapur",
      phone: "08123456789",
      address: "Jl. Dahlia No. 5, Purwakarta",
    },
  });

  const emp2 = await prisma.employee.create({
    data: {
      employeeName: "Siti Aminah",
      position: "Koki Utama",
      phone: "08776543210",
      address: "Jl. Mawar No. 12, Purwakarta",
    },
  });

  const emp3 = await prisma.employee.create({
    data: {
      employeeName: "Rahmat Hidayat",
      position: "Kurir Distribusi",
      phone: "08998877665",
      address: "Jl. Melati No. 8, Purwakarta",
    },
  });

  console.log("Seeded Employees count: 3");

  // 4. Seed Raw Materials
  const mat1 = await prisma.rawMaterial.create({
    data: {
      materialName: "Beras Cianjur",
      category: "Karbohidrat",
      unit: "kg",
      stock: 500.0,
      estimatedPrice: 14000.0,
    },
  });

  const mat2 = await prisma.rawMaterial.create({
    data: {
      materialName: "Telur Ayam",
      category: "Protein",
      unit: "butir",
      stock: 1000.0,
      estimatedPrice: 2000.0,
    },
  });

  const mat3 = await prisma.rawMaterial.create({
    data: {
      materialName: "Daging Ayam Fillet",
      category: "Protein",
      unit: "kg",
      stock: 200.0,
      estimatedPrice: 35000.0,
    },
  });

  const mat4 = await prisma.rawMaterial.create({
    data: {
      materialName: "Minyak Goreng Bimoli",
      category: "Minyak",
      unit: "liter",
      stock: 150.0,
      estimatedPrice: 18000.0,
    },
  });

  const mat5 = await prisma.rawMaterial.create({
    data: {
      materialName: "Wortel Segar",
      category: "Sayur",
      unit: "kg",
      stock: 100.0,
      estimatedPrice: 12000.0,
    },
  });

  console.log("Seeded Raw Materials count: 5");

  // 5. Seed Schools
  const sch1 = await prisma.school.create({
    data: {
      schoolName: "SDN 1 Purwakarta",
      address: "Jl. Veteran No. 12, Purwakarta",
      picName: "Pak Joko",
      picPhone: "08123456789",
      studentCount: 320,
    },
  });

  const sch2 = await prisma.school.create({
    data: {
      schoolName: "SDN 2 Purwakarta",
      address: "Jl. Sudirman No. 45, Purwakarta",
      picName: "Ibu Sri",
      picPhone: "08776543210",
      studentCount: 240,
    },
  });

  const sch3 = await prisma.school.create({
    data: {
      schoolName: "SMPN 1 Purwakarta",
      address: "Jl. Cipaisan No. 2, Purwakarta",
      picName: "Pak Heru",
      picPhone: "08998877665",
      studentCount: 450,
    },
  });

  console.log("Seeded Schools count: 3");

  // 6. Seed Kitchen Needs
  const today = new Date();
  await prisma.kitchenNeed.create({
    data: {
      needDate: today,
      materialId: mat1.materialId,
      quantity: 50.0,
      unit: "kg",
      notes: "Menu nasi tim siang",
    },
  });

  await prisma.kitchenNeed.create({
    data: {
      needDate: today,
      materialId: mat2.materialId,
      quantity: 320.0,
      unit: "butir",
      notes: "Lauk telur dadar SDN 1",
    },
  });

  await prisma.kitchenNeed.create({
    data: {
      needDate: today,
      materialId: mat5.materialId,
      quantity: 15.0,
      unit: "kg",
      notes: "Wortel untuk sayur sop",
    },
  });

  console.log("Seeded Kitchen Needs count: 3");

  // 7. Seed Supplier Orders
  await prisma.supplierOrder.create({
    data: {
      orderDate: today,
      supplierName: "CV Pangan Sejahtera",
      materialId: mat1.materialId,
      orderQuantity: 200.0,
      unit: "kg",
      status: "Pending",
      notes: "Tambahan stok beras cianjur",
    },
  });

  console.log("Seeded Supplier Orders count: 1");

  // 8. Seed Production & Distribution
  await prisma.productionDistribution.create({
    data: {
      processDate: today,
      schoolId: sch1.schoolId,
      portionCount: 320,
      productionStatus: "Selesai",
      distributionStatus: "Selesai",
      notes: "Terkirim lengkap",
    },
  });

  await prisma.productionDistribution.create({
    data: {
      processDate: today,
      schoolId: sch2.schoolId,
      portionCount: 240,
      productionStatus: "Selesai",
      distributionStatus: "Dikirim",
      notes: "Sedang diantarkan kurir Rahmat",
    },
  });

  await prisma.productionDistribution.create({
    data: {
      processDate: today,
      schoolId: sch3.schoolId,
      portionCount: 450,
      productionStatus: "Diproses",
      distributionStatus: "Belum Dikirim",
      notes: "Proses memasak koki Siti",
    },
  });

  console.log("Seeded Production Distribution count: 3");
  console.log("Seeding complete successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
