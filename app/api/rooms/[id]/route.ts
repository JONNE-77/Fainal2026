import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { roomSchema } from "@/lib/validations";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const room_id = parseInt(id);
    const body = await req.json();

    const validation = roomSchema.partial().safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ", errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updatedRoom = await db.room.update({
      where: { room_id },
      data: validation.data,
    });

    return NextResponse.json(updatedRoom);
  } catch (error) {
    return NextResponse.json({ message: "Error updating room", error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const room_id = parseInt(id);

    await db.room.delete({ where: { room_id } });
    return NextResponse.json({ message: "ລົບຂໍ້ມູນຫ້ອງສຳເລັດ" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting room", error }, { status: 500 });
  }
}