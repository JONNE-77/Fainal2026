import { NextResponse } from 'next/server';
import  prisma  from '@/lib/db';

// 1. PUT: ແກ້ໄຂຂໍ້ມູນລູກຄ້າ
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body = await request.json();
    const { fullname, phone } = body;

    const updated = await prisma.user.update({
      where: { user_id: id },
      data: { fullname, phone },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. DELETE: ລົບລູກຄ້າ
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    await prisma.user.delete({
      where: { user_id: id },
    });

    return NextResponse.json({ message: 'ລົບຂໍ້ມູນລູກຄ້າສຳເລັດ' });
  } catch (error: any) {
    return NextResponse.json({ error: 'ບໍ່ສາມາດລົບໄດ້ ເນື່ອງຈາກມີປະຫວັດການເຊົ່າ' }, { status: 500 });
  }
}