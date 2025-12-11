/*
  Warnings:

  - You are about to drop the column `functions_signature` on the `Task` table. All the data in the column will be lost.
  - Added the required column `function_signature` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Task` DROP COLUMN `functions_signature`,
    ADD COLUMN `function_signature` JSON NOT NULL;
