'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  BedDouble,
  CalendarDays,
  CheckCircle2,
  Clock3,
  DoorOpen,
  LogOut,
  Phone,
  RefreshCw,
  Search,
  User,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: 'ຫວ່າງ',
  OCCUPIED: 'ມີຄົນພັກ',
  CLEANING: 'ອະນາໄມ',
  MAINTENANCE: 'ປັບປຸງ',
};

interface Room {
  room_id: number;
  room_number: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'MAINTENANCE';
  room_type: {
    type_name: string;
    price: number;
  };
}

interface Rental {
  rental_id: number;
  customer_name?: string;
  phone?: string;
  total_amount: number;
  status: string;
  created_at: string;
  user?: {
    fullname: string;
    phone: string;
  };
  rental_details: {
    room: {
      room_number: string;
    };
  }[];
}

export default function RentalsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [employeeId] = useState('1');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const [search, setSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [roomsData, rentalsData] = await Promise.all([
        apiFetch<Room[]>('/api/rooms'),
        apiFetch<Rental[]>('/api/rentals'),
      ]);

      setRooms(roomsData);
      setRentals(rentalsData);
    } catch (err: any) {
      alert(err.message || 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      const [roomsData, rentalsData] = await Promise.all([
        apiFetch<Room[]>('/api/rooms'),
        apiFetch<Rental[]>('/api/rentals'),
      ]);

      setRooms(roomsData);
      setRentals(rentalsData);
    } catch (err: any) {
      alert(err.message || 'ບໍ່ສາມາດໂຫຼດຂໍ້ມູນໃໝ່ໄດ້');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const availableRooms = rooms.filter(
    (room) => room.status === 'AVAILABLE'
  );

  const occupiedRooms = rooms.filter(
    (room) => room.status === 'OCCUPIED'
  );

  const cleaningRooms = rooms.filter(
    (room) => room.status === 'CLEANING'
  );

  const maintenanceRooms = rooms.filter(
    (room) => room.status === 'MAINTENANCE'
  );

  const activeRentals = rentals.filter(
    (rental) => rental.status === 'CHECKED_IN'
  );

  const filteredRentals = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return rentals;

    return rentals.filter((item) => {
      const customer =
        item.customer_name || item.user?.fullname || '';

      const customerPhone =
        item.phone || item.user?.phone || '';

      const roomNumbers =
        item.rental_details
          ?.map((d) => d.room.room_number)
          .join(' ') || '';

      return (
        customer.toLowerCase().includes(keyword) ||
        customerPhone.toLowerCase().includes(keyword) ||
        roomNumbers.toLowerCase().includes(keyword) ||
        String(item.rental_id).includes(keyword)
      );
    });
  }, [rentals, search]);

  const handleMarkAsCleaned = async (
    roomId: number,
    roomNumber: string
  ) => {
    if (
      !confirm(
        `ຢືນຢັນວ່າຫ້ອງ ${roomNumber} ທຳຄວາມສະອາດແລ້ວ ແລະ ພ້ອມໃຫ້ເຊົ່າ?`
      )
    ) {
      return;
    }

    try {
      await apiFetch(`/api/rooms/${roomId}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: 'AVAILABLE',
        }),
      });

      alert(
        `ຫ້ອງ ${roomNumber} ກັບມາເປັນຫ້ອງຫວ່າງແລ້ວ!`
      );

      fetchData();
    } catch (err: any) {
      alert(
        err.message ||
          'ເກີດຂໍ້ຜິດພາດໃນການອັບເດດສະຖານະຫ້ອງ'
      );
    }
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !customerName ||
      !phone ||
      !selectedRoom ||
      !checkIn ||
      !checkOut
    ) {
      alert('ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ');
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      alert('ວັນທີ Check-out ຕ້ອງຫຼັງຈາກ Check-in');
      return;
    }

    const room = rooms.find(
      (r) => r.room_id === selectedRoom
    );

    if (!room) return;

    try {
      setSubmitting(true);

      await apiFetch('/api/rentals', {
        method: 'POST',
        body: JSON.stringify({
          customer_name: customerName,
          phone: phone,
          employee_id: Number(employeeId),
          total_amount: Number(room.room_type.price),
          rooms: [
            {
              room_id: selectedRoom,
              check_in_date: new Date(checkIn).toISOString(),
              check_out_date: new Date(checkOut).toISOString(),
            },
          ],
        }),
      });

      alert('ບັນທຶກ Check-in ສຳເລັດ!');

      setCustomerName('');
      setPhone('');
      setSelectedRoom(null);
      setCheckIn('');
      setCheckOut('');

      fetchData();
    } catch (err: any) {
      alert(
        err.message ||
          'ເກີດຂໍ້ຜິດພາດໃນການ Check-in'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckOut = async (rentalId: number) => {
    if (
      !confirm(
        `ຢືນຢັນການ Check-out ສຳລັບລາຍການ ID #${rentalId}?`
      )
    ) {
      return;
    }

    try {
      await apiFetch(`/api/rentals/${rentalId}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: 'CHECKED_OUT',
        }),
      });

      alert(
        'Check-out ສຳເລັດ! ຫ້ອງຖືກປ່ຽນເປັນ CLEANING'
      );

      fetchData();
    } catch (err: any) {
      alert(
        err.message ||
          'ເກີດຂໍ້ຜິດພາດໃນການ Check-out'
      );
    }
  };

  const getRoomClass = (status: string, selected: boolean) => {
    if (selected) {
      return 'border-blue-500 bg-blue-50 ring-4 ring-blue-100';
    }

    switch (status) {
      case 'AVAILABLE':
        return 'border-emerald-200 bg-emerald-50 hover:border-emerald-400 hover:bg-emerald-100';

      case 'OCCUPIED':
        return 'border-rose-200 bg-rose-50';

      case 'CLEANING':
        return 'border-amber-200 bg-amber-50';

      case 'MAINTENANCE':
        return 'border-slate-200 bg-slate-100';

      default:
        return 'border-slate-200 bg-white';
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'CHECKED_IN') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
          <CheckCircle2 size={13} />
          ເຂົ້າພັກແລ້ວ
        </span>
      );
    }

    if (status === 'CHECKED_OUT') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
          <LogOut size={13} />
          ອອກພັກແລ້ວ
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            ກຳລັງໂຫຼດຂໍ້ມູນ...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 text-white shadow-lg sm:p-8">
        <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 right-24 h-52 w-52 rounded-full bg-white/5" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-blue-100">
              <CalendarDays size={20} />
              <span className="text-sm font-medium">
                Rental Management
              </span>
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">
              ຈັດການການເຊົ່າ & Check-in
            </h1>

            <p className="mt-2 text-sm text-blue-100">
              ຈັດການຫ້ອງພັກ, Check-in ແລະ Check-out
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25 disabled:opacity-60"
          >
            <RefreshCw
              size={18}
              className={refreshing ? 'animate-spin' : ''}
            />
            ໂຫຼດຂໍ້ມູນໃໝ່
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">
                ຫ້ອງທັງໝົດ
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {rooms.length}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <BedDouble size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">
                ຫ້ອງຫວ່າງ
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-600">
                {availableRooms.length}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <DoorOpen size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">
                ມີຄົນພັກ
              </p>

              <p className="mt-2 text-2xl font-bold text-rose-600">
                {occupiedRooms.length}
              </p>
            </div>

            <div className="rounded-xl bg-rose-50 p-3 text-rose-600">
              <Users size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">
                ກຳລັງອະນາໄມ
              </p>

              <p className="mt-2 text-2xl font-bold text-amber-600">
                {cleaningRooms.length}
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <Clock3 size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">
                ການເຊົ່າທີ່ກຳລັງດຳເນີນ
              </p>

              <p className="mt-2 text-2xl font-bold text-indigo-600">
                {activeRentals.length}
              </p>
            </div>

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <CalendarDays size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* Room Status */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              ສະຖານະຫ້ອງພັກ
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              ເລືອກຫ້ອງທີ່ຫວ່າງເພື່ອ Check-in
            </p>
          </div>

          <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            ຫວ່າງ

            <span className="ml-2 h-2.5 w-2.5 rounded-full bg-rose-500" />
            ພັກ

            <span className="ml-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
            ອະນາໄມ
          </div>
        </div>

        {rooms.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <BedDouble className="mx-auto text-slate-300" size={40} />

            <p className="mt-3 font-semibold text-slate-600">
              ຍັງບໍ່ມີຫ້ອງພັກ
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {rooms.map((room) => {
              const isAvailable = room.status === 'AVAILABLE';
              const isSelected = selectedRoom === room.room_id;

              return (
                <div
                  key={room.room_id}
                  onClick={() =>
                    isAvailable &&
                    setSelectedRoom(room.room_id)
                  }
                  className={`relative rounded-2xl border-2 p-4 transition ${getRoomClass(
                    room.status,
                    isSelected
                  )} ${
                    isAvailable
                      ? 'cursor-pointer'
                      : 'cursor-default'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium opacity-60">
                        ROOM
                      </p>

                      <p className="mt-1 text-2xl font-black">
                        {room.room_number}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/70 p-2">
                      <BedDouble size={19} />
                    </div>
                  </div>

                  <p className="mt-3 truncate text-sm font-semibold">
                    {room.room_type.type_name}
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    {Number(
                      room.room_type.price
                    ).toLocaleString()}{' '}
                    ກີບ
                  </p>

                  {room.status === 'CLEANING' ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        handleMarkAsCleaned(
                          room.room_id,
                          room.room_number
                        );
                      }}
                      className="mt-4 w-full rounded-xl bg-amber-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-amber-700"
                    >
                      ອະນາໄມແລ້ວ
                    </button>
                  ) : (
                    <span className="mt-4 inline-flex rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-bold">
                      {STATUS_LABEL[room.status] ||
                        room.status}
                    </span>
                  )}

                  {isSelected && (
                    <div className="absolute right-3 top-3 rounded-full bg-blue-600 p-1 text-white">
                      <CheckCircle2 size={14} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Check-in Form */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600">
              <CalendarDays size={21} />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">
                ສ້າງການ Check-in
              </h2>

              <p className="text-xs text-slate-400">
                {selectedRoom
                  ? `ເລືອກຫ້ອງ ID: ${selectedRoom}`
                  : 'ກະລຸນາເລືອກຫ້ອງກ່ອນ'}
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleCheckIn}
          className="space-y-6 p-6"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                ຊື່ ແລະ ນາມສະກຸນລູກຄ້າ
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(e.target.value)
                  }
                  placeholder="ປ້ອນຊື່ລູກຄ້າ"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                ເບີໂທຕິດຕໍ່
              </label>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="020 XXXXXXXX"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                ເລືອກຫ້ອງຫວ່າງ
              </label>

              <select
                value={selectedRoom || ''}
                onChange={(e) =>
                  setSelectedRoom(
                    e.target.value
                      ? Number(e.target.value)
                      : null
                  )
                }
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              >
                <option value="">
                  -- ເລືອກຫ້ອງ --
                </option>

                {availableRooms.map((room) => (
                  <option
                    key={room.room_id}
                    value={room.room_id}
                  >
                    ຫ້ອງ {room.room_number} -{' '}
                    {room.room_type.type_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                ວັນທີ Check-in
              </label>

              <input
                type="datetime-local"
                value={checkIn}
                onChange={(e) =>
                  setCheckIn(e.target.value)
                }
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                ວັນທີ Check-out
              </label>

              <input
                type="datetime-local"
                value={checkOut}
                onChange={(e) =>
                  setCheckOut(e.target.value)
                }
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          {selectedRoom && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white p-2 text-blue-600 shadow-sm">
                  <BedDouble size={20} />
                </div>

                <div>
                  <p className="text-xs text-blue-500">
                    ຫ້ອງທີ່ເລືອກ
                  </p>

                  <p className="font-bold text-blue-900">
                    ຫ້ອງ{' '}
                    {
                      rooms.find(
                        (r) =>
                          r.room_id === selectedRoom
                      )?.room_number
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end border-t border-slate-100 pt-5">
            <button
              type="submit"
              disabled={!selectedRoom || submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {submitting && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}

              {submitting
                ? 'ກຳລັງບັນທຶກ...'
                : 'ບັນທຶກ Check-in'}
            </button>
          </div>
        </form>
      </section>

      {/* Rental History */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-bold text-slate-800">
                ປະຫວັດການເຊົ່າ
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                ລາຍການການເຊົ່າທັງໝົດໃນລະບົບ
              </p>
            </div>

            <div className="relative w-full lg:w-80">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="ຄົ້ນຫາຊື່, ເບີໂທ, ຫ້ອງ ຫຼື ID..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {filteredRentals.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <CalendarDays size={30} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-700">
              ບໍ່ພົບລາຍການ
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              ລອງປ່ຽນຄຳຄົ້ນຫາ
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold text-slate-500">
                  <th className="px-5 py-4">
                    Rental ID
                  </th>

                  <th className="px-5 py-4">
                    ລູກຄ້າ
                  </th>

                  <th className="px-5 py-4">
                    ຫ້ອງ
                  </th>

                  <th className="px-5 py-4">
                    ຍອດລວມ
                  </th>

                  <th className="px-5 py-4">
                    ສະຖານະ
                  </th>

                  <th className="px-5 py-4 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredRentals.map((item) => {
                  const customer =
                    item.customer_name ||
                    item.user?.fullname ||
                    '-';

                  const customerPhone =
                    item.phone ||
                    item.user?.phone ||
                    '-';

                  const roomsText =
                    item.rental_details
                      ?.map(
                        (d) =>
                          `ຫ້ອງ ${d.room.room_number}`
                      )
                      .join(', ') || '-';

                  return (
                    <tr
                      key={item.rental_id}
                      className="transition hover:bg-blue-50/30"
                    >
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs font-bold text-slate-400">
                          #{item.rental_id}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                            {customer
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {customer}
                            </p>

                            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                              <Phone size={11} />
                              {customerPhone}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                          <BedDouble size={13} />
                          {roomsText}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-bold text-slate-800">
                          {Number(
                            item.total_amount
                          ).toLocaleString()}{' '}
                          ກີບ
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {getStatusBadge(item.status)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        {item.status ===
                          'CHECKED_IN' && (
                          <button
                            onClick={() =>
                              handleCheckOut(
                                item.rental_id
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
                          >
                            <LogOut size={14} />
                            Check-out
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}