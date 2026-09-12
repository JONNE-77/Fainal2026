import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { roomTypeSchema } from '@/lib/validations';

// 1. GET: ດຶງປະເພດຫ້ອງພັກທັງໝົດ
export async function GET() {
  try {
    const roomTypes = await prisma.room_type.findMany({
      orderBy: { type_id: 'desc' },
      include: {
        _count: {
          select: { room: true },
        },
      },
    });
    return NextResponse.json(roomTypes);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// 2. POST: ເພີ່ມປະເພດຫ້ອງພັກໃໝ່
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = roomTypeSchema.safeParse({
      type_name: body.type_name,
      price: Number(body.price),
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message ?? 'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ' },
        { status: 400 },
      );
    }

    const newRoomType = await prisma.room_type.create({
      data: {
        type_name: validation.data.type_name,
        price: validation.data.price,
      },
    });

    return NextResponse.json(newRoomType, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}