import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { roomSchema } from "@/lib/validations";

export async function GET() {
  try {
    const rooms = await db.room.findMany({
      include: { room_type: true },
      orderBy: { room_number: "asc" },
    });
    return NextResponse.json(rooms);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching rooms", error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = roomSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ", errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const newRoom = await db.room.create({
      data: {
        room_number: validation.data.room_number,
        type_id: validation.data.type_id,
        status: validation.data.status || "AVAILABLE",
      },
    });

    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating room", error }, { status: 500 });
  }
}