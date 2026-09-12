'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  BedDouble,
  Plus,
  Search,
  Trash2,
  RefreshCw,
  Building2,
  CheckCircle2,
  UserRound,
  Wrench,
  Sparkles,
  X,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

// ===============================
// Data Types
// ===============================
interface RoomType {
  type_id: number;
  type_name: string;
  price: number;
}

interface Room {
  room_id: number;
  room_number: string;
  type_id: number;
  status: string;
  room_type: RoomType;
}

// ===============================
// Status Helper
// ===============================
const statusConfig: Record<
  string,
  {
    label: string;
    color: string;
    icon: React.ReactNode;
  }
> = {
  AVAILABLE: {
    label: 'ຫວ່າງ',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: <CheckCircle2 size={14} />,
  },
  OCCUPIED: {
    label: 'ມີຄົນພັກ',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: <UserRound size={14} />,
  },
  CLEANING: {
    label: 'ກຳລັງອະນາໄມ',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: <Sparkles size={14} />,
  },
  MAINTENANCE: {
    label: 'ປັບປຸງ',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: <Wrench size={14} />,
  },
};

// ===============================
// Main Page
// ===============================
export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

  const [roomNumber, setRoomNumber] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ===============================
  // Load Data
  // ===============================
  const loadData = async () => {
    try {
      setLoading(true);

      const [roomsRes, typesRes] = await Promise.all([
        apiFetch<Room[]>('/api/rooms'),
        apiFetch<RoomType[]>('/api/room_types'),
      ]);

      setRooms(roomsRes);
      setRoomTypes(typesRes);
    } catch (err: any) {
      alert(err.message || 'ເກີດຂໍ້ຜິດພາດ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ===============================
  // Create Room
  // ===============================
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomNumber.trim() || !selectedType) {
      alert('ກະລຸນາກອກເລກຫ້ອງ ແລະ ເລືອກປະເພດຫ້ອງ');
      return;
    }

    try {
      setSaving(true);

      await apiFetch('/api/rooms', {
        method: 'POST',
        body: JSON.stringify({
          room_number: roomNumber.trim(),
          type_id: Number(selectedType),
          status: 'AVAILABLE',
        }),
      });

      alert('ເພີ່ມຫ້ອງສຳເລັດ!');

      setRoomNumber('');
      setSelectedType('');

      await loadData();
    } catch (err: any) {
      alert(err.message || 'ເກີດຂໍ້ຜິດພາດ');
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // Change Status
  // ===============================
  const handleStatusChange = async (
    roomId: number,
    newStatus: string
  ) => {
    try {
      await apiFetch(`/api/rooms/${roomId}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      await loadData();
    } catch (err: any) {
      alert(err.message || 'ບໍ່ສາມາດປ່ຽນສະຖານະໄດ້');
    }
  };

  // ===============================
  // Delete Room
  // ===============================
  const handleDeleteRoom = async (id: number) => {
    if (!confirm('ຢືນຢັນການລົບຫ້ອງນີ້?')) return;

    try {
      setDeletingId(id);

      await apiFetch(`/api/rooms/${id}`, {
        method: 'DELETE',
      });

      alert('ລົບຫ້ອງສຳເລັດ!');

      await loadData();
    } catch (err: any) {
      alert(err.message || 'ບໍ່ສາມາດລົບຫ້ອງໄດ້');
    } finally {
      setDeletingId(null);
    }
  };

  // ===============================
  // Filter Rooms
  // ===============================
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const keyword = search.toLowerCase().trim();

      const matchesSearch =
        !keyword ||
        room.room_number.toLowerCase().includes(keyword) ||
        room.room_type.type_name.toLowerCase().includes(keyword) ||
        String(room.room_id).includes(keyword);

      const matchesStatus =
        statusFilter === 'ALL' || room.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rooms, search, statusFilter]);

  // ===============================
  // Summary
  // ===============================
  const totalRooms = rooms.length;

  const availableRooms = rooms.filter(
    (room) => room.status === 'AVAILABLE'
  ).length;

  const occupiedRooms = rooms.filter(
    (room) => room.status === 'OCCUPIED'
  ).length;

  const cleaningRooms = rooms.filter(
    (room) => room.status === 'CLEANING'
  ).length;

  const maintenanceRooms = rooms.filter(
    (room) => room.status === 'MAINTENANCE'
  ).length;

  return (
    <div className="min-h-full space-y-6">

      {/* =========================================
          Header
      ========================================= */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-2 text-blue-100">
              <Building2 size={18} />
              <span className="text-sm font-medium">
                GuestHouse Management
              </span>
            </div>

            <h1 className="text-2xl font-bold md:text-3xl">
              ຈັດການຫ້ອງພັກ
            </h1>

            <p className="mt-1 text-sm text-blue-100">
              ຈັດການຂໍ້ມູນຫ້ອງ, ປະເພດຫ້ອງ ແລະ ສະຖານະຫ້ອງ
            </p>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold backdrop-blur transition hover:bg-white/25 disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={loading ? 'animate-spin' : ''}
            />
            ໂຫຼດຂໍ້ມູນໃໝ່
          </button>
        </div>
      </div>

      {/* =========================================
          Summary Cards
      ========================================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

        <SummaryCard
          title="ຫ້ອງທັງໝົດ"
          value={totalRooms}
          icon={<BedDouble size={22} />}
          iconClass="bg-blue-100 text-blue-600"
        />

        <SummaryCard
          title="ຫ້ອງຫວ່າງ"
          value={availableRooms}
          icon={<CheckCircle2 size={22} />}
          iconClass="bg-emerald-100 text-emerald-600"
        />

        <SummaryCard
          title="ມີຄົນພັກ"
          value={occupiedRooms}
          icon={<UserRound size={22} />}
          iconClass="bg-rose-100 text-rose-600"
        />

        <SummaryCard
          title="ກຳລັງອະນາໄມ"
          value={cleaningRooms}
          icon={<Sparkles size={22} />}
          iconClass="bg-amber-100 text-amber-600"
        />

        <SummaryCard
          title="ປັບປຸງ"
          value={maintenanceRooms}
          icon={<Wrench size={22} />}
          iconClass="bg-slate-100 text-slate-600"
        />

      </div>

      {/* =========================================
          Add Room
      ========================================= */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Plus size={21} />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">
                ເພີ່ມຫ້ອງພັກໃໝ່
              </h2>

              <p className="text-sm text-slate-500">
                ເພີ່ມຫ້ອງໃໝ່ເຂົ້າສູ່ລະບົບ
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleCreateRoom}
          className="grid grid-cols-1 gap-5 p-6 md:grid-cols-3"
        >

          {/* Room Number */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              ເລກຫ້ອງ
            </label>

            <input
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              placeholder="ເຊັ່ນ 101, 102, A2"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              required
            />
          </div>

          {/* Room Type */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              ປະເພດຫ້ອງ
            </label>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              required
            >
              <option value="">
                -- ເລືອກປະເພດຫ້ອງ --
              </option>

              {roomTypes.map((type) => (
                <option
                  key={type.type_id}
                  value={type.type_id}
                >
                  {type.type_name} (
                  {Number(type.price).toLocaleString()} ກີບ)
                </option>
              ))}
            </select>
          </div>

          {/* Button */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={18} />

              {saving ? 'ກຳລັງເພີ່ມ...' : 'ເພີ່ມຫ້ອງ'}
            </button>
          </div>

        </form>
      </div>

      {/* =========================================
          Room List
      ========================================= */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Header */}
        <div className="border-b border-slate-100 p-5">

          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                ລາຍການຫ້ອງພັກ
              </h2>

              <p className="text-sm text-slate-500">
                ສະແດງ {filteredRooms.length} ຈາກ {rooms.length} ຫ້ອງ
              </p>
            </div>

          </div>

          {/* Search + Filter */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ຄົ້ນຫາເລກຫ້ອງ, ປະເພດຫ້ອງ..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="ALL">
                ທຸກສະຖານະ
              </option>

              <option value="AVAILABLE">
                ຫວ່າງ
              </option>

              <option value="OCCUPIED">
                ມີຄົນພັກ
              </option>

              <option value="CLEANING">
                ກຳລັງອະນາໄມ
              </option>

              <option value="MAINTENANCE">
                ປັບປຸງ
              </option>
            </select>

          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">

          {loading ? (
            <div className="space-y-3 p-6">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-14 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <BedDouble size={30} />
              </div>

              <h3 className="font-bold text-slate-700">
                ບໍ່ພົບຫ້ອງພັກ
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                ລອງປ່ຽນຄຳຄົ້ນຫາ ຫຼື ເພີ່ມຫ້ອງໃໝ່
              </p>

            </div>
          ) : (
            <table className="w-full min-w-[850px] text-left">

              <thead className="bg-slate-50">
                <tr className="border-b border-slate-100">

                  <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                    ID
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                    ຫ້ອງ
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                    ປະເພດ
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                    ລາຄາ
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                    ສະຖານະ
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase text-slate-500">
                    ຈັດການ
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredRooms.map((room) => {

                  const config =
                    statusConfig[room.status] ||
                    statusConfig.AVAILABLE;

                  return (
                    <tr
                      key={room.room_id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* ID */}
                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                          #{room.room_id}
                        </span>
                      </td>

                      {/* Room */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <BedDouble size={19} />
                          </div>

                          <div>
                            <p className="font-bold text-slate-800">
                              ຫ້ອງ {room.room_number}
                            </p>

                            <p className="text-xs text-slate-400">
                              Room #{room.room_id}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* Type */}
                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                          {room.room_type.type_name}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-bold text-slate-800">
                            {Number(
                              room.room_type.price
                            ).toLocaleString()}
                          </p>

                          <p className="text-xs text-slate-400">
                            ກີບ / ຄືນ
                          </p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">

                        <select
                          value={room.status}
                          onChange={(e) =>
                            handleStatusChange(
                              room.room_id,
                              e.target.value
                            )
                          }
                          className={`rounded-lg border px-3 py-2 text-xs font-bold outline-none transition focus:ring-4 focus:ring-blue-100 ${config.color}`}
                        >

                          <option value="AVAILABLE">
                            AVAILABLE - ຫວ່າງ
                          </option>

                          <option
                            value="OCCUPIED"
                            disabled
                          >
                            OCCUPIED - ມີຄົນພັກ
                          </option>

                          <option value="CLEANING">
                            CLEANING - ກຳລັງອະນາໄມ
                          </option>

                          <option value="MAINTENANCE">
                            MAINTENANCE - ປັບປຸງ
                          </option>

                        </select>

                      </td>

                      {/* Delete */}
                      <td className="px-5 py-4 text-right">

                        <button
                          onClick={() =>
                            handleDeleteRoom(room.room_id)
                          }
                          disabled={
                            deletingId === room.room_id
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          <Trash2 size={15} />

                          {deletingId === room.room_id
                            ? 'ກຳລັງລົບ...'
                            : 'ລົບ'}

                        </button>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>
          )}

        </div>

      </div>

    </div>
  );
}

// ===============================
// Summary Card Component
// ===============================
function SummaryCard({
  title,
  value,
  icon,
  iconClass,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-800">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}