/*
  Warnings:

  - You are about to drop the column `first_name` on the `users` table. All the data in the column will be lost.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `users_tel_number_key` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `first_name`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;
