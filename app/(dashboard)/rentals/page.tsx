'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

// ==========================================
// 1. Mapping Object ສຳລັບແປສະຖານະ (Status Translation)
// ==========================================
const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: 'AVAILABLE (ຫວ່າງ)',
  OCCUPIED: 'OCCUPIED (ມີຄົນພັກ)',
  CLEANING: 'CLEANING (ອະນາໄມ)',
  MAINTENANCE: 'MAINTENANCE (ປັບປຸງ)',
};

// Data Types Interfaces
interface Room {
  room_id: number;
  room_number: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'MAINTENANCE';
  room_type: {
    type_name: string;
    price: number;
  };
}

interface Rental {
  rental_id: number;
  customer_name?: string;
  phone?: string;
  total_amount: number;
  status: string;
  created_at: string;
  user?: {
    fullname: string;
    phone: string;
  };
  rental_details: {
    room: {
      room_number: string;
    };
  }[];
}

export default function RentalsPage() {
  // State Management
  const [rooms, setRooms] = useState<Room[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State ສຳລັບ Check-in
  const [customerName, setCustomerName] = useState(''); // 👈 State ຊື່-ນາມສະກຸນ
  const [phone, setPhone] = useState('');               // 👈 State ເບີໂທ
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [employeeId] = useState('1');                   // ID ພະນັກງານ
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  // ==========================================
  // 2. Function ດຶງຂໍ້ມູນຈາກ API (Fetch Data)
  // ==========================================
  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomsData, rentalsData] = await Promise.all([
        apiFetch<Room[]>('/api/rooms'),
        apiFetch<Rental[]>('/api/rentals'),
      ]);
      setRooms(roomsData);
      setRentals(rentalsData);
    } catch (err: any) {
      alert(err.message || 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==========================================
  // 3. Function ປ່ຽນສະຖານະຫ້ອງຈາກ CLEANING ➔ AVAILABLE
  // ==========================================
  const handleMarkAsCleaned = async (roomId: number, roomNumber: string) => {
    if (!confirm(`ຢືນຢັນວ່າຫ້ອງ ${roomNumber} ທຳຄວາມສະອາດແລ້ວ ແລະ ພ້ອມໃຫ້ເຊົ່າ?`)) return;

    try {
      await apiFetch(`/api/rooms/${roomId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'AVAILABLE' }),
      });
      alert(`ຫ້ອງ ${roomNumber} ກັບມາເປັນສະຖານະ AVAILABLE (ຫວ່າງ) ແລ້ວ!`);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'ເກີດຂໍ້ຜິດພາດໃນການອັບເດດສະຖານະຫ້ອງ');
    }
  };

  // ==========================================
  // 4. Function ບັນທຶກ Check-in
  // ==========================================
  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !selectedRoom || !checkIn || !checkOut) {
      alert('ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ');
      return;
    }

    const room = rooms.find((r) => r.room_id === selectedRoom);
    if (!room) return;

    try {
      await apiFetch('/api/rentals', {
        method: 'POST',
        body: JSON.stringify({
          customer_name: customerName, // 👈 ສົ່ງຊື່
          phone: phone,                 // 👈 ສົ່ງເບີໂທ
          employee_id: Number(employeeId),
          total_amount: Number(room.room_type.price),
          rooms: [
            {
              room_id: selectedRoom,
              check_in_date: new Date(checkIn).toISOString(),
              check_out_date: new Date(checkOut).toISOString(),
            },
          ],
        }),
      });

      alert('ບັນທຶກ Check-in ສຳເລັດ!');
      setCustomerName('');
      setPhone('');
      setSelectedRoom(null);
      setCheckIn('');
      setCheckOut('');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'ເກີດຂໍ້ຜິດພາດໃນການ Check-in');
    }
  };

  // ==========================================
  // 5. Function ບັນທຶກ Check-out
  // ==========================================
  const handleCheckOut = async (rentalId: number) => {
    if (!confirm(`ຢືນຢັນການ Check-out ສຳລັບລາຍການ ID #${rentalId}?`)) return;

    try {
      await apiFetch(`/api/rentals/${rentalId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'CHECKED_OUT' }),
      });
      alert('Check-out ສຳເລັດ! ຫ້ອງຖືກປ່ຽນສະຖານະເປັນ CLEANING (ອະນາໄມ)');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'ເກີດຂໍ້ຜິດພາດໃນການ Check-out');
    }
  };

  if (loading) return <div className="p-6 text-slate-600 font-medium">ກຳລັງໂຫຼດຂໍ້ມູນ...</div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">📋 ຈັດການການເຊົ່າ & Check-in</h1>
      </div>

      {/* SECTION 1: Grid Cards ສະແດງສະຖານະຫ້ອງພັກທັງໝົດ */}
      <section>
        <h2 className="text-lg font-bold text-slate-700 mb-4">ສະຖານະຫ້ອງພັກ</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {rooms.map((room) => (
            <div
              key={room.room_id}
              onClick={() => room.status === 'AVAILABLE' && setSelectedRoom(room.room_id)}
              className={`p-4 rounded-xl border-2 transition relative shadow-sm ${
                selectedRoom === room.room_id ? 'ring-4 ring-blue-500 border-blue-600' : ''
              } ${
                room.status === 'AVAILABLE'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900 cursor-pointer hover:bg-emerald-100'
                  : room.status === 'OCCUPIED'
                  ? 'bg-rose-50 border-rose-500 text-rose-900 cursor-not-allowed'
                  : 'bg-amber-50 border-amber-500 text-amber-900'
              }`}
            >
              <div className="text-xl font-extrabold">ຫ້ອງ {room.room_number}</div>
              <div className="text-sm opacity-80">{room.room_type.type_name}</div>
              <div className="text-base font-bold mt-2">
                {Number(room.room_type.price).toLocaleString()} ກີບ
              </div>

              {room.status === 'CLEANING' ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsCleaned(room.room_id, room.room_number);
                  }}
                  className="mt-3 w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-1.5 px-2 rounded-lg transition shadow"
                >
                  🧹 ທຳຄວາມສະອາດແລ້ວ
                </button>
              ) : (
                <span className="inline-block mt-3 px-2.5 py-0.5 text-xs font-black rounded-md bg-white/90 shadow-sm">
                  {STATUS_LABEL[room.status] || room.status}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Form Check-in ປ້ອນຂໍ້ມູນການເຊົ່າ */}
      <section className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          ຟອມ Check-in {selectedRoom ? `(ເລືອກຫ້ອງ ID: ${selectedRoom})` : ''}
        </h2>
        <form onSubmit={handleCheckIn} className="space-y-4">
          {/* ປ້ອນຂໍ້ມູນລູກຄ້າ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ຊື່ ແລະ ນາມສະກຸນລູກຄ້າ *</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="ປ້ອນຊື່ ແລະ ນາມສະກຸນ"
                className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ເບີໂທຕິດຕໍ່ *</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="020 XXXXXXXX"
                className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* ເລືອກຫ້ອງ ແລະ ວັນທີ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ເລືອກຫ້ອງຫວ່າງ *</label>
              <select
                value={selectedRoom || ''}
                onChange={(e) => setSelectedRoom(Number(e.target.value))}
                className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- ເລືອກຫ້ອງ --</option>
                {rooms
                  .filter((r) => r.status === 'AVAILABLE')
                  .map((r) => (
                    <option key={r.room_id} value={r.room_id}>
                      ຫ້ອງ {r.room_number} ({r.room_type.type_name})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ວັນທີ Check-in *</label>
              <input
                type="datetime-local"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ວັນທີ Check-out *</label>
              <input
                type="datetime-local"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!selectedRoom}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-lg transition disabled:bg-slate-300"
            >
              ບັນທຶກ Check-in
            </button>
          </div>
        </form>
      </section>

      {/* SECTION 3: ຕາຕະລາງປະວັດການເຊົ່າຫຼ້າສຸດ */}
      <section className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-lg text-slate-800">
          ປະວັດການເຊົ່າຫຼ້າສຸດ
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
              <tr>
                <th className="p-4">Rental ID</th>
                <th className="p-4">ຊື່ລູກຄ້າ</th>
                <th className="p-4">ເບີໂທ</th>
                <th className="p-4">ເລກຫ້ອງ</th>
                <th className="p-4">ຍອດລວມ</th>
                <th className="p-4">ສະຖານະ</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {rentals.map((item) => (
                <tr key={item.rental_id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-semibold">#{item.rental_id}</td>
                  <td className="p-4 font-medium text-slate-900">
                    {item.customer_name || item.user?.fullname || '-'}
                  </td>
                  <td className="p-4 text-slate-600">
                    {item.phone || item.user?.phone || '-'}
                  </td>
                  <td className="p-4 font-bold text-slate-900">
                    {item.rental_detail.map((d) => `ຫ້ອງ ${d.room.room_number}`).join(', ')}
                  </td>
                  <td className="p-4 font-semibold">
                    {Number(item.total_amount).toLocaleString()} ກີບ
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-bold ${
                        item.status === 'CHECKED_IN'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {item.status === 'CHECKED_IN' && (
                      <button
                        onClick={() => handleCheckOut(item.rental_id)}
                        className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded-md text-xs font-bold transition shadow-sm"
                      >
                        Check-out
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}