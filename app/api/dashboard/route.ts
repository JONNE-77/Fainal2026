import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const totalRooms = await prisma.room.count();
    const availableRooms = await prisma.room.count({ where: { status: 'AVAILABLE' } });
    const occupiedRooms = await prisma.room.count({ where: { status: 'OCCUPIED' } });
    const reservedRooms = await prisma.room.count({ where: { status: 'RESERVED' } });
    const maintenanceRooms = await prisma.room.count({ where: { status: 'MAINTENANCE' } });

    const totalCustomers = await prisma.user.count();
    const totalRentals = await prisma.rental.count();
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    const roomTypes = await prisma.room_type.findMany({
      orderBy: { type_id: 'asc' },
      include: { _count: { select: { room: true } } },
    });

    const rentals = await prisma.rental.findMany({
      where: { status: { not: 'CANCELLED' } },
      select: { total_amount: true, created_at: true },
    });

    const monthlyRentals = await prisma.rental.findMany({
      where: {
        status: { not: 'CANCELLED' },
        created_at: { gte: startOfMonth },
      },
      select: { total_amount: true },
    });

    const chartRentals = await prisma.rental.findMany({
      where: {
        status: { not: 'CANCELLED' },
        created_at: { gte: thirtyDaysAgo },
      },
      select: { total_amount: true, created_at: true },
      orderBy: { created_at: 'asc' },
    });

    const revenueByDate = new Map<string, number>();
    for (let index = 0; index < 30; index += 1) {
      const date = new Date(thirtyDaysAgo);
      date.setDate(thirtyDaysAgo.getDate() + index);
      revenueByDate.set(date.toISOString().slice(0, 10), 0);
    }

    for (const rental of chartRentals) {
      const dateKey = rental.created_at.toISOString().slice(0, 10);
      revenueByDate.set(
        dateKey,
        (revenueByDate.get(dateKey) || 0) + Number(rental.total_amount),
      );
    }

    const revenueChart = Array.from(revenueByDate, ([date, revenue]) => ({
      date,
      label: new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      revenue,
    }));

    const occupancy = [
      { name: 'Occupied', value: occupiedRooms, color: '#2563eb' },
      { name: 'Available', value: availableRooms, color: '#10b981' },
      { name: 'Reserved', value: reservedRooms, color: '#f59e0b' },
      { name: 'Maintenance', value: maintenanceRooms, color: '#ef4444' },
    ];

    const totalRevenue = rentals.reduce((sum, item) => sum + Number(item.total_amount), 0);
    const monthlyRevenue = monthlyRentals.reduce(
      (sum, item) => sum + Number(item.total_amount),
      0,
    );

    const recentRentals = await prisma.rental.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        user: { select: { fullname: true, phone: true } },
        rental_detail: {
          take: 1,
          select: {
            check_in_date: true,
            check_out_date: true,
            room: { select: { room_number: true } },
          },
        },
      },
    });

    return NextResponse.json({
      totalRooms,
      availableRooms,
      occupiedRooms,
      reservedRooms,
      maintenanceRooms,
      totalCustomers,
      totalRentals,
      totalRevenue,
      monthlyRevenue,
      revenueChart,
      occupancy,
      roomTypes,
      recentRentals,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}