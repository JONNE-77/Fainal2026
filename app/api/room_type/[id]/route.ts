import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { roomTypeSchema } from "@/lib/validations";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const type_id = parseInt(id);
    const body = await req.json();

    const validation = roomTypeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ", errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await db.room_type.update({ where: { type_id }, data: validation.data });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: "Error updating room type", error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const type_id = parseInt(id);

    await db.room_type.delete({ where: { type_id } });
    return NextResponse.json({ message: "ລົບປະເພດຫ້ອງສຳເລັດ" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting room type", error }, { status: 500 });
  }
}