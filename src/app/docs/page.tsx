"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Parameter {
  name: string;
  type: string;
  location: "path" | "query" | "body";
  required: boolean;
  description: string;
  defaultValue?: string;
}

interface ResponseSchema {
  status: number;
  description: string;
  body: string;
}

interface Endpoint {
  id: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description: string;
  category: "Auth" | "Employees" | "Materials" | "Schools" | "Kitchen Needs" | "Orders" | "Production & Distribution";
  roles: ("Petugas" | "Supervisor" | "Pemasok")[];
  mode: "desktop" | "mobile" | "both";
  parameters?: Parameter[];
  responses: ResponseSchema[];
}

const endpoints: Endpoint[] = [
  // Auth
  {
    id: "login",
    method: "POST",
    path: "/api/auth/login",
    description: "Authenticate user credentials to start a session. Supports all roles: Petugas, Supervisor, and Pemasok.",
    category: "Auth",
    roles: ["Petugas", "Supervisor", "Pemasok"],
    mode: "both",
    parameters: [
      { name: "username", type: "string", location: "body", required: true, description: "Username of the user (e.g. petugas1, supervisor1, pemasok1)", defaultValue: "petugas1" },
      { name: "password", type: "string", location: "body", required: true, description: "Password of the user", defaultValue: "password123" }
    ],
    responses: [
      {
        status: 200,
        description: "Login successful.",
        body: JSON.stringify({
          success: true,
          user: { userId: 1, username: "petugas1", fullName: "Budi Santoso", role: "PetugasSPPG", position: "Staff Logistik" }
        }, null, 2)
      },
      {
        status: 400,
        description: "Missing username or password.",
        body: JSON.stringify({ error: "Bad Request", message: "Username and password are required" }, null, 2)
      },
      {
        status: 401,
        description: "Invalid credentials.",
        body: JSON.stringify({ error: "Unauthorized", message: "Invalid username or password" }, null, 2)
      }
    ]
  },
  // Employees
  {
    id: "get-employees",
    method: "GET",
    path: "/api/employees",
    description: "Retrieve a list of all employees in the kitchen management system.",
    category: "Employees",
    roles: ["Petugas", "Supervisor"],
    mode: "desktop",
    parameters: [],
    responses: [
      {
        status: 200,
        description: "Successfully fetched employee list.",
        body: JSON.stringify([
          { employeeId: 1, employeeName: "Budi Santoso", position: "Koki Utama", phone: "08123456789", address: "Bandung" }
        ], null, 2)
      }
    ]
  },
  {
    id: "create-employee",
    method: "POST",
    path: "/api/employees",
    description: "Register a new employee into the system.",
    category: "Employees",
    roles: ["Petugas"],
    mode: "desktop",
    parameters: [
      { name: "employeeName", type: "string", location: "body", required: true, description: "Full name of the employee", defaultValue: "Asep Sunandar" },
      { name: "position", type: "string", location: "body", required: true, description: "Job title / position of the employee", defaultValue: "Petugas Kebersihan" },
      { name: "phone", type: "string", location: "body", required: false, description: "Contact phone number", defaultValue: "0812345678" },
      { name: "address", type: "string", location: "body", required: false, description: "Home address details", defaultValue: "Bandung Barat" }
    ],
    responses: [
      {
        status: 201,
        description: "Employee created successfully.",
        body: JSON.stringify({ employeeId: 2, employeeName: "Asep Sunandar", position: "Petugas Kebersihan", phone: "0812345678", address: "Bandung Barat" }, null, 2)
      },
      {
        status: 400,
        description: "Missing required fields.",
        body: JSON.stringify({ error: "Bad Request", message: "Name and Position are required" }, null, 2)
      }
    ]
  },
  {
    id: "update-employee",
    method: "PATCH",
    path: "/api/employees/[id]",
    description: "Update details of an existing employee by ID.",
    category: "Employees",
    roles: ["Petugas"],
    mode: "desktop",
    parameters: [
      { name: "id", type: "integer", location: "path", required: true, description: "The unique ID of the employee.", defaultValue: "1" },
      { name: "employeeName", type: "string", location: "body", required: false, description: "Updated full name of the employee", defaultValue: "Budi Santoso Updated" },
      { name: "position", type: "string", location: "body", required: false, description: "Updated job title", defaultValue: "Koki Kepala" },
      { name: "phone", type: "string", location: "body", required: false, description: "Updated phone number", defaultValue: "08123456789" },
      { name: "address", type: "string", location: "body", required: false, description: "Updated home address", defaultValue: "Bandung Tengah" }
    ],
    responses: [
      {
        status: 200,
        description: "Employee updated successfully.",
        body: JSON.stringify({ employeeId: 1, employeeName: "Budi Santoso Updated", position: "Koki Kepala", phone: "08123456789", address: "Bandung Tengah" }, null, 2)
      },
      {
        status: 400,
        description: "Invalid ID or bad payload.",
        body: JSON.stringify({ error: "Bad Request", message: "Invalid ID" }, null, 2)
      }
    ]
  },
  {
    id: "delete-employee",
    method: "DELETE",
    path: "/api/employees/[id]",
    description: "Delete an employee from the system.",
    category: "Employees",
    roles: ["Petugas"],
    mode: "desktop",
    parameters: [
      { name: "id", type: "integer", location: "path", required: true, description: "The unique ID of the employee to delete.", defaultValue: "2" }
    ],
    responses: [
      {
        status: 200,
        description: "Employee deleted successfully.",
        body: JSON.stringify({ success: true }, null, 2)
      },
      {
        status: 400,
        description: "Invalid employee ID.",
        body: JSON.stringify({ error: "Bad Request", message: "Invalid ID" }, null, 2)
      }
    ]
  },
  // Materials
  {
    id: "get-materials",
    method: "GET",
    path: "/api/materials",
    description: "Retrieve a list of raw materials. Supports filtering by category query parameter.",
    category: "Materials",
    roles: ["Petugas", "Supervisor"],
    mode: "desktop",
    parameters: [
      { name: "category", type: "string", location: "query", required: false, description: "Filter materials by category (e.g. Sembako, Sayuran, Daging)", defaultValue: "" }
    ],
    responses: [
      {
        status: 200,
        description: "List of raw materials retrieved successfully.",
        body: JSON.stringify([
          { materialId: 1, materialName: "Beras Cianjur", category: "Sembako", unit: "kg", stock: 120.5, estimatedPrice: 12500 }
        ], null, 2)
      }
    ]
  },
  {
    id: "create-material",
    method: "POST",
    path: "/api/materials",
    description: "Add a new raw material item to the inventory.",
    category: "Materials",
    roles: ["Petugas"],
    mode: "desktop",
    parameters: [
      { name: "materialName", type: "string", location: "body", required: true, description: "Name of the raw material", defaultValue: "Minyak Goreng" },
      { name: "category", type: "string", location: "body", required: true, description: "Category classification", defaultValue: "Sembako" },
      { name: "unit", type: "string", location: "body", required: true, description: "Measurement unit", defaultValue: "liter" },
      { name: "stock", type: "number", location: "body", required: false, description: "Initial stock count", defaultValue: "50" },
      { name: "estimatedPrice", type: "number", location: "body", required: false, description: "Estimated price per unit", defaultValue: "14000" }
    ],
    responses: [
      {
        status: 201,
        description: "Raw material created successfully.",
        body: JSON.stringify({ materialId: 2, materialName: "Minyak Goreng", category: "Sembako", unit: "liter", stock: 50, estimatedPrice: 14000 }, null, 2)
      },
      {
        status: 400,
        description: "Missing required fields.",
        body: JSON.stringify({ error: "Bad Request", message: "Name, Category, and Unit are required" }, null, 2)
      }
    ]
  },
  {
    id: "update-material",
    method: "PATCH",
    path: "/api/materials/[id]",
    description: "Update details of an existing raw material.",
    category: "Materials",
    roles: ["Petugas"],
    mode: "desktop",
    parameters: [
      { name: "id", type: "integer", location: "path", required: true, description: "Unique material ID.", defaultValue: "1" },
      { name: "materialName", type: "string", location: "body", required: false, description: "Material Name", defaultValue: "Beras Cianjur Super" },
      { name: "category", type: "string", location: "body", required: false, description: "Category", defaultValue: "Sembako" },
      { name: "unit", type: "string", location: "body", required: false, description: "Unit", defaultValue: "kg" },
      { name: "stock", type: "number", location: "body", required: false, description: "Stock amount", defaultValue: "150" },
      { name: "estimatedPrice", type: "number", location: "body", required: false, description: "Price estimation", defaultValue: "13000" }
    ],
    responses: [
      {
        status: 200,
        description: "Material updated successfully.",
        body: JSON.stringify({ materialId: 1, materialName: "Beras Cianjur Super", category: "Sembako", unit: "kg", stock: 150, estimatedPrice: 13000 }, null, 2)
      }
    ]
  },
  {
    id: "delete-material",
    method: "DELETE",
    path: "/api/materials/[id]",
    description: "Delete raw material from inventory database.",
    category: "Materials",
    roles: ["Petugas"],
    mode: "desktop",
    parameters: [
      { name: "id", type: "integer", location: "path", required: true, description: "Material ID to delete", defaultValue: "2" }
    ],
    responses: [
      {
        status: 200,
        description: "Raw material deleted successfully.",
        body: JSON.stringify({ success: true }, null, 2)
      }
    ]
  },
  // Schools
  {
    id: "get-schools",
    method: "GET",
    path: "/api/schools",
    description: "Fetch all registered schools receiving the SPPG catering.",
    category: "Schools",
    roles: ["Petugas", "Supervisor"],
    mode: "desktop",
    parameters: [],
    responses: [
      {
        status: 200,
        description: "List of schools retrieved.",
        body: JSON.stringify([
          { schoolId: 1, schoolName: "SMKN 1 Bandung", address: "Jl. Wastukencana No. 1", picName: "Pak Haryanto", picPhone: "0877123456", studentCount: 850 }
        ], null, 2)
      }
    ]
  },
  {
    id: "create-school",
    method: "POST",
    path: "/api/schools",
    description: "Register a new school.",
    category: "Schools",
    roles: ["Petugas"],
    mode: "desktop",
    parameters: [
      { name: "schoolName", type: "string", location: "body", required: true, description: "Name of the school", defaultValue: "SMKN 2 Bandung" },
      { name: "address", type: "string", location: "body", required: true, description: "School street address", defaultValue: "Jl. Ciliwung No. 2" },
      { name: "picName", type: "string", location: "body", required: false, description: "Name of PIC at school", defaultValue: "Ibu Nuraini" },
      { name: "picPhone", type: "string", location: "body", required: false, description: "PIC contact number", defaultValue: "08198765432" },
      { name: "studentCount", type: "number", location: "body", required: false, description: "Number of students enrolled", defaultValue: "620" }
    ],
    responses: [
      {
        status: 201,
        description: "School created successfully.",
        body: JSON.stringify({ schoolId: 2, schoolName: "SMKN 2 Bandung", address: "Jl. Ciliwung No. 2", picName: "Ibu Nuraini", picPhone: "08198765432", studentCount: 620 }, null, 2)
      }
    ]
  },
  {
    id: "update-school",
    method: "PATCH",
    path: "/api/schools/[id]",
    description: "Update school data.",
    category: "Schools",
    roles: ["Petugas"],
    mode: "desktop",
    parameters: [
      { name: "id", type: "integer", location: "path", required: true, description: "Unique School ID", defaultValue: "1" },
      { name: "schoolName", type: "string", location: "body", required: false, description: "Name of the school", defaultValue: "SMKN 1 Bandung Updated" },
      { name: "address", type: "string", location: "body", required: false, description: "Address", defaultValue: "Jl. Wastukencana No. 1 Bandung" },
      { name: "picName", type: "string", location: "body", required: false, description: "PIC Name", defaultValue: "Pak Haryanto" },
      { name: "picPhone", type: "string", location: "body", required: false, description: "PIC Phone", defaultValue: "0877123456" },
      { name: "studentCount", type: "number", location: "body", required: false, description: "Student count", defaultValue: "880" }
    ],
    responses: [
      {
        status: 200,
        description: "School updated successfully.",
        body: JSON.stringify({ schoolId: 1, schoolName: "SMKN 1 Bandung Updated", address: "Jl. Wastukencana No. 1 Bandung", picName: "Pak Haryanto", picPhone: "0877123456", studentCount: 880 }, null, 2)
      }
    ]
  },
  {
    id: "delete-school",
    method: "DELETE",
    path: "/api/schools/[id]",
    description: "Remove school record from database.",
    category: "Schools",
    roles: ["Petugas"],
    mode: "desktop",
    parameters: [
      { name: "id", type: "integer", location: "path", required: true, description: "School ID to delete", defaultValue: "2" }
    ],
    responses: [
      {
        status: 200,
        description: "School deleted successfully.",
        body: JSON.stringify({ success: true }, null, 2)
      }
    ]
  },
  // Kitchen Needs
  {
    id: "get-kitchen-needs",
    method: "GET",
    path: "/api/kitchen-needs",
    description: "Retrieve a list of daily kitchen raw material needs.",
    category: "Kitchen Needs",
    roles: ["Petugas", "Supervisor"],
    mode: "desktop",
    parameters: [],
    responses: [
      {
        status: 200,
        description: "List of kitchen needs retrieved.",
        body: JSON.stringify([
          { needId: 1, needDate: "2026-06-10T00:00:00.000Z", materialId: 1, quantity: 150, unit: "kg", notes: "Untuk makan siang rabu", material: { materialId: 1, materialName: "Beras Cianjur" } }
        ], null, 2)
      }
    ]
  },
  {
    id: "create-kitchen-need",
    method: "POST",
    path: "/api/kitchen-needs",
    description: "Add a daily raw material requirement for the kitchen.",
    category: "Kitchen Needs",
    roles: ["Petugas"],
    mode: "desktop",
    parameters: [
      { name: "needDate", type: "string (date)", location: "body", required: true, description: "Date of request (YYYY-MM-DD)", defaultValue: "2026-06-10" },
      { name: "materialId", type: "number", location: "body", required: true, description: "Target raw material ID", defaultValue: "1" },
      { name: "quantity", type: "number", location: "body", required: true, description: "Quantity of raw material requested", defaultValue: "120" },
      { name: "notes", type: "string", location: "body", required: false, description: "Optional notes", defaultValue: "Stok menipis" }
    ],
    responses: [
      {
        status: 201,
        description: "Kitchen need record created.",
        body: JSON.stringify({ needId: 2, needDate: "2026-06-10T00:00:00.000Z", materialId: 1, quantity: 120, unit: "kg", notes: "Stok menipis" }, null, 2)
      }
    ]
  },
  {
    id: "update-kitchen-need",
    method: "PATCH",
    path: "/api/kitchen-needs/[id]",
    description: "Update kitchen need record details.",
    category: "Kitchen Needs",
    roles: ["Petugas"],
    mode: "desktop",
    parameters: [
      { name: "id", type: "integer", location: "path", required: true, description: "Need record ID", defaultValue: "1" },
      { name: "needDate", type: "string (date)", location: "body", required: false, description: "Date (YYYY-MM-DD)", defaultValue: "2026-06-10" },
      { name: "materialId", type: "number", location: "body", required: false, description: "Material ID", defaultValue: "1" },
      { name: "quantity", type: "number", location: "body", required: false, description: "Quantity needed", defaultValue: "135" },
      { name: "notes", type: "string", location: "body", required: false, description: "Notes", defaultValue: "Revisi jumlah kebutuhan" }
    ],
    responses: [
      {
        status: 200,
        description: "Kitchen need updated.",
        body: JSON.stringify({ needId: 1, needDate: "2026-06-10T00:00:00.000Z", materialId: 1, quantity: 135, unit: "kg", notes: "Revisi jumlah kebutuhan" }, null, 2)
      }
    ]
  },
  {
    id: "delete-kitchen-need",
    method: "DELETE",
    path: "/api/kitchen-needs/[id]",
    description: "Remove kitchen need entry.",
    category: "Kitchen Needs",
    roles: ["Petugas"],
    mode: "desktop",
    parameters: [
      { name: "id", type: "integer", location: "path", required: true, description: "Kitchen Need ID to delete", defaultValue: "2" }
    ],
    responses: [
      {
        status: 200,
        description: "Kitchen need deleted successfully.",
        body: JSON.stringify({ success: true }, null, 2)
      }
    ]
  },
  // Orders
  {
    id: "get-orders",
    method: "GET",
    path: "/api/orders",
    description: "Retrieve a summarized list of raw material orders placed with suppliers.",
    category: "Orders",
    roles: ["Petugas", "Supervisor", "Pemasok"],
    mode: "both",
    parameters: [],
    responses: [
      {
        status: 200,
        description: "Successfully fetched orders summary.",
        body: JSON.stringify([
          { orderId: 1, supplierName: "CV Pangan Sejahtera", orderDate: "2026-06-10", status: "Pending" }
        ], null, 2)
      }
    ]
  },
  {
    id: "create-order",
    method: "POST",
    path: "/api/orders",
    description: "Create a new raw material supply order. Set to Pending status automatically.",
    category: "Orders",
    roles: ["Petugas"],
    mode: "desktop",
    parameters: [
      { name: "supplierName", type: "string", location: "body", required: true, description: "Name of targeted supplier", defaultValue: "CV Pangan Sejahtera" },
      { name: "materialId", type: "number", location: "body", required: true, description: "Raw material ID ordered", defaultValue: "1" },
      { name: "orderQuantity", type: "number", location: "body", required: true, description: "Quantity ordered", defaultValue: "150" },
      { name: "notes", type: "string", location: "body", required: false, description: "Optional instructions", defaultValue: "Kirim pagi hari" }
    ],
    responses: [
      {
        status: 201,
        description: "Order created successfully.",
        body: JSON.stringify({ orderId: 2, orderDate: "2026-06-01T00:00:00.000Z", supplierName: "CV Pangan Sejahtera", materialId: 1, orderQuantity: 150, unit: "kg", status: "Pending", notes: "Kirim pagi hari" }, null, 2)
      }
    ]
  },
  {
    id: "get-order-detail",
    method: "GET",
    path: "/api/orders/[id]",
    description: "Retrieve complete detail of a single supplier order, including order items.",
    category: "Orders",
    roles: ["Petugas", "Supervisor", "Pemasok"],
    mode: "both",
    parameters: [
      { name: "id", type: "integer", location: "path", required: true, description: "The unique order ID.", defaultValue: "1" }
    ],
    responses: [
      {
        status: 200,
        description: "Successfully retrieved order detail.",
        body: JSON.stringify({
          orderId: 1,
          supplierName: "CV Pangan Sejahtera",
          status: "Pending",
          items: [{ itemName: "Beras Cianjur", quantity: 150, unit: "kg" }]
        }, null, 2)
      }
    ]
  },
  {
    id: "update-order",
    method: "PATCH",
    path: "/api/orders/[id]",
    description: "Update details of an order record.",
    category: "Orders",
    roles: ["Petugas"],
    mode: "desktop",
    parameters: [
      { name: "id", type: "integer", location: "path", required: true, description: "Order ID", defaultValue: "1" },
      { name: "supplierName", type: "string", location: "body", required: false, description: "Supplier name", defaultValue: "CV Pangan Sejahtera" },
      { name: "materialId", type: "number", location: "body", required: false, description: "Raw material ID", defaultValue: "1" },
      { name: "orderQuantity", type: "number", location: "body", required: false, description: "Ordered quantity", defaultValue: "200" },
      { name: "status", type: "string", location: "body", required: false, description: "Status (Pending, Diproses, Dikirim, Selesai)", defaultValue: "Diproses" },
      { name: "notes", type: "string", location: "body", required: false, description: "Notes", defaultValue: "Update kuantitas" }
    ],
    responses: [
      {
        status: 200,
        description: "Order updated successfully.",
        body: JSON.stringify({ orderId: 1, supplierName: "CV Pangan Sejahtera", materialId: 1, orderQuantity: 200, status: "Diproses", notes: "Update kuantitas" }, null, 2)
      }
    ]
  },
  {
    id: "delete-order",
    method: "DELETE",
    path: "/api/orders/[id]",
    description: "Delete an order record from database.",
    category: "Orders",
    roles: ["Petugas"],
    mode: "desktop",
    parameters: [
      { name: "id", type: "integer", location: "path", required: true, description: "Order ID to delete", defaultValue: "2" }
    ],
    responses: [
      {
        status: 200,
        description: "Order deleted successfully.",
        body: JSON.stringify({ success: true, message: "Order deleted successfully" }, null, 2)
      }
    ]
  },
  {
    id: "update-order-status",
    method: "PUT",
    path: "/api/orders/[id]/status",
    description: "Update order delivery status. Crucial for Pemasok mobile updates.",
    category: "Orders",
    roles: ["Pemasok"],
    mode: "mobile",
    parameters: [
      { name: "id", type: "integer", location: "path", required: true, description: "The unique order ID.", defaultValue: "1" },
      { name: "status", type: "string", location: "body", required: true, description: "New status value (Pending, Diproses, Dikirim, Selesai)", defaultValue: "Dikirim" }
    ],
    responses: [
      {
        status: 200,
        description: "Status successfully updated.",
        body: JSON.stringify({
          success: true,
          message: "Status updated successfully",
          order: { orderId: 1, supplierName: "CV Pangan Sejahtera", status: "Dikirim" }
        }, null, 2)
      }
    ]
  },
  // Production & Distribution
  {
    id: "get-production-distribution",
    method: "GET",
    path: "/api/production-distribution",
    description: "Retrieve production and distribution records of student catering packages.",
    category: "Production & Distribution",
    roles: ["Petugas", "Supervisor"],
    mode: "desktop",
    parameters: [],
    responses: [
      {
        status: 200,
        description: "Successfully fetched records.",
        body: JSON.stringify([
          { processId: 1, processDate: "2026-06-10T00:00:00.000Z", schoolId: 1, portionCount: 850, productionStatus: "Selesai", distributionStatus: "Dikirim", notes: "Sesuai jadwal", school: { schoolId: 1, schoolName: "SMKN 1 Bandung" } }
        ], null, 2)
      }
    ]
  },
  {
    id: "create-production-distribution",
    method: "POST",
    path: "/api/production-distribution",
    description: "Record a new production and distribution task for school lunch packages.",
    category: "Production & Distribution",
    roles: ["Petugas", "Supervisor"],
    mode: "desktop",
    parameters: [
      { name: "processDate", type: "string (date)", location: "body", required: true, description: "Date of processing (YYYY-MM-DD)", defaultValue: "2026-06-10" },
      { name: "schoolId", type: "number", location: "body", required: true, description: "Target school ID", defaultValue: "1" },
      { name: "portionCount", type: "number", location: "body", required: true, description: "Number of meal portions prepared", defaultValue: "850" },
      { name: "productionStatus", type: "string", location: "body", required: true, description: "Production status (Belum Diproses, Diproses, Selesai)", defaultValue: "Selesai" },
      { name: "distributionStatus", type: "string", location: "body", required: true, description: "Distribution status (Belum Dikirim, Dikirim, Selesai)", defaultValue: "Belum Dikirim" },
      { name: "notes", type: "string", location: "body", required: false, description: "Optional logs/notes", defaultValue: "Menunggu penjemputan" }
    ],
    responses: [
      {
        status: 201,
        description: "Record created successfully.",
        body: JSON.stringify({ processId: 2, processDate: "2026-06-10T00:00:00.000Z", schoolId: 1, portionCount: 850, productionStatus: "Selesai", distributionStatus: "Belum Dikirim", notes: "Menunggu penjemputan" }, null, 2)
      }
    ]
  },
  {
    id: "update-production-distribution",
    method: "PATCH",
    path: "/api/production-distribution/[id]",
    description: "Modify an existing production and distribution task status. Important for Supervisor validation.",
    category: "Production & Distribution",
    roles: ["Supervisor", "Petugas"],
    mode: "desktop",
    parameters: [
      { name: "id", type: "integer", location: "path", required: true, description: "Process ID", defaultValue: "1" },
      { name: "processDate", type: "string (date)", location: "body", required: false, description: "Date", defaultValue: "2026-06-10" },
      { name: "schoolId", type: "number", location: "body", required: false, description: "School ID", defaultValue: "1" },
      { name: "portionCount", type: "number", location: "body", required: false, description: "Portion count", defaultValue: "850" },
      { name: "productionStatus", type: "string", location: "body", required: false, description: "Production status", defaultValue: "Selesai" },
      { name: "distributionStatus", type: "string", location: "body", required: false, description: "Distribution status", defaultValue: "Selesai" },
      { name: "notes", type: "string", location: "body", required: false, description: "Notes", defaultValue: "Tervalidasi oleh supervisor" }
    ],
    responses: [
      {
        status: 200,
        description: "Record updated successfully.",
        body: JSON.stringify({ processId: 1, processDate: "2026-06-10T00:00:00.000Z", schoolId: 1, portionCount: 850, productionStatus: "Selesai", distributionStatus: "Selesai", notes: "Tervalidasi oleh supervisor" }, null, 2)
      }
    ]
  },
  {
    id: "delete-production-distribution",
    method: "DELETE",
    path: "/api/production-distribution/[id]",
    description: "Delete production & distribution history entry.",
    category: "Production & Distribution",
    roles: ["Supervisor", "Petugas"],
    mode: "desktop",
    parameters: [
      { name: "id", type: "integer", location: "path", required: true, description: "Process ID to delete", defaultValue: "2" }
    ],
    responses: [
      {
        status: 200,
        description: "Record deleted successfully.",
        body: JSON.stringify({ success: true }, null, 2)
      }
    ]
  }
];

export default function DocsPage() {
  const [activeEndpoint, setActiveEndpoint] = useState<Endpoint>(endpoints[0]);
  const [snippetLang, setSnippetLang] = useState<"curl" | "js" | "python">("curl");

  // Filters State
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("All");
  const [selectedModeFilter, setSelectedModeFilter] = useState<string>("Mobile");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter endpoints
  const filteredEndpoints = endpoints.filter((ep) => {
    const matchesRole =
      selectedRoleFilter === "All" || ep.roles.includes(selectedRoleFilter as any);
    const matchesMode =
      selectedModeFilter === "All" ||
      ep.mode === "both" ||
      ep.mode === selectedModeFilter.toLowerCase();
    const matchesSearch =
      ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesMode && matchesSearch;
  });

  // Group filteredEndpoints by category
  const categoriesMap: Record<string, Endpoint[]> = {};
  filteredEndpoints.forEach((ep) => {
    if (!categoriesMap[ep.category]) {
      categoriesMap[ep.category] = [];
    }
    categoriesMap[ep.category].push(ep);
  });
  const categoriesList = Object.keys(categoriesMap) as Endpoint["category"][];

  const getMethodBadgeClass = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-emerald-50 text-emerald-700 border border-emerald-250/50";
      case "POST":
        return "bg-sky-50 text-sky-700 border border-sky-250/50";
      case "PUT":
        return "bg-amber-50 text-amber-700 border border-amber-300/50";
      case "PATCH":
        return "bg-indigo-50 text-indigo-700 border border-indigo-250/50";
      case "DELETE":
        return "bg-rose-50 text-rose-700 border border-rose-250/50";
      default:
        return "bg-slate-50 text-slate-700 border border-slate-200/50";
    }
  };

  const generateSnippet = (endpoint: Endpoint) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    
    // Construct dynamic URL path
    let path = endpoint.path;
    endpoint.parameters?.forEach((p) => {
      if (p.location === "path") {
        path = path.replace(`[${p.name}]`, p.defaultValue || "1");
      }
    });

    // Construct dynamic Query String
    const queryParams = new URLSearchParams();
    endpoint.parameters?.forEach((p) => {
      if (p.location === "query") {
        const val = p.defaultValue;
        if (val) {
          queryParams.append(p.name, val);
        }
      }
    });
    const queryString = queryParams.toString();
    const fullUrl = `${baseUrl}${path}${queryString ? `?${queryString}` : ""}`;

    // Construct dynamic Body
    const bodyData: Record<string, any> = {};
    endpoint.parameters?.forEach((p) => {
      if (p.location === "body") {
        const val = p.defaultValue;
        if (val !== undefined && val !== "") {
          if (p.type.includes("number") || p.type.includes("integer")) {
            bodyData[p.name] = Number(val);
          } else {
            bodyData[p.name] = val;
          }
        }
      }
    });
    const hasBody = ["POST", "PUT", "PATCH"].includes(endpoint.method) && Object.keys(bodyData).length > 0;
    const jsonBodyString = JSON.stringify(bodyData, null, 2);

    if (snippetLang === "curl") {
      let cmd = `curl -X ${endpoint.method} "${fullUrl}"`;
      if (hasBody) {
        cmd += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${jsonBodyString}'`;
      }
      return cmd;
    }

    if (snippetLang === "js") {
      let code = `fetch("${fullUrl}", {\n  method: "${endpoint.method}",\n  headers: {\n    "Content-Type": "application/json"\n  }`;
      if (hasBody) {
        code += `,\n  body: JSON.stringify(${jsonBodyString.replace(/\n/g, "\n  ")})`;
      }
      code += `\n})\n  .then(res => res.json())\n  .then(data => console.log(data))\n  .catch(err => console.error(err));`;
      return code;
    }

    if (snippetLang === "python") {
      let code = `import requests\n\nurl = "${fullUrl}"\nheaders = {"Content-Type": "application/json"}\n`;
      if (hasBody) {
        code += `payload = ${JSON.stringify(bodyData, null, 4)}\nresponse = requests.${endpoint.method.toLowerCase()}(url, json=payload, headers=headers)\n`;
      } else {
        code += `response = requests.${endpoint.method.toLowerCase()}(url, headers=headers)\n`;
      }
      code += `print(response.json())`;
      return code;
    }

    return "";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-sppg/40 selection:text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm relative">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 bg-sppg rounded-lg flex items-center justify-center font-bold text-slate-850 shadow-md shadow-sppg/30 border border-sppg/40">
            S
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-950 font-sans">SPPG API Hub</h1>
            <p className="text-xs text-slate-550">LKS Jabar 2026 Developer Space</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="text-sm font-medium text-slate-650 hover:text-slate-950 transition-colors duration-250"
          >
            &larr; SPPG Dashboard
          </Link>
          <span className="h-4 w-px bg-slate-200" />
          <Link
            href="/health"
            className="text-sm font-medium text-slate-650 hover:text-slate-950 transition-colors duration-250"
          >
            Database Console
          </Link>
          <span className="h-4 w-px bg-slate-200" />
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sppg/20 text-slate-800 border border-sppg/30 shadow-sm">
            <span className="h-1.5 w-1.5 bg-slate-600 rounded-full animate-pulse" />
            <span>v1.0.0</span>
          </span>
        </div>
      </header>

      {/* Workspace Area */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-80 border-r border-slate-200 bg-slate-50/50 p-4 space-y-6 flex-shrink-0 overflow-y-auto max-h-[calc(100vh-73px)]">
          {/* Filters Panel */}
          <div className="space-y-4 pb-4 border-b border-slate-200">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search Endpoints</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search path, descriptions..."
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-450 focus:ring-1 focus:ring-slate-300 transition duration-150"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Filter By Mode</label>
              <div className="flex gap-1 bg-slate-200/50 p-1 rounded-lg border border-slate-200 text-xs">
                {["All", "Desktop", "Mobile"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSelectedModeFilter(mode)}
                    className={`flex-1 py-1 px-1.5 rounded-md font-semibold text-center text-[10px] transition-colors duration-150 ${
                      selectedModeFilter === mode
                        ? "bg-white text-slate-800 border border-slate-200 shadow-sm font-bold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Endpoints List grouped by Category */}
          <div className="space-y-5">
            {categoriesList.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No matching endpoints found</p>
            ) : (
              categoriesList.map((cat) => (
                <div key={cat} className="space-y-1.5">
                  <h3 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider px-2">
                    {cat}
                  </h3>
                  <nav className="space-y-1">
                    {categoriesMap[cat].map((ep) => {
                      const isActive = activeEndpoint.id === ep.id;
                      return (
                        <button
                          key={ep.id}
                          onClick={() => {
                            setActiveEndpoint(ep);
                          }}
                          className={`w-full text-left px-2 py-2 rounded-lg text-xs font-medium transition-all duration-150 flex items-center space-x-2 border ${
                            isActive
                              ? "bg-white border-slate-250 text-slate-900 shadow-sm font-semibold"
                              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-200/35"
                          }`}
                        >
                          <span
                            className={`text-[8px] font-bold px-1.5 py-0.5 rounded leading-none w-10 text-center ${
                              ep.method === "GET"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/40"
                                : ep.method === "POST"
                                ? "bg-sky-50 text-sky-700 border border-sky-200/40"
                                : ep.method === "PATCH"
                                ? "bg-indigo-50 text-indigo-700 border border-indigo-200/40"
                                : ep.method === "PUT"
                                ? "bg-amber-50 text-amber-700 border border-amber-200/40"
                                : "bg-rose-50 text-rose-700 border border-rose-200/40"
                            }`}
                          >
                            {ep.method}
                          </span>
                          <span className="truncate flex-1 text-[11px] font-mono">{ep.path}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Content Console */}
        <main className="flex-1 flex flex-col xl:flex-row bg-white overflow-y-auto max-h-[calc(100vh-73px)]">
          {/* Main Info */}
          <div className="flex-1 p-6 md:p-8 space-y-8 max-w-4xl xl:border-r border-slate-200">
            {/* Header info */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-md tracking-wider border ${getMethodBadgeClass(
                    activeEndpoint.method
                  )}`}
                >
                  {activeEndpoint.method}
                </span>
                <span className="text-lg font-mono font-semibold text-slate-800">
                  {activeEndpoint.path}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Roles:</span>
                {activeEndpoint.roles.map((r) => (
                  <span
                    key={r}
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      r === "Petugas"
                        ? "bg-sky-50 text-sky-700 border-sky-200"
                        : r === "Supervisor"
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {r}
                  </span>
                ))}
                
                <span className="text-slate-350 mx-1">|</span>
                
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">App Mode:</span>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                    activeEndpoint.mode === "desktop"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-250"
                      : activeEndpoint.mode === "mobile"
                      ? "bg-pink-50 text-pink-700 border-pink-250"
                      : "bg-indigo-50 text-indigo-700 border-indigo-250"
                  }`}
                >
                  {activeEndpoint.mode === "both"
                    ? "Desktop & Mobile"
                    : activeEndpoint.mode.charAt(0).toUpperCase() + activeEndpoint.mode.slice(1) + " Mode"}
                </span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
                {activeEndpoint.id
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </h2>
              <p className="text-slate-650 leading-relaxed text-sm md:text-base">
                {activeEndpoint.description}
              </p>
            </div>

            <div className="space-y-8">
              {/* Parameters section */}
              {activeEndpoint.parameters && activeEndpoint.parameters.length > 0 ? (
                <div className="space-y-6">
                  <h3 className="text-base font-bold text-slate-950 tracking-tight font-sans">Request Parameters</h3>

                  {/* Path parameters */}
                  {activeEndpoint.parameters.some(p => p.location === "path") && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">Path Parameters</span>
                      </div>
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 shadow-sm">
                        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                          <thead className="bg-slate-100 font-semibold text-slate-700">
                            <tr>
                              <th className="px-4 py-3">Parameter</th>
                              <th className="px-4 py-3">Type</th>
                              <th className="px-4 py-3">Required</th>
                              <th className="px-4 py-3">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 text-slate-600">
                            {activeEndpoint.parameters.filter(p => p.location === "path").map((param) => (
                              <tr key={param.name} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-mono text-indigo-850 font-bold">{param.name}</td>
                                <td className="px-4 py-3 font-mono text-xs">{param.type}</td>
                                <td className="px-4 py-3 text-xs">
                                  <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/50 font-semibold text-[10px]">required</span>
                                </td>
                                <td className="px-4 py-3">{param.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Query parameters */}
                  {activeEndpoint.parameters.some(p => p.location === "query") && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">Query Parameters</span>
                      </div>
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 shadow-sm">
                        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                          <thead className="bg-slate-100 font-semibold text-slate-700">
                            <tr>
                              <th className="px-4 py-3">Parameter</th>
                              <th className="px-4 py-3">Type</th>
                              <th className="px-4 py-3">Required</th>
                              <th className="px-4 py-3">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 text-slate-600">
                            {activeEndpoint.parameters.filter(p => p.location === "query").map((param) => (
                              <tr key={param.name} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-mono text-emerald-850 font-bold">{param.name}</td>
                                <td className="px-4 py-3 font-mono text-xs">{param.type}</td>
                                <td className="px-4 py-3 text-xs">
                                  {param.required ? (
                                    <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/50 font-semibold text-[10px]">required</span>
                                  ) : (
                                    <span className="text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/50 text-[10px]">optional</span>
                                  )}
                                </td>
                                <td className="px-4 py-3">{param.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Request Body parameters */}
                  {activeEndpoint.parameters.some(p => p.location === "body") && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 px-2 py-0.5 rounded border border-sky-200">Request Body</span>
                      </div>
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 shadow-sm">
                        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                          <thead className="bg-slate-100 font-semibold text-slate-700">
                            <tr>
                              <th className="px-4 py-3">Field</th>
                              <th className="px-4 py-3">Type</th>
                              <th className="px-4 py-3">Required</th>
                              <th className="px-4 py-3">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 text-slate-600">
                            {activeEndpoint.parameters.filter(p => p.location === "body").map((param) => (
                              <tr key={param.name} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-mono text-sky-850 font-bold">{param.name}</td>
                                <td className="px-4 py-3 font-mono text-xs">{param.type}</td>
                                <td className="px-4 py-3 text-xs">
                                  {param.required ? (
                                    <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/50 font-semibold text-[10px]">required</span>
                                  ) : (
                                    <span className="text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/50 text-[10px]">optional</span>
                                  )}
                                </td>
                                <td className="px-4 py-3">{param.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-950 tracking-tight font-sans">Request Parameters</h3>
                  <p className="text-sm text-slate-450 italic">No parameters required for this endpoint.</p>
                </div>
              )}

              {/* Responses */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-950 tracking-tight font-sans">Expected Responses</h3>
                <div className="space-y-4">
                  {activeEndpoint.responses.map((resp) => (
                    <div
                      key={resp.status}
                      className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-sm"
                    >
                      <div className="flex items-center justify-between px-4 py-3 bg-slate-100/80 border-b border-slate-200">
                        <div className="flex items-center space-x-2.5">
                          <span
                            className={`text-xs font-bold font-mono px-2 py-0.5 rounded border ${
                              resp.status >= 200 && resp.status < 300
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                                : "bg-rose-50 text-rose-700 border-rose-200/50"
                            }`}
                          >
                            {resp.status}
                          </span>
                          <span className="text-xs text-slate-600 font-semibold">
                            {resp.description}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 overflow-x-auto bg-white">
                        <pre className="text-xs font-mono text-slate-700 leading-relaxed">
                          {resp.body}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Console: Code Snippets Code block */}
          <div className="w-full xl:w-[480px] bg-slate-50/70 p-6 md:p-8 flex flex-col space-y-6 text-slate-800 xl:border-l border-slate-200">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Code Snippet</h3>

              {/* Language toggles */}
              <div className="flex bg-slate-200/50 p-1 rounded-lg border border-slate-200 text-xs">
                {(["curl", "js", "python"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSnippetLang(lang)}
                    className={`flex-1 py-1.5 rounded-md font-semibold text-center transition-colors duration-150 ${
                      snippetLang === lang
                        ? "bg-white text-slate-800 border border-slate-200 shadow-sm font-bold"
                        : "text-slate-500 hover:text-slate-850"
                    }`}
                  >
                    {lang === "curl" ? "cURL" : lang === "js" ? "JavaScript" : "Python"}
                  </button>
                ))}
              </div>

              {/* Console preview */}
              <div className="relative border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
                    {snippetLang} console
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generateSnippet(activeEndpoint));
                    }}
                    className="text-xs text-slate-600 hover:text-slate-850 font-semibold transition-colors focus:outline-none cursor-pointer"
                  >
                    Copy Code
                  </button>
                </div>
                <div className="p-4 overflow-x-auto min-h-[160px] bg-white">
                  <pre className="text-[11px] font-mono text-slate-700 leading-5 whitespace-pre">
                    {generateSnippet(activeEndpoint)}
                  </pre>
                </div>
              </div>
            </div>

            {/* Quick helper notes */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 mt-auto shadow-sm">
              <h4 className="text-xs font-bold text-slate-800">Integration Notes</h4>
              <p className="text-xs text-slate-550 leading-relaxed font-sans">
                Make sure to configure your database pooler in the backend. When calling dynamic URLs,
                swap the path placeholder <code className="text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded font-mono">[id]</code> with the actual record ID in numeric format.
              </p>
              <div className="pt-2">
                <Link
                  href="/health"
                  className="text-xs font-semibold text-slate-750 hover:underline flex items-center space-x-1"
                >
                  <span>Go to Database Console</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
