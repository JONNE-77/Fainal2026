'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  DollarSign,
  ShoppingBag,
  CalendarDays,
  Search,
  TrendingUp,
  User,
  Users,
  RefreshCw,
} from 'lucide-react';

export default function ReportsPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (startDate) {
        params.append('startDate', startDate);
      }

      if (endDate) {
        params.append('endDate', endDate);
      }

      const res = await fetch(`/api/report?${params.toString()}`, {
        cache: 'no-store',
      });

      const data = await res.json();

      if (res.ok) {
        setReportData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReport();
  };

  const totalRevenue = Number(
    reportData?.totals?.totalRevenue || 0
  );

  const totalRentals = reportData?.totals?.totalRentals || 0;

  const rentals = reportData?.rentals || [];

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 sm:p-8 text-white shadow-xl">

        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 right-32 h-48 w-48 rounded-full bg-white/5" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
                <FileText size={25} />
              </div>

              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                REPORT CENTER
              </span>
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">
              ລາຍງານລາຍຮັບ ແລະ ການເຊົ່າ
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-blue-100">
              ກວດສອບສະຖິຕິ ແລະ ລາຍຮັບຂອງລະບົບຕາມຊ່ວງວັນທີ
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50"
          >
            <Download size={18} />
            ພິມລາຍງານ / PDF
          </button>

        </div>
      </div>


      {/* ================= FILTER ================= */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="mb-5 flex items-center gap-3">

          <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
            <CalendarDays size={20} />
          </div>

          <div>
            <h2 className="font-bold text-slate-800">
              ກຳນົດຊ່ວງເວລາລາຍງານ
            </h2>

            <p className="text-xs text-slate-400">
              ເລືອກວັນທີເພື່ອກວດສອບລາຍຮັບ
            </p>
          </div>

        </div>

        <form
          onSubmit={handleFilter}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >

          {/* Start Date */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              ວັນທີເລີ່ມຕົ້ນ
            </label>

            <div className="relative">
              <CalendarDays
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>


          {/* End Date */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              ວັນທີສິ້ນສຸດ
            </label>

            <div className="relative">
              <CalendarDays
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>


          {/* Button */}
          <div className="flex items-end gap-2">

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  ກຳລັງຄົ້ນຫາ...
                </>
              ) : (
                <>
                  <Search size={18} />
                  ຄົ້ນຫາລາຍງານ
                </>
              )}
            </button>

          </div>

        </form>
      </div>


      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        {/* Revenue */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-50" />

          <div className="relative flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                ລາຍຮັບລວມທັງໝົດ
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {totalRevenue.toLocaleString()}
                <span className="ml-2 text-base font-semibold text-slate-400">
                  ₭
                </span>
              </p>

              <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <TrendingUp size={15} />
                ລາຍຮັບຕາມຊ່ວງວັນທີ
              </div>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-600 transition group-hover:scale-110">
              <DollarSign size={28} />
            </div>

          </div>
        </div>


        {/* Rentals */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-50" />

          <div className="relative flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                ຈຳນວນລາຍການເຊົ່າ
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {totalRentals}
                <span className="ml-2 text-base font-semibold text-slate-400">
                  ລາຍການ
                </span>
              </p>

              <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-blue-600">
                <ShoppingBag size={15} />
                ລາຍການທັງໝົດຕາມຊ່ວງວັນທີ
              </div>
            </div>

            <div className="rounded-2xl bg-blue-50 p-4 text-blue-600 transition group-hover:scale-110">
              <ShoppingBag size={28} />
            </div>

          </div>
        </div>

      </div>


      {/* ================= TABLE ================= */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        {/* Table Header */}
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

          <div>
            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                <FileText size={20} />
              </div>

              <h2 className="font-bold text-slate-800">
                ລາຍລະອຽດການເຮັດທຸລະກຳ
              </h2>

            </div>

            <p className="mt-1 pl-12 text-xs text-slate-400">
              ລາຍການການເຊົ່າທີ່ຢູ່ໃນຊ່ວງວັນທີທີ່ເລືອກ
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500">
            <ShoppingBag size={14} />
            {rentals.length} ລາຍການ
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

                <div className="h-4 w-24 rounded bg-slate-100" />
              </div>
            ))}

          </div>
        ) : rentals.length === 0 ? (

          /* Empty */
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

            <div className="mb-4 rounded-3xl bg-slate-100 p-5 text-slate-400">
              <FileText size={35} />
            </div>

            <h3 className="font-semibold text-slate-700">
              ບໍ່ພົບຂໍ້ມູນ
            </h3>

            <p className="mt-1 max-w-md text-sm text-slate-400">
              ບໍ່ພົບລາຍການການເຊົ່າໃນຊ່ວງວັນທີທີ່ເລືອກ
            </p>

          </div>

        ) : (

          /* Responsive Table */
          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px] text-left">

              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    ID
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    ລູກຄ້າ
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    ພະນັກງານ
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    ວັນທີເຮັດລາຍການ
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                    ຍອດເງິນ
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {rentals.map((item: any) => {

                  const customerName =
                    item.customer_name ||
                    item.user?.fullname ||
                    'ລູກຄ້າທົ່ວໄປ';

                  const employeeName =
                    item.employee?.fullname ||
                    'ບໍ່ລະບຸ';

                  return (
                    <tr
                      key={item.rental_id}
                      className="group transition hover:bg-blue-50/40"
                    >

                      {/* ID */}
                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                          #{item.rental_id}
                        </span>
                      </td>


                      {/* Customer */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-600">
                            {customerName.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {customerName}
                            </p>

                            {item.user?.phone && (
                              <p className="mt-0.5 text-xs text-slate-400">
                                {item.user.phone}
                              </p>
                            )}
                          </div>

                        </div>

                      </td>


                      {/* Employee */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2 text-sm text-slate-600">

                          <div className="rounded-lg bg-slate-100 p-2">
                            <User size={15} />
                          </div>

                          {employeeName}

                        </div>

                      </td>


                      {/* Date */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2 text-sm text-slate-500">

                          <CalendarDays
                            size={16}
                            className="text-slate-400"
                          />

                          {new Date(
                            item.created_at
                          ).toLocaleString('en-GB')}

                        </div>

                      </td>


                      {/* Amount */}
                      <td className="px-6 py-5 text-right">

                        <div className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-2 font-bold text-emerald-600">

                          <DollarSign size={15} />

                          {Number(
                            item.total_amount
                          ).toLocaleString()}

                          <span className="text-xs">
                            ₭
                          </span>

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


      {/* ================= FOOTER INFO ================= */}
      <div className="flex flex-col gap-2 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-xs text-blue-700 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-2">
          <Users size={15} />
          <span>
            ຂໍ້ມູນລາຍງານອ້າງອີງຈາກລາຍການການເຊົ່າໃນລະບົບ
          </span>
        </div>

        <span className="font-semibold">
          {rentals.length} ລາຍການ
        </span>

      </div>

    </div>
  );
}