import { NextResponse } from "next/server";
import db from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const materialId = Number(id);

    if (isNaN(materialId)) {
      return NextResponse.json({ error: "Bad Request", message: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const { materialName, category, unit, stock, estimatedPrice } = body;

    const item = await db.rawMaterial.update({
      where: { materialId },
      data: {
        ...(materialName !== undefined && { materialName: materialName.trim() }),
        ...(category !== undefined && { category: category.trim() }),
        ...(unit !== undefined && { unit: unit.trim() }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(estimatedPrice !== undefined && { estimatedPrice: Number(estimatedPrice) }),
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
    const materialId = Number(id);

    if (isNaN(materialId)) {
      return NextResponse.json({ error: "Bad Request", message: "Invalid ID" }, { status: 400 });
    }

    await db.rawMaterial.delete({ where: { materialId } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Database error", message: error.message }, { status: 500 });
  }
}
