import { NextResponse } from "next/server";
import  db  from "@/lib/db";

// GET: ດຶງຂໍ້ມູນລູກຄ້າ
export async function GET() {
  try {
    const customers = await db.user.findMany({
      orderBy: { user_id: "desc" },
    });
    return NextResponse.json(customers);
  } catch (error) {
    console.error("❌ GET Customers Error:", error);
    return NextResponse.json(
      { message: "ບໍ່ສາມາດດຶງຂໍ້ມູນລູກຄ້າໄດ້" },
      { status: 500 }
    );
  }
}

// POST: ເພີ່ມລູກຄ້າ (ປັບໃຫ້ຕົງກັບ Model)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullname, phone, password } = body;

    const newCustomer = await db.user.create({
      data: {
        fullname,
        phone,
        password,
      },
    });

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error("❌ POST Customer Error:", error);
    return NextResponse.json(
      { message: "ບໍ່ສາມາດເພີ່ມຂໍ້ມູນລູກຄ້າໄດ້ (ເບີໂທນີ້ອາດມີໃນລະບົບແລ້ວ)" },
      { status: 500 }
    );
  }
}