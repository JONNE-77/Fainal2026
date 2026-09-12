'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Layers,
  Search,
  BedDouble,
  DollarSign,
  DoorOpen,
  X,
  Save,
  RefreshCw,
} from 'lucide-react';

interface RoomType {
  type_id: number;
  type_name: string;
  price: number;
  _count?: {
    room: number;
  };
}

export default function RoomTypesPage() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RoomType | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    type_name: '',
    price: '',
  });

  // ================= FETCH =================
  const fetchRoomTypes = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/room_types', {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('Fetch failed');
      }

      const data = await res.json();
      setRoomTypes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchRoomTypes();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  // ================= MODAL =================
  const handleOpenModal = (item?: RoomType) => {
    if (item) {
      setEditingItem(item);

      setFormData({
        type_name: item.type_name,
        price: item.price.toString(),
      });
    } else {
      setEditingItem(null);

      setFormData({
        type_name: '',
        price: '',
      });
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (saving) return;

    setIsModalOpen(false);
    setEditingItem(null);

    setFormData({
      type_name: '',
      price: '',
    });
  };

  // ================= SAVE =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.type_name.trim()) {
      alert('ກະລຸນາປ້ອນຊື່ປະເພດຫ້ອງ');
      return;
    }

    if (!formData.price || Number(formData.price) < 0) {
      alert('ກະລຸນາປ້ອນລາຄາໃຫ້ຖືກຕ້ອງ');
      return;
    }

    const url = editingItem
      ? `/api/room_types/${editingItem.type_id}`
      : '/api/room_types';

    const method = editingItem ? 'PUT' : 'POST';

    setSaving(true);

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type_name: formData.type_name.trim(),
          price: Number(formData.price),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);

        throw new Error(
          data?.error ?? 'ບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ'
        );
      }

      setIsModalOpen(false);
      setEditingItem(null);

      setFormData({
        type_name: '',
        price: '',
      });

      await fetchRoomTypes();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'ບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ'
      );
    } finally {
      setSaving(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id: number) => {
    if (
      !confirm(
        'ທ່ານຕັ້ງໃຈຈະລົບປະເພດຫ້ອງພັກນີ້ແທ້ບໍ?'
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/room_types/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchRoomTypes();
      } else {
        alert(
          'ບໍ່ສາມາດລົບໄດ້ ເນື່ອງຈາກມີຫ້ອງພັກຜູກຢູ່ກັບປະເພດນີ້'
        );
      }
    } catch (error) {
      console.error(error);
      alert('ເກີດຂໍ້ຜິດພາດ');
    }
  };

  // ================= SEARCH =================
  const filteredRoomTypes = roomTypes.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.type_name.toLowerCase().includes(keyword) ||
      item.type_id.toString().includes(keyword)
    );
  });

  // ================= SUMMARY =================
  const totalTypes = roomTypes.length;

  const totalRooms = roomTypes.reduce(
    (sum, item) => sum + (item._count?.room || 0),
    0
  );

  const averagePrice =
    totalTypes > 0
      ? roomTypes.reduce(
          (sum, item) => sum + Number(item.price),
          0
        ) / totalTypes
      : 0;

  const highestPrice =
    totalTypes > 0
      ? Math.max(...roomTypes.map((item) => Number(item.price)))
      : 0;

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 text-white shadow-xl sm:p-8">

        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 right-40 h-48 w-48 rounded-full bg-white/5" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="mb-3 flex items-center gap-3">

              <div className="rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
                <Layers size={25} />
              </div>

              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                ROOM TYPES
              </span>

            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">
              ຈັດການປະເພດຫ້ອງພັກ
            </h1>

            <p className="mt-2 text-sm text-blue-100">
              ເພີ່ມ, ແກ້ໄຂ ແລະ ກຳນົດລາຄາຂອງປະເພດຫ້ອງພັກ
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50"
          >
            <Plus size={19} />
            ເພີ່ມປະເພດຫ້ອງ
          </button>

        </div>
      </div>


      {/* ================= SUMMARY ================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total Types */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                ປະເພດຫ້ອງທັງໝົດ
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {totalTypes}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                ປະເພດ
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 p-4 text-blue-600">
              <Layers size={25} />
            </div>

          </div>
        </div>


        {/* Total Rooms */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                ຫ້ອງພັກທັງໝົດ
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {totalRooms}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                ຫ້ອງ
              </p>
            </div>

            <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-600">
              <DoorOpen size={25} />
            </div>

          </div>
        </div>


        {/* Average Price */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                ລາຄາສະເລ່ຍ / ຄືນ
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {averagePrice.toLocaleString()}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                ກີບ / ຄືນ
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-600">
              <DollarSign size={25} />
            </div>

          </div>
        </div>


        {/* Highest Price */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                ລາຄາສູງສຸດ
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {highestPrice.toLocaleString()}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                ກີບ / ຄືນ
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50 p-4 text-amber-600">
              <DollarSign size={25} />
            </div>

          </div>
        </div>

      </div>


      {/* ================= TABLE CARD ================= */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <BedDouble size={20} />
              </div>

              <h2 className="font-bold text-slate-800">
                ລາຍການປະເພດຫ້ອງພັກ
              </h2>

            </div>

            <p className="mt-1 pl-12 text-xs text-slate-400">
              ຈັດການຊື່ປະເພດ, ລາຄາ ແລະ ຈຳນວນຫ້ອງ
            </p>
          </div>


          <div className="flex flex-col gap-2 sm:flex-row">

            {/* Search */}
            <div className="relative">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ຄົ້ນຫາປະເພດຫ້ອງ..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:w-64"
              />

            </div>


            {/* Refresh */}
            <button
              onClick={fetchRoomTypes}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={loading ? 'animate-spin' : ''}
              />

              Refresh
            </button>

          </div>

        </div>


        {/* Loading */}
        {loading ? (

          <div className="space-y-4 p-6">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex animate-pulse items-center gap-4"
              >

                <div className="h-10 w-10 rounded-xl bg-slate-100" />

                <div className="flex-1 space-y-2">
                  <div className="h-3 w-40 rounded bg-slate-100" />
                  <div className="h-3 w-24 rounded bg-slate-100" />
                </div>

                <div className="h-4 w-28 rounded bg-slate-100" />

              </div>
            ))}

          </div>

        ) : filteredRoomTypes.length === 0 ? (

          /* Empty */
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

            <div className="mb-4 rounded-3xl bg-slate-100 p-5 text-slate-400">
              <Layers size={35} />
            </div>

            <h3 className="font-semibold text-slate-700">
              {search
                ? 'ບໍ່ພົບປະເພດຫ້ອງ'
                : 'ຍັງບໍ່ມີປະເພດຫ້ອງ'}
            </h3>

            <p className="mt-1 max-w-md text-sm text-slate-400">
              {search
                ? 'ລອງປ່ຽນຄຳຄົ້ນຫາໃໝ່'
                : 'ກົດປຸ່ມເພີ່ມປະເພດຫ້ອງເພື່ອເລີ່ມຕົ້ນ'}
            </p>

          </div>

        ) : (

          /* Table */
          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px] text-left">

              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    ID
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    ປະເພດຫ້ອງ
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    ລາຄາ / ຄືນ
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    ຈຳນວນຫ້ອງ
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                    ຈັດການ
                  </th>

                </tr>
              </thead>


              <tbody className="divide-y divide-slate-100">

                {filteredRoomTypes.map((item) => {

                  const roomCount = item._count?.room || 0;

                  return (
                    <tr
                      key={item.type_id}
                      className="group transition hover:bg-blue-50/40"
                    >

                      {/* ID */}
                      <td className="px-6 py-5">

                        <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                          #{item.type_id}
                        </span>

                      </td>


                      {/* Type */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                            <BedDouble size={21} />
                          </div>

                          <div>
                            <p className="font-bold text-slate-800">
                              {item.type_name}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              Room Type #{item.type_id}
                            </p>
                          </div>

                        </div>

                      </td>


                      {/* Price */}
                      <td className="px-6 py-5">

                        <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2">

                          <DollarSign
                            size={16}
                            className="text-emerald-600"
                          />

                          <span className="font-bold text-emerald-600">
                            {Number(item.price).toLocaleString()}
                          </span>

                          <span className="text-xs font-medium text-emerald-500">
                            ₭ / ຄືນ
                          </span>

                        </div>

                      </td>


                      {/* Room Count */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2">

                          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                            <DoorOpen size={16} />
                          </div>

                          <div>
                            <p className="font-semibold text-slate-700">
                              {roomCount} ຫ້ອງ
                            </p>

                            <p className="text-xs text-slate-400">
                              ທີ່ມີຢູ່ໃນລະບົບ
                            </p>
                          </div>

                        </div>

                      </td>


                      {/* Actions */}
                      <td className="px-6 py-5 text-right">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() => handleOpenModal(item)}
                            title="ແກ້ໄຂ"
                            className="rounded-xl p-2.5 text-blue-600 transition hover:bg-blue-50"
                          >
                            <Edit2 size={17} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(item.type_id)
                            }
                            title="ລົບ"
                            className="rounded-xl p-2.5 text-rose-600 transition hover:bg-rose-50"
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>


      {/* ================= MODAL ================= */}
      {isModalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                  <Layers size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-800">
                    {editingItem
                      ? 'ແກ້ໄຂປະເພດຫ້ອງ'
                      : 'ເພີ່ມປະເພດຫ້ອງໃໝ່'}
                  </h2>

                  <p className="text-xs text-slate-400">
                    {editingItem
                      ? `Room Type #${editingItem.type_id}`
                      : 'ປ້ອນຂໍ້ມູນປະເພດຫ້ອງ'}
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={saving}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
              >
                <X size={20} />
              </button>

            </div>


            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {/* Room Type Name */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-600">
                  ຊື່ປະເພດຫ້ອງ
                </label>

                <div className="relative">

                  <Layers
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    required
                    value={formData.type_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type_name: e.target.value,
                      })
                    }
                    placeholder="ເຊັ່ນ: Standard Room, VIP Suite"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                </div>

              </div>


              {/* Price */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-600">
                  ລາຄາຕໍ່ຄືນ (ກີບ)
                </label>

                <div className="relative">

                  <DollarSign
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: e.target.value,
                      })
                    }
                    placeholder="ເຊັ່ນ: 250000"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                </div>

              </div>


              {/* Buttons */}
              <div className="flex gap-3 border-t border-slate-100 pt-5">

                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  ຍົກເລີກ
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {saving ? (
                    <>
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />
                      ກຳລັງບັນທຶກ...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      ບັນທຶກ
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}