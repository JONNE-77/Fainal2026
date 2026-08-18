import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">📊 ພາບລວມລະບົບ (Dashboard)</h1>
        <p className="text-sm text-gray-500">ຍິນດີຕ້ອນຮັບເຂົ້າສູ່ລະບົບຈັດການບ້ານພັກ</p>
      </div>

      {/* Cards ສະຫຼຸບຂໍ້ມູນ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-2">
          <p className="text-sm font-medium text-gray-500">🚪 ຫ້ອງພັກທັງໝົດ</p>
          <p className="text-3xl font-bold text-gray-800">12 ຫ້ອງ</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-2">
          <p className="text-sm font-medium text-gray-500">🟢 ຫ້ອງຫວ່າງ</p>
          <p className="text-3xl font-bold text-green-600">8 ຫ້ອງ</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-2">
          <p className="text-sm font-medium text-gray-500">🔴 ມີຜູ້ເຊົ່າຢູ່</p>
          <p className="text-3xl font-bold text-red-600">4 ຫ້ອງ</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex gap-4">
        <Link
          href="/rooms"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          ໄປໜ້າຈັດການຫ້ອງພັກ →
        </Link>
        <Link
          href="/rentals"
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition text-sm font-medium"
        >
          ໄປໜ້າການເຊົ່າ/ຈອງ →
        </Link>
      </div>
    </div>
  );
}