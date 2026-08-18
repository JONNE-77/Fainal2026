import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { employeeSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = employeeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ", errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { fullname, position, username, password } = validation.data;

    // ເຊັກ Username ຊໍ້າກັນ
    const existing = await db.employee.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json({ message: "Username ນີ້ມີໃນລະບົບແລ້ວ" }, { status: 400 });
    }

    // Encrypt password ດ້ວຍ bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await db.employee.create({
      data: { fullname, position, username, password: hashedPassword },
      select: { employee_id: true, fullname: true, position: true, username: true },
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error registering employee", error }, { status: 500 });
  }
}