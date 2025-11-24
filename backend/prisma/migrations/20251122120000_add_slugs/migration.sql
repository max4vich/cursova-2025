-- Add slug column to products
ALTER TABLE `Product` ADD COLUMN `slug` VARCHAR(191) NULL;
CREATE UNIQUE INDEX `Product_slug_key` ON `Product`(`slug`);

-- Add slug column to promotions
ALTER TABLE `Promotion` ADD COLUMN `slug` VARCHAR(191) NULL;
CREATE UNIQUE INDEX `Promotion_slug_key` ON `Promotion`(`slug`);

