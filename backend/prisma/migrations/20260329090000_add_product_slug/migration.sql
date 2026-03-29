ALTER TABLE `product`
ADD COLUMN `slug` VARCHAR(191) NULL;

UPDATE `product`
SET `slug` = LOWER(
  TRIM(BOTH '-' FROM REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(`name`, ' ', '-'),
            '--',
            '-'
          ),
          '/',
          '-'
        ),
        '&',
        '-'
      ),
      ',',
      ''
    ),
    '.',
    ''
  ))
)
WHERE `slug` IS NULL;

CREATE UNIQUE INDEX `product_slug_unique` ON `product`(`slug`);
CREATE INDEX `product_slug_idx` ON `product`(`slug`);
