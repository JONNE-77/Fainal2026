import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { z } from 'zod';

// ใช้ .preprocess() เพื่อแปลง String จาก JSON เป็น DateTime Object ก่อนส่งให้ Prisma
export const rentalDetailSchema = z.object({
  rental_id: z.number().int(),
  room_id: z.number().int(),
    check_in_date: z.string().transform((str) => new Date(str)),
    check_out_date: z.string().transform((str) => new Date(str)),
});

export async function GET() {
    console.log("GET /rental_detail called");
    try {
        const details = await db.rental_detail.findMany({
          select: {
            rental_id: true,
            room_id: true,
            check_in_date: true,
            check_out_date: true,
            room: { select: { status: true } }
          }
        }).catch((err) => {
            throw new Error(`Database operation failed: ${err.message}`);
        });
        return NextResponse.json({ success: true, data: details });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = rentalDetailSchema.parse(body);
        
        const newDetail = await db.rental_detail.create({
            data: validatedData,
        });
        
        return NextResponse.json({ success: true, data: newDetail }, { status: 201 });
    } catch (error) {
        console.error(error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ success: false, error: error.flatten() }, { status: 400 });
        }
        return NextResponse.json({ success: false, error: "DatabaseError ຫຼື ຂໍ້ມູນຊໍ້າກັນ" }, { status: 500 });
    }
}