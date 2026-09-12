'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();

  // State ສຳລັບສະຫຼັບໜ້າ Login (false) ຫຼື Register (true) ຢູ່ໃນ Card ດຽວກັນ
  const [isRegister, setIsRegister] = useState(false);

  // Form States ສຳລັບ Login
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Form States ສຳລັບ Register
  const [fullname, setFullname] = useState('');
  const [position, setPosition] = useState('Reception');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Status States
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // ==========================================
  // 1. Function ເຂົ້າສູ່ລະບົບ (Login)
  // ==========================================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await apiFetch<{ token: string; employee : any }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });

      // ບັນທຶກ Token ແລະ ຂໍ້ມູນພະນັກງານລົງ localStorage
      localStorage.setItem('token', res.token);
      localStorage.setItem('employee', JSON.stringify(res.employee));

      // Redirect ໄປໜ້າ Dashboard / Rentals
      router.push('/rentals');
    } catch (err: any) {
      setError(err.message || 'Username ຫຼື Password ບໍ່ຖືກຕ້ອງ');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 2. Function ລົງທະບຽນພະນັກງານໃໝ່ (Register)
  // ==========================================
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          fullname,
          position,
          username: regUsername,
          password: regPassword,
        }),
      });

      setSuccess('ລົງທະບຽນພະນັກງານໃໝ່ສຳເລັດ! ກະລຸນາເຂົ້າສູ່ລະບົບ');
      
      // ເຄຼຍຄ່າ Form Register
      setFullname('');
      setRegUsername('');
      setRegPassword('');
      setPosition('Reception');

      // ສະຫຼັບກັບມາໜ້າ Login ອັດໂຕໂນມັດຫຼັງຈາກ 1.5 ວິນາທີ
      setTimeout(() => {
        setIsRegister(false);
        setSuccess('');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'ເກີດຂໍ້ຜິດພາດໃນການລົງທະບຽນ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100">
        {/* Header Title */}
        <h2 className="text-2xl font-black text-center text-slate-800 mb-2">
          {isRegister ? '📝 ລົງທະບຽນພະນັກງານໃໝ່' : '🔑 ເຂົ້າສູ່ລະບົບພະນັກງານ'}
        </h2>
        <p className="text-xs text-center text-slate-500 mb-6">
          {isRegister ? 'ເພີ່ມບັນຊີ Admin / ພະນັກງານ ເຂົ້າໃນລະບົບ' : 'ລະບົບຈັດການຫຼັງບ້ານ (Back-office)'}
        </p>

        {/* Message Alert Display */}
        {error && <div className="bg-rose-100 border border-rose-300 text-rose-700 p-3 rounded-lg mb-4 text-xs font-bold text-center">{error}</div>}
        {success && <div className="bg-emerald-100 border border-emerald-300 text-emerald-700 p-3 rounded-lg mb-4 text-xs font-bold text-center">{success}</div>}

        {/* ========================================== */}
        {/* FORM 1: ຟອມ LOGIN                         */}
        {/* ========================================== */}
        {!isRegister ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Username</label>
              <input
                type="text"
                className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="ປ້ອນ Username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="ປ້ອນ Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow disabled:bg-slate-300"
            >
              {loading ? 'ກຳລັງເຂົ້າສູ່ລະບົບ...' : 'ເຂົ້າສູ່ລະບົບ'}
            </button>
          </form>
        ) : (
          /* ========================================== */
          /* FORM 2: ຟອມ REGISTER                      */
          /* ========================================== */
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ຊື່ ແລະ ນາມສະກຸນ</label>
              <input
                type="text"
                className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="ເຊັ່ນ: ທ້າວ ສົມຊາຍ ໃຈດີ"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            </div>

            {/*  ປ່ຽນຕຳແໜ່ງເປັນ Dropdown Select Menu */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ຕຳແໜ່ງ (Position)</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold text-slate-700 bg-white"
                required
              >
                <option value="Admin">Admin (ຜູ້ດູແລລະບົບ)</option>
                <option value="Manager">Manager (ຜູ້ຈັດການ)</option>
                <option value="Reception">Reception (ພະນັກງານຕ້ອນຮັບ)</option>
                <option value="Housekeeping">Housekeeping (ພະນັກງານທຳຄວາມສະອາດ)</option>
                <option value="Staff">Staff (ພະນັກງານທົ່ວໄປ)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Username</label>
              <input
                type="text"
                className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="ຕັ້ງ Username ສຳລັບ Login"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="ຕັ້ງ Password (ຢ່າງໜ້ອຍ 6 ຕົວ)"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition shadow disabled:bg-slate-300"
            >
              {loading ? 'ກຳລັງລົງທະບຽນ...' : 'ລົງທະບຽນພະນັກງານ'}
            </button>
          </form>
        )}

        {/* ========================================== */}
        {/* TOGGLE LINK: ປຸ່ມສະຫຼັບ LOGIN / REGISTER     */}
        {/* ========================================== */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
              setSuccess('');
            }}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 underline transition"
          >
            {isRegister
              ? 'ມີບັນຊີຢູ່ແລ້ວ? ກັບໄປໜ້າເຂົ້າສູ່ລະບົບ'
              : 'ຍັງບໍ່ມີບັນຊີ? ລົງທະບຽນພະນັກງານໃໝ່'}
          </button>
        </div>
      </div>
    </div>
  );
}