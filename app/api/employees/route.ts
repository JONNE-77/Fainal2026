import { NextResponse } from 'next/server';
import  prisma  from '@/lib/db';

// 1. GET: ດຶງລາຍຊື່ພະນັກງານທັງໝົດ
export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { employee_id: 'desc' },
    });
    return NextResponse.json(employees);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. POST: ເພີ່ມພະນັກງານໃໝ່ (ບັນທຶກ password ໂດຍົງແບບ Plain Text)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullname, position, username, password } = body;

    if (!fullname || !position || !username || !password) {
      return NextResponse.json({ error: 'ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ' }, { status: 400 });
    }

    const newEmployee = await prisma.employee.create({
      data: {
        fullname,
        position,
        username,
        password, // Plain text ຕາມຕ້ອງການ
      },
    });

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Username ນี้ມີໃນລະບົບແລ້ວ' }, { status: 500 });
  }
}