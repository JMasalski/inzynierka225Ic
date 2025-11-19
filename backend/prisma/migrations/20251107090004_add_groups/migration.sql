/*
  Warnings:

  - You are about to drop the column `teacherId` on the `Group` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Group` DROP FOREIGN KEY `Group_teacherId_fkey`;

-- DropIndex
DROP INDEX `Group_teacherId_fkey` ON `Group`;

-- AlterTable
ALTER TABLE `Group` DROP COLUMN `teacherId`;
