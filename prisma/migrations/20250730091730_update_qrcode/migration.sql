/*
  Warnings:

  - Added the required column `dealId` to the `QrCode` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `QrCode` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `QrCode` DROP FOREIGN KEY `QrCode_userId_fkey`;

-- DropIndex
DROP INDEX `QrCode_userId_fkey` ON `QrCode`;

-- AlterTable
ALTER TABLE `QrCode` ADD COLUMN `dealId` VARCHAR(191) NOT NULL,
    MODIFY `userId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `QrCode` ADD CONSTRAINT `QrCode_dealId_fkey` FOREIGN KEY (`dealId`) REFERENCES `deals`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QrCode` ADD CONSTRAINT `QrCode_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
