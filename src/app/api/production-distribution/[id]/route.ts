import { NextResponse } from "next/server";
import db from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const processId = Number(id);

    if (isNaN(processId)) {
      return NextResponse.json({ error: "Bad Request", message: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const { processDate, schoolId, portionCount, productionStatus, distributionStatus, notes } = body;

    const existingItem = await db.productionDistribution.findUnique({
      where: { processId },
    });

    if (!existingItem) {
      return NextResponse.json({ error: "Not Found", message: "Record not found" }, { status: 404 });
    }

    const item = await db.productionDistribution.update({
      where: { processId },
      data: {
        ...(processDate !== undefined && { processDate: new Date(processDate) }),
        ...(schoolId !== undefined && { schoolId: Number(schoolId) }),
        ...(portionCount !== undefined && { portionCount: Number(portionCount) }),
        ...(productionStatus !== undefined && { productionStatus: productionStatus.trim() }),
        ...(distributionStatus !== undefined && { distributionStatus: distributionStatus.trim() }),
        ...(notes !== undefined && { notes: notes?.trim() || null }),
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
    const processId = Number(id);

    if (isNaN(processId)) {
      return NextResponse.json({ error: "Bad Request", message: "Invalid ID" }, { status: 400 });
    }

    await db.productionDistribution.delete({ where: { processId } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Database error", message: error.message }, { status: 500 });
  }
}
