import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// PUT: ອັບເດດ status ການເຊົ່າ (ເຊັ່ນ CHECKED_OUT)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rental_id = parseInt(id);
    const body = await req.json();
    const { status } = body;

    const result = await db.$transaction(async (tx) => {
      const updatedRental = await tx.rental.update({
        where: { rental_id },
        data: { status },
        include: { rental_detail: true },
      });

      // ຖ້າ Check-out ໃຫ້ປ່ຽນ status ຫ້ອງເປັນ CLEANING
      if (status === "CHECKED_OUT") {
        for (const detail of updatedRental.rental_detail) {
          await tx.room.update({
            where: { room_id: detail.room_id },
            data: { status: "CLEANING" },
          });
        }
      }

      return updatedRental;
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ message: "Error updating rental", error }, { status: 500 });
  }
}