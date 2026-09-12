import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { roomTypeSchema } from '@/lib/validations';

// 1. PUT: ແກ້ໄຂປະເພດຫ້ອງພັກ
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body = await request.json();
    const validation = roomTypeSchema.safeParse({
      type_name: body.type_name,
      price: Number(body.price),
    });

    if (!Number.isInteger(id) || !validation.success) {
      return NextResponse.json(
        { error: validation.success ? 'ID ບໍ່ຖືກຕ້ອງ' : validation.error.issues[0]?.message },
        { status: 400 },
      );
    }

    const updated = await prisma.room_type.update({
      where: { type_id: id },
      data: {
        type_name: validation.data.type_name,
        price: validation.data.price,
      },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// 2. DELETE: ລົບປະເພດຫ້ອງພັກ
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    await prisma.room_type.delete({
      where: { type_id: id },
    });

    return NextResponse.json({ message: 'ລົບຂໍ້ມູນ ສຳເລັດ' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}