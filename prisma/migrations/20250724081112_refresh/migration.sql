/*
  Warnings:

  - You are about to drop the column `join_id` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `method` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `transaction_logs` table. All the data in the column will be lost.
  - You are about to drop the `joins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tiers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `waitlists` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `payment_method` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_status` to the `transaction_logs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `joins` DROP FOREIGN KEY `joins_deal_id_fkey`;

-- DropForeignKey
ALTER TABLE `joins` DROP FOREIGN KEY `joins_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `payments` DROP FOREIGN KEY `payments_join_id_fkey`;

-- DropForeignKey
ALTER TABLE `tiers` DROP FOREIGN KEY `tiers_creator_fkey`;

-- DropForeignKey
ALTER TABLE `tiers` DROP FOREIGN KEY `tiers_deal_id_fkey`;

-- DropForeignKey
ALTER TABLE `tiers` DROP FOREIGN KEY `tiers_updater_fkey`;

-- DropForeignKey
ALTER TABLE `waitlists` DROP FOREIGN KEY `waitlists_deal_id_fkey`;

-- DropForeignKey
ALTER TABLE `waitlists` DROP FOREIGN KEY `waitlists_user_id_fkey`;

-- DropIndex
DROP INDEX `payments_join_id_key` ON `payments`;

-- AlterTable
ALTER TABLE `payments` DROP COLUMN `join_id`,
    DROP COLUMN `method`,
    ADD COLUMN `join_deal_id` VARCHAR(191) NULL,
    ADD COLUMN `payment_method` ENUM('QR', 'TRANSFER', 'CARD') NOT NULL;

-- AlterTable
ALTER TABLE `transaction_logs` DROP COLUMN `status`,
    ADD COLUMN `payment_status` ENUM('PENDING', 'PAID') NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `coin` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `joins`;

-- DropTable
DROP TABLE `tiers`;

-- DropTable
DROP TABLE `waitlists`;

-- CreateTable
CREATE TABLE `pricetiers` (
    `id` VARCHAR(191) NOT NULL,
    `min_participants` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deal_id` VARCHAR(191) NOT NULL,
    `creator` VARCHAR(191) NOT NULL,
    `updater` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `joindeals` (
    `id` VARCHAR(191) NOT NULL,
    `participation_status` ENUM('JOINED', 'CANCELLED') NOT NULL,
    `max_participants` INTEGER NOT NULL,
    `notes` VARCHAR(191) NULL,
    `joined_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `confirm_at` DATETIME(3) NULL,
    `paid_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `deal_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Otp` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `otp_code` VARCHAR(191) NOT NULL,
    `otp_type` ENUM('VERIFY_EMAIL', 'FORGOT_PASSWORD') NOT NULL,
    `used` BOOLEAN NOT NULL DEFAULT false,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Otp_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pricetiers` ADD CONSTRAINT `pricetiers_deal_id_fkey` FOREIGN KEY (`deal_id`) REFERENCES `deals`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pricetiers` ADD CONSTRAINT `pricetiers_creator_fkey` FOREIGN KEY (`creator`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pricetiers` ADD CONSTRAINT `pricetiers_updater_fkey` FOREIGN KEY (`updater`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `joindeals` ADD CONSTRAINT `joindeals_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `joindeals` ADD CONSTRAINT `joindeals_deal_id_fkey` FOREIGN KEY (`deal_id`) REFERENCES `deals`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_join_deal_id_fkey` FOREIGN KEY (`join_deal_id`) REFERENCES `joindeals`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
