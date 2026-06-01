import { NextResponse } from "next/server";
import db from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT /api/orders/[id]/status - Update order delivery status (called by Pemasok / Supplier)
export async function PUT(request: Request, { params }: RouteParams) {
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
    const { status } = body;

    if (!status || typeof status !== "string" || status.trim() === "") {
      return NextResponse.json(
        { error: "Bad Request", message: "Status string is required" },
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

    const validStatuses = ["Pending", "Diproses", "Selesai", "Dikirim"];
    const formattedStatus = status.trim();
    if (!validStatuses.includes(formattedStatus)) {
      return NextResponse.json(
        { error: "Bad Request", message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const updatedOrder = await db.supplierOrder.update({
      where: { orderId },
      data: {
        status: formattedStatus,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Status updated successfully",
        order: {
          orderId: updatedOrder.orderId,
          supplierName: updatedOrder.supplierName,
          status: updatedOrder.status,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
