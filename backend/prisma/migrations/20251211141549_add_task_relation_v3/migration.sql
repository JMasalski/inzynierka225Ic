/*
  Warnings:

  - You are about to drop the column `functionSignature` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `testCases` on the `Task` table. All the data in the column will be lost.
  - Added the required column `functions_signature` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `test_cases` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Task` DROP COLUMN `functionSignature`,
    DROP COLUMN `testCases`,
    ADD COLUMN `functions_signature` JSON NOT NULL,
    ADD COLUMN `test_cases` JSON NOT NULL;
