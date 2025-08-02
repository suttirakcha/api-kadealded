/*
  Warnings:

  - You are about to drop the column `max_participants` on the `joindeals` table. All the data in the column will be lost.
  - Added the required column `max_participants` to the `deals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `deals` ADD COLUMN `max_participants` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `joindeals` DROP COLUMN `max_participants`;
