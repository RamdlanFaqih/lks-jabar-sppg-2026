import { NextResponse } from "next/server";
import db from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const needId = Number(id);

    if (isNaN(needId)) {
      return NextResponse.json({ error: "Bad Request", message: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const { needDate, materialId, quantity, notes } = body;

    const existingNeed = await db.kitchenNeed.findUnique({
      where: { needId },
    });

    if (!existingNeed) {
      return NextResponse.json({ error: "Not Found", message: "Kitchen Need record not found" }, { status: 404 });
    }

    let unit = existingNeed.unit;
    if (materialId !== undefined) {
      const mat = await db.rawMaterial.findUnique({
        where: { materialId: Number(materialId) },
      });
      if (mat) unit = mat.unit;
    }

    const item = await db.kitchenNeed.update({
      where: { needId },
      data: {
        ...(needDate !== undefined && { needDate: new Date(needDate) }),
        ...(materialId !== undefined && { materialId: Number(materialId) }),
        ...(quantity !== undefined && { quantity: Number(quantity) }),
        ...(notes !== undefined && { notes: notes?.trim() || null }),
        unit,
      },
    });

    return NextResponse.json(item, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Database error", message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const needId = Number(id);

    if (isNaN(needId)) {
      return NextResponse.json({ error: "Bad Request", message: "Invalid ID" }, { status: 400 });
    }

    await db.kitchenNeed.delete({ where: { needId } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Database error", message: error.message }, { status: 500 });
  }
}
