'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  UserCheck,
  Plus,
  Edit2,
  Trash2,
  Shield,
  Search,
  Users,
  UserCog,
  X,
  LockKeyhole,
} from 'lucide-react';

interface Employee {
  employee_id: number;
  fullname: string;
  position: string;
  username: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Employee | null>(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullname: '',
    position: '',
    username: '',
    password: '',
  });

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const res = await fetch('/api/employees', {
        cache: 'no-store',
      });

      const data = await res.json();

      if (res.ok) {
        setEmployees(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return employees;

    return employees.filter(
      (item) =>
        item.fullname?.toLowerCase().includes(keyword) ||
        item.username?.toLowerCase().includes(keyword) ||
        item.position?.toLowerCase().includes(keyword) ||
        String(item.employee_id).includes(keyword)
    );
  }, [employees, search]);

  const handleOpenModal = (item?: Employee) => {
    if (item) {
      setEditingItem(item);

      setFormData({
        fullname: item.fullname || '',
        position: item.position || '',
        username: item.username || '',
        password: '',
      });
    } else {
      setEditingItem(null);

      setFormData({
        fullname: '',
        position: '',
        username: '',
        password: '',
      });
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (saving) return;

    setIsModalOpen(false);
    setEditingItem(null);

    setFormData({
      fullname: '',
      position: '',
      username: '',
      password: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      const url = editingItem
        ? `/api/employees/${editingItem.employee_id}`
        : '/api/employees';

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
        await fetchEmployees();
      } else {
        const err = await res.json();
        alert(err.error || 'ເກີດຂໍ້ຜິດພາດ');
      }
    } catch (err) {
      console.error(err);
      alert('ບໍ່ສາມາດບັນທຶກຂໍ້ມູນໄດ້');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('ທ່ານຕ້ອງການລົບພະນັກງານຄົນນີ້ແທ້ບໍ?')) {
      return;
    }

    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchEmployees();
      } else {
        alert(
          'ບໍ່ສາມາດລົບໄດ້ເນື່ອງຈາກມີປະຫວັດການເຮັດຸລະກຳ'
        );
      }
    } catch (err) {
      console.error(err);
      alert('ເກີດຂໍ້ຜິດພາດ');
    }
  };

  const getInitials = (fullname: string) => {
    if (!fullname) return 'U';

    const words = fullname.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }

    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 right-20 h-44 w-44 rounded-full bg-white/5" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-blue-100">
              <UserCheck size={20} />
              <span className="text-sm font-medium">
                Employee Management
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold">
              ຈັດການພະນັກງານ
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-blue-100">
              ຈັດການບັນຊີ, ຕຳແໜ່ງ ແລະ ສິດການໃຊ້ງານຂອງພະນັກງານ
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-blue-700 shadow-md transition hover:bg-blue-50 active:scale-[0.98]"
          >
            <Plus size={19} />
            ເພີ່ມພະນັກງານ
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                ພະນັກງານທັງໝົດ
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                {employees.length}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                ຕຳແໜ່ງ
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                {new Set(employees.map((item) => item.position)).size}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Shield size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                ຜົນການຄົ້ນຫາ
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                {filteredEmployees.length}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <UserCog size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ຄົ້ນຫາດ້ວຍຊື່, username, ຕຳແໜ່ງ ຫຼື ID..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Employee Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-bold text-slate-800">
              ລາຍຊື່ພະນັກງານ
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              ຂໍ້ມູນພະນັກງານໃນລະບົບ
            </p>
          </div>

          <div className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
            {filteredEmployees.length} ຄົນ
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center px-6 py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            <p className="mt-4 text-sm text-slate-500">
              ກຳລັງໂຫຼດຂໍ້ມູນ...
            </p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Users size={30} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-700">
              ບໍ່ພົບຂໍ້ມູນ
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {search
                ? 'ລອງປ່ຽນຄຳຄົ້ນຫາ'
                : 'ຍັງບໍ່ມີພະນັກງານໃນລະບົບ'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">ພະນັກງານ</th>
                  <th className="px-5 py-4">ຕຳແໜ່ງ</th>
                  <th className="px-5 py-4">Username</th>
                  <th className="px-5 py-4 text-right">ຈັດການ</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((item) => (
                  <tr
                    key={item.employee_id}
                    className="group transition hover:bg-blue-50/30"
                  >
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-semibold text-slate-400">
                        #{item.employee_id}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-sm">
                          {getInitials(item.fullname)}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800">
                            {item.fullname}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            Employee #{item.employee_id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                        <Shield size={13} />
                        {item.position}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-slate-100 px-3 py-1.5 font-mono text-xs font-medium text-slate-600">
                        {item.username}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
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
                            handleDelete(item.employee_id)
                          }
                          title="ລົບ"
                          className="rounded-xl p-2.5 text-rose-600 transition hover:bg-rose-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <div className="flex items-center gap-2 text-blue-600">
                  <UserCheck size={18} />

                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Employee
                  </span>
                </div>

                <h2 className="mt-1 text-xl font-bold text-slate-800">
                  {editingItem
                    ? 'ແກ້ໄຂຂໍ້ມູນພະນັກງານ'
                    : 'ເພີ່ມພະນັກງານໃໝ່'}
                </h2>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  ຊື່ ແລະ ນາມສະກຸນ
                </label>

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
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  ຕຳແໜ່ງ
                </label>

                <div className="relative">
                  <Shield
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        position: e.target.value,
                      })
                    }
                    placeholder="ເຊັ່ນ: Admin, Receptionist"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Username
                </label>

                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      username: e.target.value,
                    })
                  }
                  placeholder="ປ້ອນ username"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <LockKeyhole size={16} />
                  ລະຫັດຜ່ານ

                  {editingItem && (
                    <span className="font-normal text-slate-400">
                      (ປະຫວ່າງໄວ້ຖ້າບໍ່ປ່ຽນ)
                    </span>
                  )}
                </label>

                <input
                  type="password"
                  required={!editingItem}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  placeholder={
                    editingItem
                      ? 'ປ້ອນລະຫັດໃໝ່'
                      : 'ປ້ອນລະຫັດຜ່ານ'
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="rounded-xl px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ຍົກເລີກ
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  )}

                  {saving
                    ? 'ກຳລັງບັນທຶກ...'
                    : editingItem
                    ? 'ບັນທຶກການແກ້ໄຂ'
                    : 'ເພີ່ມພະນັກງານ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}