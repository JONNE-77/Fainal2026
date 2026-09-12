import { NextResponse } from 'next/server';
import  prisma  from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const whereClause: any = {
      status: { not: 'CANCELLED' },
    };

    if (startDate && endDate) {
      whereClause.created_at = {
        gte: new Date(startDate),
        lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      };
    }

    const rentals = await prisma.rental.findMany({
      where: whereClause,
      include: {
        user: { select: { fullname: true, phone: true } },
        employee: { select: { fullname: true } },
        rental_detail: {
          include: { room: { include: { room_type: true } } },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    const totalRevenue = rentals.reduce((sum, item) => sum + Number(item.total_amount), 0);
    const totalRentals = rentals.length;

    return NextResponse.json({
      totals: {
        totalRevenue,
        totalRentals,
      },
      rentals,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}