import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// GET: ດຶງ List ລາຍລະອຽດຫ້ອງທັງໝົດຂອງ rental_id ນັ້ນໆ
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rental_id = parseInt(id);

    const details = await db.rental_detail.findMany({
      where: { rental_id },
      include: {
        room: { include: { room_type: true } },
      },
    });

    return NextResponse.json(details);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching rental detail", error }, { status: 500 });
  }
}

// DELETE: ລົບ 1 ຫ້ອງອອກຈາກ Rental List ( Compound Key delete)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rental_id = parseInt(id);
    const { searchParams } = new URL(req.url);
    const roomIdParam = searchParams.get("roomId");

    if (!roomIdParam) {
      return NextResponse.json({ message: "ກະລຸນາສົ່ງ Query Parameter ?roomId=" }, { status: 400 });
    }

    const room_id = parseInt(roomIdParam);

    await db.$transaction([
      db.rental_detail.delete({
        where: {
          rental_id_room_id: { rental_id, room_id },
        },
      }),
      db.room.update({
        where: { room_id },
        data: { status: "AVAILABLE" },
      }),
    ]);

    return NextResponse.json({ message: "ລົບລາຍລະອຽດການເຊົ່າ ແລະ ຄືນສະຖານະຫ້ອງສຳເລັດ" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting rental detail", error }, { status: 500 });
  }
}