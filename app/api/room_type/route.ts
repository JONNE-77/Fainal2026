import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { roomTypeSchema } from "@/lib/validations";

export async function GET() {
  try {
    const roomTypes = await db.room_type.findMany({ include: { room: true } });
    return NextResponse.json(roomTypes);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching room types", error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = roomTypeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ", errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const newType = await db.room_type.create({ data: validation.data });
    return NextResponse.json(newType, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating room type", error }, { status: 500 });
  }
}