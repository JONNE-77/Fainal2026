import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { z } from 'zod';

// 1. ກໍານົດ Schema ສໍາລັບກວດສອບຂໍ້ມູນ (Validation)
export const employeeSchema = z.object({
  fullname: z.string().min(1),
  position: z.string().min(1),
});

export async function GET() {
    console.log("GET /employee called");
    try {
        const employees = await db.employee.findMany({
          select: {
            employee_id: true,
            fullname: true,
            position: true,
          }
        }).catch((err) => {
            throw new Error(`Database operation failed: ${err.message}`);
        });
        return NextResponse.json({ success: true, data: employees });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

// 3. POST: ບັນທຶກຂໍ້ມູນໃຫມ່ (Create)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Validate ຂໍ້ມູນກ່ອນບັນທຶກ
        const validatedData = employeeSchema.parse(body);
        console.log("BODY:", body);
        console.log("VALIDATED:", validatedData);
        
        const newEmployee = await db.employee.create({
            data: validatedData,
        });
        
        return NextResponse.json({ success: true, data: newEmployee }, {
            status: 201
        });
    } catch (error) {
        console.error(error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                success: false, error: error.flatten()
            }, { status: 400 });
        }
        return NextResponse.json({ success: false, error: "DatabaseError ຫຼື ຂໍ້ມູນຊໍ້າກັນ" }, { status: 500 });
    }
}