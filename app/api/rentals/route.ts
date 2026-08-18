import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { createRentalSchema } from "@/lib/validations";

// 1. GET: ດຶງຂໍ້ມູນປະວັດການເຊົ່າທັງໝົດ
export async function GET() {
  try {
    const rentals = await db.rental.findMany({
      include: {
        user: true, // ດຶງຂໍ້ມູນ user Account (ຖ້າມີ)
        employee: { select: { employee_id: true, fullname: true } }, // ດຶງຊື່ພະນັກງານ
        rental_detail: { 
          include: { 
            room: { include: { room_type: true } } // ດຶງຂໍ້ມູນຫ້ອງ ແລະ ປະເພດຫ້ອງ
          } 
        },
      },
      orderBy: { created_at: "desc" }, // ຈັດລຽງຕາມວັນທີລ້າສຸດ
    });

    return NextResponse.json(rentals);
  } catch (error) {
    return NextResponse.json(
      { message: "ບໍ່ສາມາດດຶງຂໍ້ມູນການເຊົ່າໄດ້" },
      { status: 500 }
    );
  }
}

// 2. POST: ບັນທຶກການ Check-in (ໃຊ້ Transaction)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 2.1 ກວດສອບຄວາມຖືກຕ້ອງຂອງຂໍ້ມູນຜ່ານ Schema
    const validation = createRentalSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ", 
          errors: validation.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    // ດຶງ customer_name ແລະ phone ເພີ່ມເຕີມຈາກ validation
    const { customer_name, phone, user_id, employee_id, total_amount, rooms } = validation.data;

    // 2.2 ທຳງານແບບ Database Transaction
    const transactionResult = await db.$transaction(async (tx) => {
      
      // ບາດກ້າວທີ 1: ສ້າງຂໍ້ມູນການເຊົ່າຫຼັກ (Rental Master) ພ້ອມຂໍ້ມູນລູກຄ້າ
      const rental = await tx.rental.create({
        data: {
          customer_name, // 👈 ບັນທຶກຊື່-ນາມສະກຸນລູກຄ້າ
          phone,         // 👈 ບັນທຶກເບີໂທ
          user_id: user_id || null,
          employee_id,
          total_amount,
          status: "CHECKED_IN",
        },
      });

      // ບາດກ້າວທີ 2: ວົນ Loop ບັນທຶກລາຍລະອຽດຫ້ອງ + ອັບເດດສະຖານະຫ້ອງ
      for (const item of rooms) {
        // ກວດສອບສະຖານະຫ້ອງພັກກ່ອນ
        const targetRoom = await tx.room.findUnique({ 
          where: { room_id: item.room_id } 
        });

        if (!targetRoom || targetRoom.status !== "AVAILABLE") {
          throw new Error(`ຫ້ອງ ID ${item.room_id} ບໍ່ຫວ່າງ`);
        }

        // ບັນທຶກລາຍລະອຽດ (Rental Detail)
        await tx.rental_detail.create({
          data: {
            rental_id: rental.rental_id,
            room_id: item.room_id,
            check_in_date: new Date(item.check_in_date),
            check_out_date: new Date(item.check_out_date),
          },
        });

        // ປ່ຽນສະຖານະຫ້ອງໃຫ້ເປັນ "OCCUPIED" (ມີຄົນພັກ)
        await tx.room.update({
          where: { room_id: item.room_id },
          data: { status: "OCCUPIED" },
        });
      }

      return rental;
    });

    return NextResponse.json(transactionResult, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ" },
      { status: 400 }
    );
  }
}