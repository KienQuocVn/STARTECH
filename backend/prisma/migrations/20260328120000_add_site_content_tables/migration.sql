CREATE TABLE `site_page` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `seo_title` VARCHAR(191) NULL,
  `seo_description` TEXT NULL,
  `hero_badge` VARCHAR(191) NULL,
  `hero_title` VARCHAR(255) NULL,
  `hero_description` TEXT NULL,
  `created_by` VARCHAR(191) NULL,
  `updated_by` VARCHAR(191) NULL,
  `deleted_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

  UNIQUE INDEX `site_page_slug_key`(`slug`),
  INDEX `site_page_slug_idx`(`slug`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `page_section` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `page_id` INTEGER NOT NULL,
  `section_key` VARCHAR(100) NOT NULL,
  `title` VARCHAR(191) NULL,
  `subtitle` VARCHAR(191) NULL,
  `description` TEXT NULL,
  `image_url` VARCHAR(255) NULL,
  `primary_button_label` VARCHAR(100) NULL,
  `primary_button_href` VARCHAR(255) NULL,
  `secondary_button_label` VARCHAR(100) NULL,
  `secondary_button_href` VARCHAR(255) NULL,
  `content_json` JSON NULL,
  `display_order` INTEGER NOT NULL DEFAULT 0,
  `is_active` BOOLEAN NOT NULL DEFAULT true,
  `created_by` VARCHAR(191) NULL,
  `updated_by` VARCHAR(191) NULL,
  `deleted_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

  INDEX `page_section_page_id_idx`(`page_id`),
  INDEX `page_section_key_idx`(`section_key`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `faq_item` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `page_id` INTEGER NOT NULL,
  `question` VARCHAR(255) NOT NULL,
  `answer` TEXT NOT NULL,
  `display_order` INTEGER NOT NULL DEFAULT 0,
  `is_active` BOOLEAN NOT NULL DEFAULT true,
  `created_by` VARCHAR(191) NULL,
  `updated_by` VARCHAR(191) NULL,
  `deleted_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

  INDEX `faq_item_page_id_idx`(`page_id`),
  INDEX `faq_item_display_order_idx`(`display_order`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `site_setting` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `setting_key` VARCHAR(191) NOT NULL,
  `setting_val` TEXT NOT NULL,
  `type` VARCHAR(50) NOT NULL DEFAULT 'string',
  `created_by` VARCHAR(191) NULL,
  `updated_by` VARCHAR(191) NULL,
  `deleted_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

  UNIQUE INDEX `site_setting_setting_key_key`(`setting_key`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `page_section`
  ADD CONSTRAINT `page_section_page_id_fkey`
  FOREIGN KEY (`page_id`) REFERENCES `site_page`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `faq_item`
  ADD CONSTRAINT `faq_item_page_id_fkey`
  FOREIGN KEY (`page_id`) REFERENCES `site_page`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
