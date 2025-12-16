-- AlterTable
ALTER TABLE `Order`
    ADD COLUMN `contactName` VARCHAR(191) NULL,
    ADD COLUMN `contactEmail` VARCHAR(191) NULL,
    ADD COLUMN `contactPhone` VARCHAR(191) NULL,
    ADD COLUMN `deliveryMethod` VARCHAR(191) NULL,
    ADD COLUMN `deliveryCity` VARCHAR(191) NULL,
    ADD COLUMN `deliveryAddress` VARCHAR(191) NULL,
    ADD COLUMN `deliveryNotes` VARCHAR(191) NULL;


