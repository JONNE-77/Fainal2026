'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  BarChart3,
  BedDouble,
  ClipboardList,
  DoorOpen,
  House,
  LogOut,
  Settings,
  ShieldCheck,
  Users,
  ChevronRight,
  Menu,
  X,
  Building2,
} from 'lucide-react';

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
  const pathname = usePathname();

  const [employee, setEmployee] = useState<EmployeeInfo | null>(null);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  useEffect(() => {
    const savedEmployee = localStorage.getItem('employee');
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    if (savedEmployee) {
      try {
        const parsedEmployee = JSON.parse(savedEmployee);

        const timer = window.setTimeout(() => {
          setEmployee(parsedEmployee);
        }, 0);

        return () => window.clearTimeout(timer);
      } catch (e) {
        console.error('Failed to parse employee data', e);
      }
    }
  }, [router]);

  const handleLogout = () => {
    if (confirm('ຢືນຢັນການອອກຈາກລະບົບ?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('employee');

      router.push('/login');
    }
  };

  const menuItems = [
    {
      href: '/',
      label: 'ພາບລວມລະບົບ',
      icon: House,
    },
    {
      href: '/rentals',
      label: 'ຈັດການການເຊົ່າ',
      icon: ClipboardList,
    },
    {
      href: '/rooms',
      label: 'ຈັດການຫ້ອງພັກ',
      icon: DoorOpen,
    },
    {
      href: '/room_types',
      label: 'ປະເພດຫ້ອງພັກ',
      icon: BedDouble,
    },
    {
      href: '/customers',
      label: 'ຈັດການລູກຄ້າ',
      icon: Users,
    },
    {
      href: '/employees',
      label: 'ຈັດການພະນັກງານ',
      icon: ShieldCheck,
    },
    {
      href: '/reports',
      label: 'ລາຍງານລາຍຮັບ',
      icon: BarChart3,
    },
  ];

  const settingItems = [
    {
      href: '/settings',
      label: 'ຕັ້ງຄ່າລະບົບ',
      icon: Settings,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }

    return pathname.startsWith(href);
  };

  const getInitial = () => {
    if (!employee?.fullname) return 'U';

    return employee.fullname.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================================================= */}
      {/* MOBILE TOP BAR */}
      {/* ================================================= */}

      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">

        <button
          onClick={() => setMobileSidebar(true)}
          className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100"
        >
          <Menu size={23} />
        </button>

        <div className="flex items-center gap-2">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
            <Building2 size={19} />
          </div>

          <span className="font-bold text-slate-800">
            GuestHouse
          </span>

        </div>

        <div className="h-9 w-9" />

      </div>


      {/* ================================================= */}
      {/* MOBILE OVERLAY */}
      {/* ================================================= */}

      {mobileSidebar && (
        <div
          onClick={() => setMobileSidebar(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
        />
      )}


      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-72 flex-col
          bg-slate-950 text-white
          shadow-2xl
          transition-transform duration-300
          lg:translate-x-0
          ${
            mobileSidebar
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >

        {/* ================================================= */}
        {/* LOGO */}
        {/* ================================================= */}

        <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">

          <Link
            href="/"
            onClick={() => setMobileSidebar(false)}
            className="flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
              <Building2 size={23} />
            </div>

            <div>
              <h1 className="text-base font-bold tracking-wide">
                GuestHouse
              </h1>

              <p className="text-[11px] text-slate-400">
                Management System
              </p>
            </div>

          </Link>


          {/* Mobile close */}
          <button
            onClick={() => setMobileSidebar(false)}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>

        </div>


        {/* ================================================= */}
        {/* MENU */}
        {/* ================================================= */}

        <div className="flex-1 overflow-y-auto px-3 py-6">

          {/* Main Menu */}
          <div>

            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Main Menu
            </p>


            <nav className="space-y-1">

              {menuItems.map((item) => {

                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSidebar(false)}
                    className={`
                      group relative flex items-center gap-3
                      rounded-xl px-3 py-3
                      text-sm font-medium
                      transition-all duration-200
                      ${
                        active
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }
                    `}
                  >

                    {/* Active Line */}
                    {active && (
                      <span className="absolute left-0 h-6 w-1 rounded-r-full bg-white" />
                    )}

                    <span
                      className={`
                        flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
                        ${
                          active
                            ? 'bg-white/15'
                            : 'bg-white/5 group-hover:bg-white/10'
                        }
                      `}
                    >
                      <Icon size={18} />
                    </span>

                    <span className="flex-1">
                      {item.label}
                    </span>

                    {active && (
                      <ChevronRight size={16} className="text-white/70" />
                    )}

                  </Link>
                );
              })}

            </nav>

          </div>


          {/* Settings */}
          <div className="mt-8">

            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              System
            </p>

            <nav className="space-y-1">

              {settingItems.map((item) => {

                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSidebar(false)}
                    className={`
                      group relative flex items-center gap-3
                      rounded-xl px-3 py-3
                      text-sm font-medium
                      transition-all
                      ${
                        active
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }
                    `}
                  >

                    {active && (
                      <span className="absolute left-0 h-6 w-1 rounded-r-full bg-white" />
                    )}

                    <span
                      className={`
                        flex h-9 w-9 items-center justify-center rounded-lg
                        ${
                          active
                            ? 'bg-white/15'
                            : 'bg-white/5 group-hover:bg-white/10'
                        }
                      `}
                    >
                      <Icon size={18} />
                    </span>

                    <span className="flex-1">
                      {item.label}
                    </span>

                    {active && (
                      <ChevronRight size={16} className="text-white/70" />
                    )}

                  </Link>
                );
              })}

            </nav>

          </div>

        </div>


        {/* ================================================= */}
        {/* USER PROFILE */}
        {/* ================================================= */}

        <div className="border-t border-white/10 p-3">

          <div className="rounded-2xl bg-white/5 p-3">

            <div className="flex items-center gap-3">

              {/* Avatar */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-lg">
                {getInitial()}
              </div>


              {/* Employee Info */}
              <div className="min-w-0 flex-1">

                <p className="truncate text-sm font-semibold text-white">
                  {employee?.fullname || 'User'}
                </p>

                <p className="truncate text-xs text-slate-400">
                  {employee?.position || 'Administrator'}
                </p>

              </div>

            </div>


            {/* Logout */}
            <button
              onClick={handleLogout}
              className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-400"
            >

              <LogOut size={17} />

              <span>
                ອອກຈາກລະບົບ
              </span>

            </button>

          </div>

        </div>

      </aside>


      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <div className="min-h-screen lg:pl-72">

        {/* Desktop Header */}
        <header className="sticky top-0 z-30 hidden h-20 items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 backdrop-blur-xl lg:flex xl:px-8">

          {/* Page title */}
          <div>

            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              GuestHouse Management
            </p>

            <h2 className="mt-0.5 text-lg font-bold text-slate-800">
              {pathname === '/'
                ? 'ພາບລວມລະບົບ'
                : 'Management Dashboard'}
            </h2>

          </div>


          {/* Employee */}
          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">

              <p className="text-sm font-semibold text-slate-700">
                {employee?.fullname || 'User'}
              </p>

              <p className="text-xs text-slate-400">
                {employee?.position || 'Administrator'}
              </p>

            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-md">
              {getInitial()}
            </div>

          </div>

        </header>


        {/* Content */}
        <main className="min-h-[calc(100vh-5rem)] p-4 sm:p-6 xl:p-8">
          {children}
        </main>

      </div>

    </div>
  );
}