import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const list = await db.employee.findMany({
      orderBy: { employeeId: "desc" },
    });
    return NextResponse.json(list, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Database error", message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { employeeName, position, phone, address } = body;

    if (!employeeName || !position) {
      return NextResponse.json({ error: "Bad Request", message: "Name and Position are required" }, { status: 400 });
    }

    const item = await db.employee.create({
      data: {
        employeeName: employeeName.trim(),
        position: position.trim(),
        phone: phone?.trim() || "",
        address: address?.trim() || "",
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Database error", message: error.message }, { status: 500 });
  }
}
