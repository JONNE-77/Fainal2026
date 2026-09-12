'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Phone,
  CalendarDays,
  Search,
  UserRound,
  X,
  UserPlus,
  UserCheck,
} from 'lucide-react';

interface Customer {
  user_id: number;
  fullname: string;
  phone: string;
  created_at: string;
  _count?: {
    rental: number;
  };
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Customer | null>(null);

  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    password: '',
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const res = await fetch('/api/customers', {
        cache: 'no-store',
      });

      const data = await res.json();

      if (res.ok) {
        setCustomers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleOpenModal = (item?: Customer) => {
    if (item) {
      setEditingItem(item);

      setFormData({
        fullname: item.fullname,
        phone: item.phone,
        password: '',
      });
    } else {
      setEditingItem(null);

      setFormData({
        fullname: '',
        phone: '',
        password: '',
      });
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);

    setFormData({
      fullname: '',
      phone: '',
      password: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingItem
        ? `/api/customers/${editingItem.user_id}`
        : '/api/customers';

      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        handleCloseModal();
        fetchCustomers();
      } else {
        const err = await res.json();

        alert(err.error || 'ເກີດຂໍ້ຜິດພາດ');
      }
    } catch (error) {
      console.error(error);
      alert('ບໍ່ສາມາດບັນທຶກຂໍ້ມູນໄດ້');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('ທ່ານຕ້ອງການລົບລູກຄ້າຄົນນີ້ແທ້ບໍ?')) {
      return;
    }

    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchCustomers();
      } else {
        alert('ບໍ່ສາມາດລົບໄດ້ເນື່ອງຈາກມີປະຫວັດການເຊົ່າ');
      }
    } catch (error) {
      console.error(error);
      alert('ເກີດຂໍ້ຜິດພາດ');
    }
  };

  const filteredCustomers = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) {
      return customers;
    }

    return customers.filter(
      (item) =>
        item.fullname.toLowerCase().includes(keyword) ||
        item.phone.toLowerCase().includes(keyword) ||
        String(item.user_id).includes(keyword),
    );
  }, [customers, search]);

  const totalRentals = customers.reduce(
    (sum, item) => sum + (item._count?.rental || 0),
    0,
  );

  const getInitial = (name: string) => {
    return name?.charAt(0)?.toUpperCase() || 'U';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">

      {/* =========================================
          PAGE HEADER
      ========================================= */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-7 text-white shadow-lg">

        <div className="absolute -right-16 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20 shadow-lg">
              <Users size={28} />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">
                ຈັດການລູກຄ້າ
              </h1>

              <p className="text-sm text-blue-100 mt-1">
                ຈັດການຂໍ້ມູນລູກຄ້າ ແລະ ປະຫວັດການເຊົ່າ
              </p>
            </div>

          </div>

          <button
            onClick={() => handleOpenModal()}
            className="w-full lg:w-auto bg-white text-blue-700 hover:bg-blue-50 px-5 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition"
          >
            <UserPlus size={18} />
            ເພີ່ມລູກຄ້າໃໝ່
          </button>

        </div>
      </div>

      {/* =========================================
          SUMMARY CARDS
      ========================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* TOTAL CUSTOMERS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                ລູກຄ້າທັງໝົດ
              </p>

              <p className="text-3xl font-extrabold text-slate-900 mt-2">
                {customers.length}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                ຄົນ
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={21} />
            </div>

          </div>
        </div>

        {/* RENTAL COUNT */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                ຈຳນວນການເຊົ່າ
              </p>

              <p className="text-3xl font-extrabold text-slate-900 mt-2">
                {totalRentals}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                ຄັ້ງ
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck size={21} />
            </div>

          </div>
        </div>

        {/* SEARCH RESULT */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                ຜົນການຄົ້ນຫາ
              </p>

              <p className="text-3xl font-extrabold text-slate-900 mt-2">
                {filteredCustomers.length}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                ລາຍການ
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Search size={21} />
            </div>

          </div>
        </div>

      </div>

      {/* =========================================
          CUSTOMER TABLE CARD
      ========================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* TABLE HEADER */}
        <div className="p-5 sm:p-6 border-b border-slate-100">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>
              <h2 className="font-bold text-slate-900">
                ລາຍຊື່ລູກຄ້າ
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                ລາຍຊື່ລູກຄ້າທັງໝົດໃນລະບົບ
              </p>
            </div>

            {/* SEARCH */}
            <div className="relative w-full lg:w-80">

              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ຄົ້ນຫາຊື່, ເບີໂທ, ID..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />

            </div>

          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">

            <div className="w-10 h-10 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin" />

            <p className="text-sm text-slate-400 mt-4">
              ກຳລັງໂຫຼດຂໍ້ມູນ...
            </p>

          </div>
        ) : filteredCustomers.length === 0 ? (

          /* EMPTY */
          <div className="py-20 flex flex-col items-center justify-center">

            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
              <UserRound size={30} />
            </div>

            <h3 className="font-bold text-slate-700 mt-4">
              ບໍ່ພົບຂໍ້ມູນລູກຄ້າ
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              ລອງປ່ຽນຄຳຄົ້ນຫາ ຫຼື ເພີ່ມລູກຄ້າໃໝ່
            </p>

          </div>
        ) : (

          /* TABLE */
          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm">

              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">

                  <th className="px-5 py-4 text-[11px] font-extrabold uppercase tracking-wide text-slate-400">
                    ID
                  </th>

                  <th className="px-5 py-4 text-[11px] font-extrabold uppercase tracking-wide text-slate-400">
                    ລູກຄ້າ
                  </th>

                  <th className="px-5 py-4 text-[11px] font-extrabold uppercase tracking-wide text-slate-400">
                    ເບີໂທລະສັບ
                  </th>

                  <th className="px-5 py-4 text-[11px] font-extrabold uppercase tracking-wide text-slate-400">
                    ການເຊົ່າ
                  </th>

                  <th className="px-5 py-4 text-[11px] font-extrabold uppercase tracking-wide text-slate-400">
                    ວັນທີສະໝັກ
                  </th>

                  <th className="px-5 py-4 text-[11px] font-extrabold uppercase tracking-wide text-slate-400 text-right">
                    ຈັດການ
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredCustomers.map((item) => (

                  <tr
                    key={item.user_id}
                    className="hover:bg-blue-50/30 transition"
                  >

                    {/* ID */}
                    <td className="px-5 py-4">

                      <span className="font-bold text-slate-400 text-xs">
                        #{item.user_id}
                      </span>

                    </td>

                    {/* CUSTOMER */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
                          {getInitial(item.fullname)}
                        </div>

                        <div>
                          <div className="font-bold text-slate-800">
                            {item.fullname}
                          </div>

                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Customer ID #{item.user_id}
                          </div>
                        </div>

                      </div>

                    </td>

                    {/* PHONE */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2 text-slate-600">

                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Phone
                            size={14}
                            className="text-slate-500"
                          />
                        </div>

                        <span className="font-medium">
                          {item.phone}
                        </span>

                      </div>

                    </td>

                    {/* RENTALS */}
                    <td className="px-5 py-4">

                      <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full text-xs font-bold">
                        {item._count?.rental || 0}
                        <span className="font-medium">
                          ຄັ້ງ
                        </span>
                      </span>

                    </td>

                    {/* DATE */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2 text-slate-500">

                        <CalendarDays
                          size={15}
                          className="text-slate-400"
                        />

                        <span className="text-xs font-medium">
                          {formatDate(item.created_at)}
                        </span>

                      </div>

                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() => handleOpenModal(item)}
                          title="ແກ້ໄຂ"
                          className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition"
                        >
                          <Edit2 size={15} />
                        </button>

                        <button
                          onClick={() => handleDelete(item.user_id)}
                          title="ລົບ"
                          className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center transition"
                        >
                          <Trash2 size={15} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

        {/* TABLE FOOTER */}
        {!loading && filteredCustomers.length > 0 && (
          <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50">

            <p className="text-xs text-slate-400">
              ສະແດງ{' '}
              <span className="font-bold text-slate-600">
                {filteredCustomers.length}
              </span>{' '}
              ຈາກ{' '}
              <span className="font-bold text-slate-600">
                {customers.length}
              </span>{' '}
              ລາຍການ
            </p>

          </div>
        )}

      </div>

      {/* =========================================
          MODAL
      ========================================= */}
      {isModalOpen && (

        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

            {/* MODAL HEADER */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  {editingItem ? (
                    <Edit2 size={19} />
                  ) : (
                    <UserPlus size={19} />
                  )}
                </div>

                <div>

                  <h2 className="font-bold text-slate-900">
                    {editingItem
                      ? 'ແກ້ໄຂຂໍ້ມູນລູກຄ້າ'
                      : 'ເພີ່ມລູກຄ້າໃໝ່'}
                  </h2>

                  <p className="text-xs text-slate-400 mt-0.5">
                    {editingItem
                      ? `Customer #${editingItem.user_id}`
                      : 'ປ້ອນຂໍ້ມູນລູກຄ້າ'}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="w-9 h-9 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
              >
                <X size={18} />
              </button>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >

              {/* NAME */}
              <div>

                <label className="block text-xs font-bold text-slate-600 mb-2">
                  ຊື່ ແລະ ນາມສະກຸນ
                </label>

                <div className="relative">

                  <UserRound
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    required
                    value={formData.fullname}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fullname: e.target.value,
                      })
                    }
                    placeholder="ປ້ອນຊື່ ແລະ ນາມສະກຸນ"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

              </div>

              {/* PHONE */}
              <div>

                <label className="block text-xs font-bold text-slate-600 mb-2">
                  ເບີໂທລະສັບ
                </label>

                <div className="relative">

                  <Phone
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value,
                      })
                    }
                    placeholder="020 XX XXX XXX"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

              </div>

              {/* PASSWORD */}
              {!editingItem && (

                <div>

                  <label className="block text-xs font-bold text-slate-600 mb-2">
                    ລະຫັດຜ່ານ
                  </label>

                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

              )}

              {/* BUTTONS */}
              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold transition"
                >
                  ຍົກເລີກ
                </button>

                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm shadow-blue-600/20 transition flex items-center justify-center gap-2"
                >
                  <UserPlus size={16} />

                  {editingItem
                    ? 'ບັນທຶກການແກ້ໄຂ'
                    : 'ເພີ່ມລູກຄ້າ'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}