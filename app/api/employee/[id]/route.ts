import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { employeeSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";

// GET: ດຶງຂໍ້ມູນພະນັກງານຕາມ id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const employee_id = parseInt(id);

    const employee = await db.employee.findUnique({
      where: { employee_id },
      select: { employee_id: true, fullname: true, position: true, username: true },
    });

    if (!employee) {
      return NextResponse.json({ message: "ບໍ່ພົບຂໍ້ມູນພະນັກງານ" }, { status: 404 });
    }

    return NextResponse.json(employee);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching employee", error }, { status: 500 });
  }
}

// PUT: ແກ້ໄຂຂໍ້ມູນພະນັກງານ
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const employee_id = parseInt(id);
    const body = await req.json();

    const validation = employeeSchema.partial().safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ", errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updateData: any = { ...validation.data };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updated = await db.employee.update({
      where: { employee_id },
      data: updateData,
      select: { employee_id: true, fullname: true, position: true, username: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: "Error updating employee", error }, { status: 500 });
  }
}

// DELETE: ລົບພະນັກງານ
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const employee_id = parseInt(id);

    await db.employee.delete({ where: { employee_id } });
    return NextResponse.json({ message: "ລົບຂໍ້ມູນພະນັກງານສຳເລັດ" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting employee", error }, { status: 500 });
  }
}