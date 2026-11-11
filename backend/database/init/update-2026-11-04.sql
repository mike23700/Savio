-- ---------------------------------------------------------------------------
-- Paroisse Saint Dominique Savio — update an EXISTING database to 2026-11-04
--
-- Run this once in IONOS phpMyAdmin, on the database that already contains
-- the previous site data. It adds the four migrations introduced by the
-- remote update: multi-day events, movement members, sacrament requests and
-- product categories/extra images.
--
-- Do NOT run this on a fresh database created from savio-init.sql: everything
-- below is already included there.
--
-- If one statement fails because the column/table already exists, skip that
-- statement and continue with the next one.
-- ---------------------------------------------------------------------------

SET NAMES utf8mb4;

-- 2026_11_04_100000_add_end_date_to_events_table
ALTER TABLE `events`
    ADD COLUMN `end_date` date DEFAULT NULL AFTER `time`,
    ADD COLUMN `end_time` time DEFAULT NULL AFTER `end_date`;

-- 2026_11_04_100100_add_membres_to_mouvements_table
ALTER TABLE `mouvements`
    ADD COLUMN `membres` json DEFAULT NULL AFTER `image`;

-- 2026_11_04_100200_create_demandes_sacrement_table
CREATE TABLE IF NOT EXISTS `demandes_sacrement` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `user_id` bigint unsigned DEFAULT NULL,
    `sacrement_id` bigint unsigned DEFAULT NULL,
    `sacrement_nom` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `prenom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `telephone` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
    `personnes` json NOT NULL,
    `message` text COLLATE utf8mb4_unicode_ci,
    `statut` enum('nouvelle','en_cours','traitee','annulee') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'nouvelle',
    `created_at` timestamp NULL DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `demandes_sacrement_user_id_foreign` (`user_id`),
    KEY `demandes_sacrement_sacrement_id_foreign` (`sacrement_id`),
    CONSTRAINT `demandes_sacrement_sacrement_id_foreign` FOREIGN KEY (`sacrement_id`) REFERENCES `sacrements` (`id`) ON DELETE SET NULL,
    CONSTRAINT `demandes_sacrement_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `bans`
    ADD COLUMN `fiance1_age` tinyint unsigned DEFAULT NULL AFTER `fiance1_prenom`,
    ADD COLUMN `fiance2_age` tinyint unsigned DEFAULT NULL AFTER `fiance2_prenom`;

-- 2026_11_04_100300_create_product_categories_and_images
CREATE TABLE IF NOT EXISTS `product_categories` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `sort_order` int unsigned NOT NULL DEFAULT '0',
    `created_at` timestamp NULL DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `product_categories_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `products`
    ADD COLUMN `images` json DEFAULT NULL AFTER `img`;

-- Import the categories already used by existing products (like the Laravel
-- migration does). INSERT IGNORE skips a category whose slug already exists.
SET @cat_order := -1;
INSERT IGNORE INTO `product_categories` (`name`, `slug`, `sort_order`, `created_at`, `updated_at`)
SELECT `category`,
       LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(`category`), ' ', '-'), 'é', 'e'), 'è', 'e'), 'ê', 'e'), 'à', 'a')),
       (@cat_order := @cat_order + 1),
       NOW(),
       NOW()
FROM (
    SELECT DISTINCT `category`
    FROM `products`
    WHERE `category` IS NOT NULL AND `category` <> ''
) AS `p`;

-- Mark the four migrations as applied so a future `php artisan migrate` does
-- not try to run them again.
SET @batch := (SELECT COALESCE(MAX(`batch`), 0) + 1 FROM `migrations`);

INSERT INTO `migrations` (`migration`, `batch`)
SELECT '2026_11_04_100000_add_end_date_to_events_table', @batch
WHERE NOT EXISTS (SELECT 1 FROM `migrations` WHERE `migration` = '2026_11_04_100000_add_end_date_to_events_table');

INSERT INTO `migrations` (`migration`, `batch`)
SELECT '2026_11_04_100100_add_membres_to_mouvements_table', @batch
WHERE NOT EXISTS (SELECT 1 FROM `migrations` WHERE `migration` = '2026_11_04_100100_add_membres_to_mouvements_table');

INSERT INTO `migrations` (`migration`, `batch`)
SELECT '2026_11_04_100200_create_demandes_sacrement_table', @batch
WHERE NOT EXISTS (SELECT 1 FROM `migrations` WHERE `migration` = '2026_11_04_100200_create_demandes_sacrement_table');

INSERT INTO `migrations` (`migration`, `batch`)
SELECT '2026_11_04_100300_create_product_categories_and_images', @batch
WHERE NOT EXISTS (SELECT 1 FROM `migrations` WHERE `migration` = '2026_11_04_100300_create_product_categories_and_images');
