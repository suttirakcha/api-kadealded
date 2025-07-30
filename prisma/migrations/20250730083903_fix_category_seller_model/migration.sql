/*
  Warnings:

  - You are about to drop the column `contact_info` on the `sellers` table. All the data in the column will be lost.
  - Added the required column `email` to the `sellers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tel_number` to the `sellers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `categories` ADD COLUMN `notes` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `sellers` DROP COLUMN `contact_info`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `tel_number` VARCHAR(191) NOT NULL;
