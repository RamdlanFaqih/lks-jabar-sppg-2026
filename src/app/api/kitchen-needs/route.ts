import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const list = await db.kitchenNeed.findMany({
      orderBy: { needId: "desc" },
      include: {
        material: true,
      },
    });
    return NextResponse.json(list, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Database error", message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { needDate, materialId, quantity, notes } = body;

    if (!needDate || !materialId || !quantity) {
      return NextResponse.json({ error: "Bad Request", message: "Date, Material, and Quantity are required" }, { status: 400 });
    }

    // Resolve unit from material
    const material = await db.rawMaterial.findUnique({
      where: { materialId: Number(materialId) },
    });

    if (!material) {
      return NextResponse.json({ error: "Not Found", message: "Raw material not found" }, { status: 404 });
    }

    const item = await db.kitchenNeed.create({
      data: {
        needDate: new Date(needDate),
        materialId: Number(materialId),
        quantity: Number(quantity),
        unit: material.unit,
        notes: notes?.trim() || null,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Database error", message: error.message }, { status: 500 });
  }
}
