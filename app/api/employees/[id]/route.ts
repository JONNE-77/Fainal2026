import { NextResponse } from 'next/server';
import  prisma  from '@/lib/db'; // ຫຼື '@/lib/db' ຕາມທີ່ທ່ານຕັ້ງຊື່ໄວ້

// 1. PUT: ແກ້ໄຂຂໍ້ມູນພະນັກງານ
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body = await request.json();
    const { fullname, position, username, password } = body;

    const dataToUpdate: any = { fullname, position, username };
    if (password) {
      dataToUpdate.password = password; // ປ່ຽນລະຫັດຜ່ານໃໝ່ຖ້າມີການສົ່ງມາ
    }

    const updated = await prisma.employee.update({
      where: { employee_id: id },
      data: dataToUpdate,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. DELETE: ລົບພະນັກງານ
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    await prisma.employee.delete({
      where: { employee_id: id },
    });

    return NextResponse.json({ message: 'ລົບຂໍ້ມູນພະນັກງານສຳເລັດ' });
  } catch (error: any) {
    return NextResponse.json({ error: 'ບໍ່ສາມາດລົບໄດ້ ເນື່ອງຈາກມີປະຫວັດການເຮັດຸລະກຳ' }, { status: 500 });
  }
}