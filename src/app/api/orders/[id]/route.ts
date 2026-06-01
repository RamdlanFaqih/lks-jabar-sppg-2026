import { NextResponse } from "next/server";
import db from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/orders/[id] - Retrieve detailed order with items list
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const orderId = Number(id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: "Bad Request", message: "Invalid order ID" },
        { status: 400 }
      );
    }

    const order = await db.supplierOrder.findUnique({
      where: { orderId },
      include: {
        material: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Not Found", message: "Order not found" },
        { status: 404 }
      );
    }

    const formattedDetail = {
      orderId: order.orderId,
      supplierName: order.supplierName,
      status: order.status,
      items: [
        {
          itemName: order.material.materialName,
          quantity: Number(order.orderQuantity),
          unit: order.unit,
        },
      ],
    };

    return NextResponse.json(formattedDetail, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching order detail:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/orders/[id] - Update order details (called by Petugas SPPG)
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const orderId = Number(id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: "Bad Request", message: "Invalid order ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { supplierName, materialId, orderQuantity, status, notes } = body;

    const existingOrder = await db.supplierOrder.findUnique({
      where: { orderId },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Not Found", message: "Order not found" },
        { status: 404 }
      );
    }

    let unit = existingOrder.unit;
    if (materialId !== undefined) {
      const mat = await db.rawMaterial.findUnique({
        where: { materialId: Number(materialId) },
      });
      if (mat) unit = mat.unit;
    }

    const updatedOrder = await db.supplierOrder.update({
      where: { orderId },
      data: {
        ...(supplierName !== undefined && { supplierName: supplierName.trim() }),
        ...(materialId !== undefined && { materialId: Number(materialId) }),
        ...(orderQuantity !== undefined && { orderQuantity: Number(orderQuantity) }),
        ...(status !== undefined && { status: status.trim() }),
        ...(notes !== undefined && { notes: notes?.trim() || null }),
        unit,
      },
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id] - Delete a supplier order
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const orderId = Number(id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: "Bad Request", message: "Invalid order ID" },
        { status: 400 }
      );
    }

    const existingOrder = await db.supplierOrder.findUnique({
      where: { orderId },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Not Found", message: "Order not found" },
        { status: 404 }
      );
    }

    await db.supplierOrder.delete({
      where: { orderId },
    });

    return NextResponse.json(
      { success: true, message: "Order deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
