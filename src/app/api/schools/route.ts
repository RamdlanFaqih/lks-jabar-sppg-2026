import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const list = await db.school.findMany({
      orderBy: { schoolId: "desc" },
    });
    return NextResponse.json(list, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Database error", message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { schoolName, address, picName, picPhone, studentCount } = body;

    if (!schoolName || !address) {
      return NextResponse.json({ error: "Bad Request", message: "Name and Address are required" }, { status: 400 });
    }

    const item = await db.school.create({
      data: {
        schoolName: schoolName.trim(),
        address: address.trim(),
        picName: picName?.trim() || "",
        picPhone: picPhone?.trim() || "",
        studentCount: Number(studentCount) || 0,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Database error", message: error.message }, { status: 500 });
  }
}
