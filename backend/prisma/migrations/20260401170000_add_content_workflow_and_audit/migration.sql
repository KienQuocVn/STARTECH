ALTER TABLE `site_page`
  ADD COLUMN `workflow_status` ENUM('DRAFT', 'IN_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN `published_version_id` INT NULL,
  ADD COLUMN `submitted_at` DATETIME NULL,
  ADD COLUMN `approved_at` DATETIME NULL,
  ADD COLUMN `published_at` DATETIME NULL;

CREATE TABLE `site_page_version` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `page_id` INT NOT NULL,
  `version_number` INT NOT NULL,
  `workflow_status` ENUM('DRAFT', 'IN_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'PUBLISHED') NOT NULL,
  `snapshot_json` JSON NOT NULL,
  `notes` TEXT NULL,
  `approved_by` VARCHAR(191) NULL,
  `published_by` VARCHAR(191) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `site_page_version_page_version_unique`(`page_id`, `version_number`),
  INDEX `site_page_version_page_idx`(`page_id`),
  INDEX `site_page_version_status_idx`(`workflow_status`),
  CONSTRAINT `site_page_version_page_id_fkey`
    FOREIGN KEY (`page_id`) REFERENCES `site_page`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `content_audit_log` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `entity_type` VARCHAR(100) NOT NULL,
  `entity_id` VARCHAR(191) NULL,
  `action` VARCHAR(100) NOT NULL,
  `actor_id` VARCHAR(191) NULL,
  `metadata` JSON NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`),
  INDEX `content_audit_entity_idx`(`entity_type`, `entity_id`),
  INDEX `content_audit_action_idx`(`action`)
);

ALTER TABLE `site_page`
  ADD UNIQUE INDEX `site_page_published_version_id_key`(`published_version_id`),
  ADD INDEX `site_page_workflow_status_idx`(`workflow_status`);

ALTER TABLE `site_page`
  ADD CONSTRAINT `site_page_published_version_id_fkey`
    FOREIGN KEY (`published_version_id`) REFERENCES `site_page_version`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE;
