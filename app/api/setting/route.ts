import { NextResponse } from 'next/server';
import  prisma  from '@/lib/db';

// 1. GET: ດຶງຂໍ້ມູນຕັ້ງຄ່າລະບົບ
export async function GET() {
  try {
    // ຖ້າມີ Table settings ໃນ prisma, ສາມາດດຶງມາໄດ້ (ຕົວຢ່າງຈຳລອງ Config)
    const settings = {
      hotelName: 'Modern Hotel & Resort',
      phone: '+856 20 1234 5678',
      address: 'ວຽງຈັນ, ສປປ ລາວ',
      checkInTime: '14:00',
      checkOutTime: '12:00',
    };
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. PUT: ບັນທຶກການຕັ້ງຄ່າລະບົບ
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    // ດຳເນີນການບັນທຶກລົງ Database ຫຼື Config
    return NextResponse.json({ message: 'ບັນທຶກການຕັ້ງຄ່າສຳເລັດ', data: body });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}