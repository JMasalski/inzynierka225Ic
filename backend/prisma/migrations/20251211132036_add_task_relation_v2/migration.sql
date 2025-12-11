-- AlterTable
ALTER TABLE `Task` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `_TaskGroups` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_TaskGroups_AB_unique`(`A`, `B`),
    INDEX `_TaskGroups_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_TaskGroups` ADD CONSTRAINT `_TaskGroups_A_fkey` FOREIGN KEY (`A`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TaskGroups` ADD CONSTRAINT `_TaskGroups_B_fkey` FOREIGN KEY (`B`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
