-- Database bootstrap for STARTECH website services
-- Apply schema, then run `npx prisma db seed` to load products/showcase/pricing data.

CREATE TABLE `category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `category_id_idx` (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `services` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `product` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `price` DECIMAL(10, 2) NULL,
  `price_Type` ENUM('FIXED', 'CONTACT') NOT NULL,
  `rating` DECIMAL(2, 1) NOT NULL DEFAULT 0.0,
  `like` INT NULL DEFAULT 0,
  `completion_time` VARCHAR(100) NULL,
  `description` TEXT NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `demo_url` VARCHAR(255) NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `product_name_idx` (`name`),
  FULLTEXT INDEX `product_fulltext_idx` (`name`, `description`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `product_cat` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `product_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `unique_product_category` (`product_id`, `category_id`),
  INDEX `product_category_product_idx` (`product_id`),
  INDEX `product_category_category_idx` (`category_id`),
  CONSTRAINT `product_cat_product_id_fkey`
    FOREIGN KEY (`product_id`) REFERENCES `product`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `product_cat_category_id_fkey`
    FOREIGN KEY (`category_id`) REFERENCES `category`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `images` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `product_id` INT NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `images_product_idx` (`product_id`),
  CONSTRAINT `images_product_id_fkey`
    FOREIGN KEY (`product_id`) REFERENCES `product`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `product_service` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `product_id` INT NOT NULL,
  `service_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `product_service_product_idx` (`product_id`),
  INDEX `product_service_service_idx` (`service_id`),
  CONSTRAINT `product_service_product_id_fkey`
    FOREIGN KEY (`product_id`) REFERENCES `product`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `product_service_service_id_fkey`
    FOREIGN KEY (`service_id`) REFERENCES `services`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `feedback` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `comment` TEXT NOT NULL,
  `rating` DECIMAL(2, 1) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `feature` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `pricing_plan` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `price` DECIMAL(10, 2) NULL,
  `price_Type` ENUM('FIXED', 'CONTACT') NOT NULL,
  `description` TEXT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `pricing_feature` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `pricing_plan_id` INT NOT NULL,
  `feature_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `pricing_feature_plan_idx` (`pricing_plan_id`),
  INDEX `pricing_feature_feature_idx` (`feature_id`),
  CONSTRAINT `pricing_feature_pricing_plan_id_fkey`
    FOREIGN KEY (`pricing_plan_id`) REFERENCES `pricing_plan`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pricing_feature_feature_id_fkey`
    FOREIGN KEY (`feature_id`) REFERENCES `feature`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `showcase_item` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `image_url` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `website_url` VARCHAR(255) NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `showcase_item_display_order_idx` (`display_order`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `contact_submission` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `company` VARCHAR(191) NULL,
  `service` VARCHAR(191) NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('WAITING', 'VIEWED', 'PROCESSED') NOT NULL DEFAULT 'WAITING',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `contact_submission_email_idx` (`email`),
  INDEX `contact_submission_status_idx` (`status`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
