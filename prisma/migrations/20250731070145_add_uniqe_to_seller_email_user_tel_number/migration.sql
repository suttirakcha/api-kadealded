/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `sellers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tel_number]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `sellers_email_key` ON `sellers`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `users_tel_number_key` ON `users`(`tel_number`);
