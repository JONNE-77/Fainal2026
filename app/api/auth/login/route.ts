import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { loginSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "guesthouse-secret-key";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ", errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { username, password } = validation.data;

    const employee = await db.employee.findUnique({ where: { username } });
    if (!employee) {
      return NextResponse.json({ message: "Username ຫຼື Password ບໍ່ຖືກຕ້ອງ" }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, employee.password);
    if (!isValidPassword) {
      return NextResponse.json({ message: "Username ຫຼື Password ບໍ່ຖືກຕ້ອງ" }, { status: 401 });
    }

    // ສ້າງ JWT Token
    const token = jwt.sign(
      { employee_id: employee.employee_id, username: employee.username, position: employee.position },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return NextResponse.json({
      message: "ເຂົ້າສູ່ລະບົບສຳເລັດ",
      token,
      employee: {
        employee_id: employee.employee_id,
        fullname: employee.fullname,
        position: employee.position,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: "Error logging in", error }, { status: 500 });
  }
}