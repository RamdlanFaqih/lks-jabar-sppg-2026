import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const list = await db.rawMaterial.findMany({
      orderBy: { materialId: "desc" },
    });
    return NextResponse.json(list, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Database error", message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { materialName, category, unit, stock, estimatedPrice } = body;

    if (!materialName || !category || !unit) {
      return NextResponse.json({ error: "Bad Request", message: "Name, Category, and Unit are required" }, { status: 400 });
    }

    const item = await db.rawMaterial.create({
      data: {
        materialName: materialName.trim(),
        category: category.trim(),
        unit: unit.trim(),
        stock: Number(stock) || 0.0,
        estimatedPrice: Number(estimatedPrice) || 0.0,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Database error", message: error.message }, { status: 500 });
  }
}
