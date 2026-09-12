'use client';

import { useEffect, useState } from 'react';
import {
  Settings,
  Building2,
  Clock3,
  Save,
  LockKeyhole,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    hotelName: '',
    phone: '',
    address: '',
    checkInTime: '14:00',
    checkOutTime: '12:00',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/setting')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setFormData(data);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      const res = await fetch('/api/setting', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('ບັນທຶກການຕັ້ງຄ່າຮຽບຮ້ອຍແລ້ວ');
      } else {
        alert('ເກີດຂໍ້ຜິດພາດ');
      }
    } catch (error) {
      console.error(error);
      alert('ບໍ່ສາມາດບັນທຶກຂໍ້ມູນໄດ້');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('ລະຫັດຜ່ານໃໝ່ບໍ່ກົງກັນ');
      return;
    }

    alert('ປ່ຽນລະຫັດຜ່ານສຳເລັດ (ຕົວຢ່າງ)');

    setPasswordData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="w-8 h-8 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin" />
          <span className="text-sm font-medium">
            ກຳລັງໂຫຼດການຕັ້ງຄ່າ...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">

      {/* PAGE HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-7 text-white shadow-lg">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
              <Settings size={27} />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">
                ຕັ້ງຄ່າລະບົບ
              </h1>

              <p className="text-sm text-blue-100 mt-1">
                ຈັດການຂໍ້ມູນບ້ານພັກ ແລະ ຄວາມປອດໄພຂອງບັນຊີ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-xs">
            <ShieldCheck size={16} />
            <span>System Settings</span>
          </div>
        </div>
      </div>

      {/* GENERAL SETTINGS */}
      <form
        onSubmit={handleSaveSettings}
        className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
      >
        {/* CARD HEADER */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 size={20} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                ຂໍ້ມູນບ້ານພັກ
              </h2>

              <p className="text-xs text-slate-400 mt-0.5">
                ຂໍ້ມູນທົ່ວໄປຂອງບ້ານພັກ / ໂຮງແຮມ
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <CheckCircle2 size={15} />
            General
          </div>
        </div>

        <div className="p-6 space-y-6">

          {/* HOTEL NAME + PHONE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* HOTEL NAME */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">
                ຊື່ບ້ານພັກ / ໂຮງແຮມ
              </label>

              <div className="relative">
                <Building2
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={formData.hotelName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hotelName: e.target.value,
                    })
                  }
                  placeholder="ຕົວຢ່າງ: Somchai Guesthouse"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">
                ເບີໂທຕິດຕໍ່
              </label>

              <div className="relative">
                <Phone
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    })
                  }
                  placeholder="020 XX XXX XXX"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>
          </div>

          {/* ADDRESS */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">
              ທີ່ຢູ່
            </label>

            <div className="relative">
              <MapPin
                size={17}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <textarea
                rows={3}
                value={formData.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: e.target.value,
                  })
                }
                placeholder="ປ້ອນທີ່ຢູ່ຂອງບ້ານພັກ..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 outline-none resize-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {/* CHECK IN / CHECK OUT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">
                ເວລາ Check-in ມາດຕະຖານ
              </label>

              <div className="relative">
                <Clock3
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500"
                />

                <input
                  type="time"
                  value={formData.checkInTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      checkInTime: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">
                ເວລາ Check-out ມາດຕະຖານ
              </label>

              <div className="relative">
                <Clock3
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500"
                />

                <input
                  type="time"
                  value={formData.checkOutTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      checkOutTime: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SAVE FOOTER */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            ກົດ Save ຫຼັງຈາກແກ້ໄຂຂໍ້ມູນ
          </p>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 transition"
          >
            <Save size={17} />

            {saving
              ? 'ກຳລັງບັນທຶກ...'
              : 'ບັນທຶກການຕັ້ງຄ່າ'}
          </button>
        </div>
      </form>

      {/* SECURITY */}
      <form
        onSubmit={handlePasswordChange}
        className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
      >
        {/* SECURITY HEADER */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <LockKeyhole size={20} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                ຄວາມປອດໄພບັນຊີ
              </h2>

              <p className="text-xs text-slate-400 mt-0.5">
                ປ່ຽນລະຫັດຜ່ານຂອງບັນຊີ
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
            <ShieldCheck size={15} />
            Security
          </div>
        </div>

        <div className="p-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* OLD PASSWORD */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">
                ລະຫັດຜ່ານເກົ່າ
              </label>

              <input
                type="password"
                required
                value={passwordData.oldPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    oldPassword: e.target.value,
                  })
                }
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* NEW PASSWORD */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">
                ລະຫັດຜ່ານໃໝ່
              </label>

              <input
                type="password"
                required
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">
                ຢືນຢັນລະຫັດຜ່ານໃໝ່
              </label>

              <input
                type="password"
                required
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {/* SECURITY NOTE */}
          <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3">
            <ShieldCheck
              size={18}
              className="text-amber-600 mt-0.5 shrink-0"
            />

            <div>
              <p className="text-xs font-bold text-amber-800">
                ຄຳແນະນຳດ້ານຄວາມປອດໄພ
              </p>

              <p className="text-[11px] text-amber-700 mt-1">
                ຄວນໃຊ້ລະຫັດຜ່ານທີ່ຄາດເດົາຍາກ ແລະບໍ່ຄວນແບ່ງປັນລະຫັດຜ່ານໃຫ້ຜູ້ອື່ນ.
              </p>
            </div>
          </div>
        </div>

        {/* PASSWORD BUTTON */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-sm font-bold transition"
          >
            <span className="flex items-center justify-center gap-2">
              <LockKeyhole size={16} />
              ປ່ຽນລະຫັດຜ່ານ
            </span>
          </button>
        </div>
      </form>

    </div>
  );
}