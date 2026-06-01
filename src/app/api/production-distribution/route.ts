import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const list = await db.productionDistribution.findMany({
      orderBy: { processId: "desc" },
      include: {
        school: true,
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
    const { processDate, schoolId, portionCount, productionStatus, distributionStatus, notes } = body;

    if (!processDate || !schoolId || !portionCount || !productionStatus || !distributionStatus) {
      return NextResponse.json(
        { error: "Bad Request", message: "Date, School, Portions, Production Status, and Distribution Status are required" },
        { status: 400 }
      );
    }

    const school = await db.school.findUnique({
      where: { schoolId: Number(schoolId) },
    });

    if (!school) {
      return NextResponse.json({ error: "Not Found", message: "School not found" }, { status: 404 });
    }

    const item = await db.productionDistribution.create({
      data: {
        processDate: new Date(processDate),
        schoolId: Number(schoolId),
        portionCount: Number(portionCount),
        productionStatus: productionStatus.trim(),
        distributionStatus: distributionStatus.trim(),
        notes: notes?.trim() || null,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Database error", message: error.message }, { status: 500 });
  }
}
