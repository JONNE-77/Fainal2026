'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

// Data Types Interfaces
interface RoomType {
  type_id: number;
  type_name: string;
  price: number;
}

interface Room {
  room_id: number;
  room_number: string;
  type_id: number;
  status: string;
  room_type: RoomType;
}

export default function RoomsPage() {
  // State Management
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [roomNumber, setRoomNumber] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // ==========================================
  // 1. Function ດຶງຂໍ້ມູນ Rooms ແລະ Room Types
  // ==========================================
  const loadData = async () => {
    try {
      const [roomsRes, typesRes] = await Promise.all([
        apiFetch<Room[]>('/api/rooms'),
        apiFetch<RoomType[]>('/api/room_type'),
      ]);
      setRooms(roomsRes);
      setRoomTypes(typesRes);
    } catch (err: any) {
      alert(err.message || 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ==========================================
  // 2. Function ປ່ຽນສະຖານະຫ້ອງ (ອັບເດດຜ່ານ Select Drop-down)
  // ==========================================
  const handleStatusChange = async (roomId: number, newStatus: string) => {
    try {
      // ສົ່ງ PUT Request ໄປທີ່ /api/rooms/[id]
      await apiFetch(`/api/rooms/${roomId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      alert(`ປ່ຽນສະຖານະຫ້ອງເປັນ ${newStatus} ສຳເລັດ!`);
      loadData(); // Reload ຂໍ້ມູນໃໝ່
    } catch (err: any) {
      alert(err.message || 'ເກີດຂໍ້ຜິດພາດໃນການປ່ຽນສະຖານະ');
    }
  };

  // ==========================================
  // 3. Function ເພີ່ມຫ້ອງພັກໃໝ່ (Create Room)
  // ==========================================
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber || !selectedType) return;

    try {
      await apiFetch('/api/rooms', {
        method: 'POST',
        body: JSON.stringify({
          room_number: roomNumber,
          type_id: Number(selectedType),
          status: 'AVAILABLE', // ຕັ້ງຄ່າເລີ່ມຕົ້ນເປັນ ຫວ່າງ
        }),
      });
      alert('ເພີ່ມຫ້ອງສຳເລັດ!');
      setRoomNumber('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'ເກີດຂໍ້ຜິດພາດ');
    }
  };

  // ==========================================
  // 4. Function ລົບຂໍ້ມູນຫ້ອງພັກ (Delete Room)
  // ==========================================
  const handleDeleteRoom = async (id: number) => {
    if (!confirm('ຢືນຢັນການລົບຫ້ອງນີ້?')) return;
    try {
      await apiFetch(`/api/rooms/${id}`, { method: 'DELETE' });
      alert('ລົບຫ້ອງສຳເລັດ!');
      loadData();
    } catch (err: any) {
      alert(err.message || 'ເກີດຂໍ້ຜິດພາດ');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">ຈັດການຂໍ້ມູນຫ້ອງພັກ</h1>

      {/* SECTION 1: Form ເພີ່ມຫ້ອງພັກໃໝ່ */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h2 className="text-lg font-bold mb-4">ເພີ່ມຫ້ອງພັກໃໝ່</h2>
        <form onSubmit={handleCreateRoom} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">ເລກຫ້ອງ (ເຊັ່ນ: 101, A2)</label>
            <input
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="101"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">ປະເພດຫ້ອງ</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- ເລືອກປະເພດຫ້ອງ --</option>
              {roomTypes.map((t) => (
                <option key={t.type_id} value={t.type_id}>
                  {t.type_name} ({Number(t.price).toLocaleString()} ກີບ)
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded font-bold hover:bg-blue-700">
            + ເພີ່ມຫ້ອງ
          </button>
        </form>
      </div>

      {/* SECTION 2: ຕາຕະລາງລາຍຊື່ຫ້ອງ ແລະ Selector ປ່ຽນສະຖານະ */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">ເລກຫ້ອງ</th>
              <th className="p-3">ປະເພດ</th>
              <th className="p-3">ລາຄາ</th>
              <th className="p-3">ສະຖານະ (ກົດເພື່ອປ່ຽນ)</th>
              <th className="p-3">ຈັດການ</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.room_id} className="border-b hover:bg-gray-50">
                <td className="p-3">#{room.room_id}</td>
                <td className="p-3 font-bold">ຫ້ອງ {room.room_number}</td>
                <td className="p-3">{room.room_type.type_name}</td>
                <td className="p-3">{Number(room.room_type.price).toLocaleString()} ກີບ</td>
                
                {/* Select Menu ສຳລັບປ່ຽນສະຖານະຫ້ອງ ແລະ ສະແດງຜົນພາສາອັງກິດ + ພາສາລາວ */}
                <td className="p-3">
                  <select
                    value={room.status}
                    onChange={(e) => handleStatusChange(room.room_id, e.target.value)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-bold border outline-none cursor-pointer shadow-sm ${
                      room.status === 'AVAILABLE'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : room.status === 'OCCUPIED'
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : room.status === 'CLEANING'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-gray-100 text-gray-800 border-gray-300'
                    }`}
                  >
                    <option value="AVAILABLE">AVAILABLE (ຫວ່າງ)</option>
                    <option value="OCCUPIED" disabled>
                      OCCUPIED (ມີຄົນພັກ)
                    </option>
                    <option value="CLEANING">CLEANING (ອະນາໄມ)</option>
                    <option value="MAINTENANCE">MAINTENANCE (ປັບປຸງ)</option>
                  </select>
                </td>

                <td className="p-3">
                  <button
                    onClick={() => handleDeleteRoom(room.room_id)}
                    className="text-red-600 hover:underline font-semibold text-sm"
                  >
                    ລົບ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}