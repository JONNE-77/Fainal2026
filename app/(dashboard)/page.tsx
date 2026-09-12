'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowUpRight,
  BedDouble,
  CalendarDays,
  ClipboardList,
  DoorOpen,
  RefreshCw,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';

interface RoomType {
  type_id: number;
  type_name: string;
  price: number | string;
  _count?: {
    room: number;
  };
}

interface RecentRental {
  rental_id: number;
  customer_name: string | null;
  total_amount: number | string;
  created_at: string;
  status: string;
  user?: {
    fullname: string;
    phone: string;
  } | null;
  rental_detail?: {
    check_in_date?: string;
    check_out_date?: string;
    room?: {
      room_number: string;
    };
  }[];
}

interface RevenueChartItem {
  date: string;
  label: string;
  revenue: number;
}

interface DashboardData {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  reservedRooms: number;
  maintenanceRooms: number;
  totalCustomers: number;
  totalRentals: number;
  totalRevenue: number;
  monthlyRevenue: number;
  revenueChart: RevenueChartItem[];
  roomTypes: RoomType[];
  recentRentals: RecentRental[];
}

const formatMoney = (value: number | string) =>
  `${Number(value).toLocaleString('en-US')} ₭`;

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass,
  trend,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  iconClass: string;
  trend?: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500">{title}</p>

          <h2 className="mt-2 text-2xl xl:text-3xl font-extrabold text-slate-900">
            {value}
          </h2>
        </div>

        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconClass}`}
        >
          <Icon size={22} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">{subtitle}</span>

        {trend && (
          <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
            <TrendingUp size={13} />
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

function StatusBar({
  name,
  value,
  total,
  color,
}: {
  name: string;
  value: number;
  total: number;
  color: string;
}) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs font-medium text-slate-600">{name}</span>
        </div>

        <span className="text-xs font-bold text-slate-800">
          {value} ({percent}%)
        </span>
      </div>

      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${percent}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/dashboard', {
        cache: 'no-store',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to load dashboard');
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <RefreshCw className="animate-spin" size={20} />
          ກຳລັງໂຫຼດ Dashboard...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white border border-red-200 rounded-2xl p-8 text-center">
        <p className="text-red-500 font-semibold">
          ເກີດຂໍ້ຜິດພາດ: {error || 'No data'}
        </p>

        <button
          onClick={loadDashboard}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
        >
          ລອງໃໝ່
        </button>
      </div>
    );
  }

  const occupancyTotal =
    data.occupiedRooms +
    data.availableRooms +
    data.reservedRooms +
    data.maintenanceRooms;

  const occupiedPercent =
    data.totalRooms > 0
      ? Math.round((data.occupiedRooms / data.totalRooms) * 100)
      : 0;

  const chart = data.revenueChart || [];
  const maxRevenue = Math.max(...chart.map((item) => item.revenue), 1);

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl xl:text-3xl font-extrabold text-slate-900">
              Dashboard
            </h1>

            <span className="text-2xl"></span>
          </div>

          <p className="text-sm text-slate-500 mt-1">
            ຍິນດີຕ້ອນຮັບກັບຄືນສູ່ລະບົບຈັດການບ້ານພັກ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600">
            <CalendarDays size={15} />
            {new Date().toLocaleDateString('en-GB', {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </div>

          <button
            onClick={loadDashboard}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard
          title="Total Rooms"
          value={data.totalRooms}
          subtitle="ຫ້ອງທັງໝົດໃນລະບົບ"
          icon={BedDouble}
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Available Rooms"
          value={data.availableRooms}
          subtitle="ພ້ອມໃຫ້ລູກຄ້າເຂົ້າພັກ"
          icon={DoorOpen}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Occupied Rooms"
          value={data.occupiedRooms}
          subtitle="ກຳລັງມີຜູ້ເຂົ້າພັກ"
          icon={BedDouble}
          iconClass="bg-blue-50 text-blue-600"
          trend={`${occupiedPercent}%`}
        />

        <StatCard
          title="Total Customers"
          value={data.totalCustomers}
          subtitle="ລູກຄ້າທັງໝົດ"
          icon={Users}
          iconClass="bg-violet-50 text-violet-600"
        />

        <StatCard
          title="Monthly Revenue"
          value={formatMoney(data.monthlyRevenue)}
          subtitle="ລາຍຮັບເດືອນນີ້"
          icon={Wallet}
          iconClass="bg-cyan-50 text-cyan-600"
        />
      </div>

      {/* REVENUE + OCCUPANCY */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* REVENUE */}
        <section className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <TrendingUp size={19} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Revenue Overview
                </h2>
                <p className="text-[11px] text-slate-400">
                  ລາຍຮັບໃນ 30 ວັນຜ່ານມາ
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
              30 Days
            </span>
          </div>

          <div className="h-64 flex items-end gap-1 sm:gap-2 border-b border-l border-slate-100 px-3 pb-0">
            {chart.map((item, index) => {
              const height = Math.max(
                item.revenue > 0 ? (item.revenue / maxRevenue) * 90 : 2,
                2,
              );

              return (
                <div
                  key={`${item.date}-${index}`}
                  className="flex-1 h-full flex items-end group relative"
                >
                  <div
                    className="w-full bg-blue-500/80 hover:bg-blue-600 rounded-t-sm transition-all"
                    style={{ height: `${height}%` }}
                    title={`${item.label}: ${formatMoney(item.revenue)}`}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-between mt-3 text-[10px] text-slate-400">
            <span>{chart[0]?.label || '-'}</span>
            <span>{chart[Math.floor(chart.length / 2)]?.label || '-'}</span>
            <span>{chart[chart.length - 1]?.label || '-'}</span>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between">
            <div>
              <p className="text-[11px] text-slate-400">
                ລາຍຮັບລວມທັງໝົດ
              </p>
              <p className="text-lg font-extrabold text-slate-900">
                {formatMoney(data.totalRevenue)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[11px] text-slate-400">ເດືອນນີ້</p>
              <p className="text-lg font-extrabold text-emerald-600">
                {formatMoney(data.monthlyRevenue)}
              </p>
            </div>
          </div>
        </section>

        {/* OCCUPANCY */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Activity size={19} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Room Occupancy
              </h2>
              <p className="text-[11px] text-slate-400">
                ສະຖານະຫ້ອງພັກ
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center mb-7">
            <div
              className="relative w-36 h-36 rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(
                  #2563eb 0 ${data.occupiedRooms / Math.max(occupancyTotal, 1) * 100}%,
                  #10b981 ${data.occupiedRooms / Math.max(occupancyTotal, 1) * 100}% ${(data.occupiedRooms + data.availableRooms) / Math.max(occupancyTotal, 1) * 100}%,
                  #f59e0b ${(data.occupiedRooms + data.availableRooms) / Math.max(occupancyTotal, 1) * 100}% ${(data.occupiedRooms + data.availableRooms + data.reservedRooms) / Math.max(occupancyTotal, 1) * 100}%,
                  #ef4444 ${(data.occupiedRooms + data.availableRooms + data.reservedRooms) / Math.max(occupancyTotal, 1) * 100}% 100%
                )`,
              }}
            >
              <div className="w-24 h-24 rounded-full bg-white flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-slate-900">
                  {occupiedPercent}%
                </span>
                <span className="text-[10px] text-slate-400">
                  Occupied
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <StatusBar
              name="Occupied"
              value={data.occupiedRooms}
              total={data.totalRooms}
              color="#2563eb"
            />

            <StatusBar
              name="Available"
              value={data.availableRooms}
              total={data.totalRooms}
              color="#10b981"
            />

            <StatusBar
              name="Reserved"
              value={data.reservedRooms}
              total={data.totalRooms}
              color="#f59e0b"
            />

            <StatusBar
              name="Maintenance"
              value={data.maintenanceRooms}
              total={data.totalRooms}
              color="#ef4444"
            />
          </div>
        </section>
      </div>

      {/* ROOM TYPES */}
      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-slate-900">Room Types</h2>
            <p className="text-[11px] text-slate-400">
              ປະເພດຫ້ອງທີ່ມີຢູ່ໃນລະບົບ
            </p>
          </div>

          <Link
            href="/room_types"
            className="text-xs font-semibold text-blue-600 flex items-center gap-1 hover:underline"
          >
            View all <ArrowUpRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.roomTypes.map((type) => (
            <div
              key={type.type_id}
              className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BedDouble size={19} />
                </div>

                <span className="text-xs font-bold text-slate-700">
                  {type._count?.room || 0} ຫ້ອງ
                </span>
              </div>

              <h3 className="mt-4 font-bold text-slate-800">
                {type.type_name}
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                {formatMoney(type.price)} / ຄືນ
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* RECENT RENTALS + QUICK ACTIONS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* RECENT RENTALS */}
        <section className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <ClipboardList size={19} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Recent Rentals
                </h2>
                <p className="text-[11px] text-slate-400">
                  ການເຊົ່າລ່າສຸດ
                </p>
              </div>
            </div>

            <Link
              href="/rentals"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[760px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500">
                  <th className="text-left px-4 py-3 font-semibold">#</th>
                  <th className="text-left px-4 py-3 font-semibold">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3 font-semibold">
                    Phone
                  </th>
                  <th className="text-left px-4 py-3 font-semibold">
                    Room
                  </th>
                  <th className="text-left px-4 py-3 font-semibold">
                    Check-in
                  </th>
                  <th className="text-left px-4 py-3 font-semibold">
                    Amount
                  </th>
                  <th className="text-left px-4 py-3 font-semibold">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.recentRentals.map((rental) => {
                  const customer =
                    rental.user?.fullname ||
                    rental.customer_name ||
                    'ບໍ່ມີຊື່';

                  const phone = rental.user?.phone || '-';

                  const room =
                    rental.rental_detail?.[0]?.room?.room_number || '-';

                  const statusClass =
                    rental.status === 'CANCELLED'
                      ? 'bg-red-50 text-red-600'
                      : rental.status === 'CHECKED_OUT'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-blue-50 text-blue-600';

                  return (
                    <tr
                      key={rental.rental_id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-4 py-3 font-bold text-blue-600">
                        R{String(rental.rental_id).padStart(3, '0')}
                      </td>

                      <td className="px-4 py-3 font-medium text-slate-700">
                        {customer}
                      </td>

                      <td className="px-4 py-3 text-slate-500">
                        {phone}
                      </td>

                      <td className="px-4 py-3 font-semibold text-slate-700">
                        {room}
                      </td>

                      <td className="px-4 py-3 text-slate-500">
                        {rental.rental_detail?.[0]?.check_in_date
                          ? formatDate(
                              rental.rental_detail[0].check_in_date,
                            )
                          : formatDate(rental.created_at)}
                      </td>

                      <td className="px-4 py-3 font-semibold text-slate-700">
                        {formatMoney(rental.total_amount)}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusClass}`}
                        >
                          {rental.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
              <ArrowUpRight size={19} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Quick Actions
              </h2>

              <p className="text-[11px] text-slate-400">
                ເມນູທີ່ໃຊ້ງານເລື້ອຍໆ
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/rentals"
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ClipboardList size={18} />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    New Rental
                  </p>
                  <p className="text-[10px] text-slate-400">
                    ສ້າງລາຍການເຊົ່າໃໝ່
                  </p>
                </div>
              </div>

              <ArrowUpRight size={15} className="text-slate-400" />
            </Link>

            <Link
              href="/customers"
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users size={18} />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Add Customer
                  </p>
                  <p className="text-[10px] text-slate-400">
                    ເພີ່ມລູກຄ້າໃໝ່
                  </p>
                </div>
              </div>

              <ArrowUpRight size={15} className="text-slate-400" />
            </Link>

            <Link
              href="/rooms"
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50/40 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                  <BedDouble size={18} />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Add Room
                  </p>
                  <p className="text-[10px] text-slate-400">
                    ເພີ່ມຫ້ອງພັກ
                  </p>
                </div>
              </div>

              <ArrowUpRight size={15} className="text-slate-400" />
            </Link>

            <Link
              href="/reports"
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Wallet size={18} />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    View Reports
                  </p>
                  <p className="text-[10px] text-slate-400">
                    ເບິ່ງລາຍງານລາຍຮັບ
                  </p>
                </div>
              </div>

              <ArrowUpRight size={15} className="text-slate-400" />
            </Link>
          </div>

          <div className="mt-5 p-4 rounded-xl bg-slate-50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Total Rentals
              </span>
              <span className="text-lg font-extrabold text-slate-900">
                {data.totalRentals}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}