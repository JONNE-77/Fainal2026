/*
  Warnings:

  - You are about to drop the column `Check_in_date` on the `rental` table. All the data in the column will be lost.
  - You are about to drop the column `Check_out_date` on the `rental` table. All the data in the column will be lost.
  - Added the required column `Check_in_date` to the `Rental_detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Check_out_date` to the `Rental_detail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `rental` DROP COLUMN `Check_in_date`,
    DROP COLUMN `Check_out_date`;

-- AlterTable
ALTER TABLE `rental_detail` ADD COLUMN `Check_in_date` DATETIME(3) NOT NULL,
    ADD COLUMN `Check_out_date` DATETIME(3) NOT NULL;
