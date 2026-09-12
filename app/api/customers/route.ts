import { NextResponse } from 'next/server';
import  prisma  from '@/lib/db';

// 1. GET: ດຶງລາຍຊື່ລູກຄ້າທັງໝົດ
export async function GET() {
  try {
    const customers = await prisma.user.findMany({
      include: {
        _count: {
          select: { rental: true },
        },
      },
      orderBy: { user_id: 'desc' },
    });
    return NextResponse.json(customers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. POST: ເພີ່ມລູກຄ້າໃໝ່ (ບັນທຶກ password ໂດຍົງ)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullname, phone, password } = body;

    if (!fullname || !phone || !password) {
      return NextResponse.json({ error: 'ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ' }, { status: 400 });
    }

    const newCustomer = await prisma.user.create({
      data: {
        fullname,
        phone,
        password, // ບັນທຶກ Plain Text ຕາມທີ່ຕ້ອງການ
      },
    });

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'ເບີໂທນີ້ອາດຈະມີໃນລະບົບແລ້ວ' }, { status: 500 });
  }
}