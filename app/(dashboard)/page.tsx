import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">ຍິນດີຕ້ອນຮັບເຂົ້າສູ່ລະບົບ Back-office</h1>
      <p className="text-gray-600">ລະບົບຈັດການການເຊົ່າ ແລະ ຫ້ອງພັກສຳລັບພະນັກງານ.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/rentals"
          className="p-6 bg-white rounded-xl shadow border hover:shadow-md transition block border-l-4 border-l-blue-600"
        >
          <h2 className="text-xl font-bold text-slate-800">📋 ຈັດການການເຊົ່າ & Check-in</h2>
          <p className="text-gray-500 text-sm mt-2">
            ບັນທຶກການເຊົ່າຂອງລູກຄ້າໜ້າເຄົາເຕີ, Check-in, ແລະ Check-out ຫ້ອງພັກ.
          </p>
        </Link>

        <Link
          href="/rooms"
          className="p-6 bg-white rounded-xl shadow border hover:shadow-md transition block border-l-4 border-l-green-600"
        >
          <h2 className="text-xl font-bold text-slate-800">🔑 ຈັດການຂໍ້ມູນຫ້ອງພັກ</h2>
          <p className="text-gray-500 text-sm mt-2">
            ເພີ່ມ, ແກ້ໄຂ, ແລະ ລົບ ຂໍ້ມູນຫ້ອງພັກ ແລະ ປະເພດຫ້ອງ.
          </p>
        </Link>
      </div>
    </div>
  );
}