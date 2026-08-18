'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Interface ຂໍ້ມູນພະນັກງານ
interface EmployeeInfo {
  employee_id: number;
  fullname: string;
  position: string;
  username: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [employee, setEmployee] = useState<EmployeeInfo | null>(null);

  // ==========================================
  // 1. ດຶງຂໍ້ມູນ ພະນັກງານ ທີ່ກຳລັງ Login ຢູ່
  // ==========================================
  useEffect(() => {
    // ດຶງຂໍ້ມູນພະນັກງານຈາກ localStorage ທີ່ໄດ້ບັນທຶກໄວ້ຕອນ Login
    const savedEmployee = localStorage.getItem('employee');
    const token = localStorage.getItem('token');

    // ຖ້າບໍ່ມີ Token (ຍັງບໍ່ໄດ້ Login) ໃຫ້ Redirect ໄປໜ້າ Login ທັນທີ
    if (!token) {
      router.push('/login');
      return;
    }

    if (savedEmployee) {
      try {
        const parsedEmployee = JSON.parse(savedEmployee);
        setEmployee(parsedEmployee);

        // 💡 OPTIONAL: ຖ້າຢາກດຶງຂໍ້ມູນລ້າສຸດຈາກ Database ໂດຍຕົງຜ່ານ API
        // ສາມາດເອີ້ນໃຊ້ API GET /api/employee/[id] ໄດ້ດັ່ງນີ້:
        /*
        fetch(`/api/employee/${parsedEmployee.employee_id}`)
          .then((res) => res.json())
          .then((data) => setEmployee(data))
          .catch((err) => console.error("Failed to sync employee data", err));
        */
      } catch (e) {
        console.error('Failed to parse employee data', e);
      }
    }
  }, [router]);

  // ==========================================
  // 2. Function ອອກຈາກລະບົບ (Logout)
  // ==========================================
  const handleLogout = () => {
    if (confirm('ຢືນຢັນການອອກຈາກລະບົບ?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('employee');
      router.push('/login');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* ========================================== */}
      {/* LEFT SIDEBAR NAVIGATION                     */}
      {/* ========================================== */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col p-4 shadow-xl z-20">
        <div className="text-xl font-bold p-4 border-b border-slate-800 text-blue-400 flex items-center gap-2">
          <span>🏡</span> Guesthouse Admin
        </div>

        <nav className="flex-1 space-y-1.5 mt-6">
          <Link
            href="/rentals"
            className="block px-4 py-3 rounded-lg hover:bg-slate-800 transition font-medium text-slate-200 hover:text-white"
          >
            📋 ຈັດການການເຊົ່າ
          </Link>
          <Link
            href="/rooms"
            className="block px-4 py-3 rounded-lg hover:bg-slate-800 transition font-medium text-slate-200 hover:text-white"
          >
            🔑 ຈັດການຫ້ອງພັກ
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-lg transition mt-auto flex items-center justify-center gap-2 shadow"
        >
           ອອກຈາກລະບົບ
        </button>
      </aside>

      {/* ========================================== */}
      {/* MAIN CONTENT AREA WITH TOPBAR HEADER        */}
      {/* ========================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP HEADER BAR */}
        <header className="bg-white border-b border-slate-200 h-16 px-8 flex items-center justify-between shadow-sm sticky top-0 z-10">
          <div className="text-slate-500 font-medium text-sm">
            ລະບົບຈັດການຫຼັງບ້ານ (Back-office Management)
          </div>

          {/* 👤 ພາກສ່ວນສະແດງຂໍ້ມູນ ADMIN / ພະນັກງານ ແຈເທິງເບື້ອງຂວາ */}
          <div className="flex items-center gap-3">
            {employee ? (
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 py-1.5 px-3.5 rounded-full shadow-sm">
                {/* Profile Icon Placeholder */}
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow">
                  {employee.fullname ? employee.fullname.charAt(0).toUpperCase() : 'A'}
                </div>

                {/* ຂໍ້ມູນ Admin: ຊື່ເຕັມ, ຕຳແໜ່ງ, Username */}
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {employee.fullname}
                  </div>
                  <div className="text-[11px] text-slate-500 leading-tight">
                    <span className="font-semibold text-blue-600">{employee.position}</span> ({employee.username})
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400">ກຳລັງໂຫຼດຂໍ້ມູນຜູ້ໃຊ້...</div>
            )}
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}