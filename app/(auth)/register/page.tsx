'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [fullname, setFullname] = useState('');
  
  // ຕັ້ງຄ່າເລີ່ມຕົ້ນຂອງ Dropdown Position
  const [position, setPosition] = useState('Reception');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ fullname, position, username, password }),
      });

      setMessage('ລົງທະບຽນພະນັກງານສຳເລັດ! ກຳລັງໄປໜ້າ Login...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err: any) {
      setError(err.message || 'ເກີດຂໍ້ຜິດພາດໃນການລົງທະບຽນ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100">
        <h2 className="text-2xl font-black text-center text-slate-800 mb-2">
          📝 ເພີ່ມພະນັກງານໃໝ່
        </h2>
        <p className="text-xs text-center text-slate-500 mb-6">
          ລົງທະບຽນບັນຊີຜູ້ໃຊ້ງານສຳລັບພະນັກງານ/Admin
        </p>

        {message && <div className="bg-emerald-100 border border-emerald-300 text-emerald-700 p-3 rounded-lg mb-4 text-xs font-bold text-center">{message}</div>}
        {error && <div className="bg-rose-100 border border-rose-300 text-rose-700 p-3 rounded-lg mb-4 text-xs font-bold text-center">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ຊື່ ແລະ ນາມສະກຸນ</label>
            <input
              type="text"
              className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              placeholder="ທ້າວ/ນາງ....."
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </div>

          {/*  Dropdown Select ສຳລັບເລືອກຕຳແໜ່ງ (Position) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ຕຳແໜ່ງ (Position)</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold text-slate-700 bg-white"
              required
            >
              <option value="Admin">Admin(ຜູ້ດູແລລະບົບ)</option>
              <option value="Manager">Manager(ຜູ້ຈັດການ)</option>
              <option value="Reception">Reception(ພະນັກງານຕ້ອນຮັບ)</option>
              <option value="Housekeeping">Housekeeping(ພະນັກງານທຳຄວາມສະອາດ)</option>
              <option value="Staff">Staff(ພະນັກງານທົ່ວໄປ)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Username</label>
            <input
              type="text"
              className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              placeholder="ຕັ້ງ Username "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              placeholder="ຕັ້ງ Password "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 underline transition"
          >
            ກັບໄປໜ້າເຂົ້າສູ່ລະບົບ (Login)
          </button>
        </div>
      </div>
    </div>
  );
}