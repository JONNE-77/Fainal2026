import { z } from "zod";

// 1. Validation ສຳລັບ Auth (Login & Employee Register)
export const loginSchema = z.object({
  username: z.string().min(1, "ກະລຸນາປ້ອນ Username"),
  password: z.string().min(1, "ກະລຸນາປ້ອນ Password"),
});

export const employeeSchema = z.object({
  fullname: z.string().min(1, "ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນ"),
  position: z.string().min(1, "ກະລຸນາປ້ອນຕຳແໜ່ງ"),
  username: z.string().min(2, "Username ຕ້ອງມີຢ່າງໜ້ອຍ 3 ຕົວອັກສອນ"),
  password: z.string().min(3, "Password ຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ"),
});

// 2. Validation ສຳລັບ Room_type
export const roomTypeSchema = z.object({
  type_name: z.string().min(1, "ກະລຸນາປ້ອນຊື່ປະເພດຫ້ອງ"),
  price: z.number().positive("ລາຄາຕ້ອງຫຼາຍກວ່າ 0"),
});

// 3. Validation ສຳລັບ Room
export const roomSchema = z.object({
  room_number: z.string().min(1, "ກະລຸນາປ້ອນເລກຫ້ອງ"),
  type_id: z.number().int().positive("ກະລຸນາເລືອກປະເພດຫ້ອງ"),
  status: z.enum(["AVAILABLE", "OCCUPIED", "CLEANING", "MAINTENANCE"]).optional(),
});

// 4. Validation ສຳລັບ Rental (Check-in) — ປັບປຸງໃໝ່ ✨
export const createRentalSchema = z.object({
  customer_name: z.string().min(1, "ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນລູກຄ້າ"), // 👈 ເພີ່ມ
  phone: z.string().min(1, "ກະລຸນາປ້ອນເບີໂທຕິດຕໍ່"),                   // 👈 ເພີ່ມ
  user_id: z.number().int().positive().optional(),                        // 👈 ປ່ຽນເປັນ optional
  employee_id: z.number().int().positive("ກະລຸນາລະບຸ employee_id"),
  total_amount: z.number().positive("ຍອດລວມຕ້ອງຫຼາຍກວ່າ 0"),
  rooms: z.array(
    z.object({
      room_id: z.number().int().positive("ກະລຸນາລະບຸ room_id"),
      check_in_date: z.string().datetime({ message: "check_in_date Format ບໍ່ຖືກຕ້ອງ (ISO String)" }),
      check_out_date: z.string().datetime({ message: "check_out_date Format ບໍ່ຖືກຕ້ອງ (ISO String)" }),
    })
  ).min(1, "ຕ້ອງເລືອກຢ່າງໜ້ອຍ 1 ຫ້ອງ"),
});