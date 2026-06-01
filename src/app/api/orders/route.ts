import { NextResponse } from "next/server";
import db from "@/lib/db";

// GET /api/orders - Retrieve all supplier orders formatted for LKS API spec
export async function GET() {
  try {
    const orders = await db.supplierOrder.findMany({
      orderBy: {
        orderId: "desc",
      },
      include: {
        material: true,
      },
    });

    const formattedOrders = orders.map((order) => ({
      orderId: order.orderId,
      supplierName: order.supplierName,
      orderDate: order.orderDate.toISOString().split("T")[0],
      status: order.status,
      materialId: order.materialId,
      orderQuantity: order.orderQuantity,
      unit: order.unit,
      notes: order.notes,
      material: {
        materialId: order.material.materialId,
        materialName: order.material.materialName,
        category: order.material.category,
        unit: order.material.unit,
      },
    }));

    return NextResponse.json(formattedOrders, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders", message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new supplier order (called by Petugas SPPG)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { supplierName, materialId, orderQuantity, notes } = body;

    if (!supplierName || !materialId || !orderQuantity) {
      return NextResponse.json(
        { error: "Bad Request", message: "supplierName, materialId, and orderQuantity are required" },
        { status: 400 }
      );
    }

    // Resolve unit from material
    const material = await db.rawMaterial.findUnique({
      where: { materialId: Number(materialId) },
    });

    if (!material) {
      return NextResponse.json(
        { error: "Not Found", message: "Raw material not found" },
        { status: 404 }
      );
    }

    const newOrder = await db.supplierOrder.create({
      data: {
        orderDate: new Date(),
        supplierName: supplierName.trim(),
        materialId: Number(materialId),
        orderQuantity: Number(orderQuantity),
        unit: material.unit,
        status: "Pending",
        notes: notes?.trim() || null,
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
