import { NextResponse } from "next/server";
import db from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const schoolId = Number(id);

    if (isNaN(schoolId)) {
      return NextResponse.json({ error: "Bad Request", message: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const { schoolName, address, picName, picPhone, studentCount } = body;

    const item = await db.school.update({
      where: { schoolId },
      data: {
        ...(schoolName !== undefined && { schoolName: schoolName.trim() }),
        ...(address !== undefined && { address: address.trim() }),
        ...(picName !== undefined && { picName: picName.trim() }),
        ...(picPhone !== undefined && { picPhone: picPhone.trim() }),
        ...(studentCount !== undefined && { studentCount: Number(studentCount) }),
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
    const schoolId = Number(id);

    if (isNaN(schoolId)) {
      return NextResponse.json({ error: "Bad Request", message: "Invalid ID" }, { status: 400 });
    }

    await db.school.delete({ where: { schoolId } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Database error", message: error.message }, { status: 500 });
  }
}
