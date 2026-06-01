import { NextResponse } from "next/server";
import db from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const employeeId = Number(id);

    if (isNaN(employeeId)) {
      return NextResponse.json({ error: "Bad Request", message: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const { employeeName, position, phone, address } = body;

    const item = await db.employee.update({
      where: { employeeId },
      data: {
        ...(employeeName !== undefined && { employeeName: employeeName.trim() }),
        ...(position !== undefined && { position: position.trim() }),
        ...(phone !== undefined && { phone: phone.trim() }),
        ...(address !== undefined && { address: address.trim() }),
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
    const employeeId = Number(id);

    if (isNaN(employeeId)) {
      return NextResponse.json({ error: "Bad Request", message: "Invalid ID" }, { status: 400 });
    }

    await db.employee.delete({ where: { employeeId } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Database error", message: error.message }, { status: 500 });
  }
}
