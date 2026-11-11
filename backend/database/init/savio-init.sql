-- ---------------------------------------------------------------------------
-- Paroisse Saint Dominique Savio — initial database
-- Generated from the Laravel migrations + seeders.
--
-- Import this file into the IONOS database (phpMyAdmin → Import).
-- It contains DROP TABLE statements: existing tables in the target
-- database will be replaced.
--
-- Initial admin: admin@savio.com / 12345678
-- CHANGE THIS PASSWORD IMMEDIATELY after the first login.
-- To use another password before importing, replace the bcrypt hash in
-- the INSERT INTO `users` statement (see DEPLOYMENT.md §6.2).
-- ---------------------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP TABLE IF EXISTS `bans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fiance1_nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fiance1_prenom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fiance1_age` tinyint unsigned DEFAULT NULL,
  `fiance2_nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fiance2_prenom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fiance2_age` tinyint unsigned DEFAULT NULL,
  `mariage_date` date DEFAULT NULL,
  `statut` enum('nouveau','en_cours','publie','archive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'nouveau',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bans_user_id_foreign` (`user_id`),
  CONSTRAINT `bans_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `bans` WRITE;
/*!40000 ALTER TABLE `bans` DISABLE KEYS */;
/*!40000 ALTER TABLE `bans` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `catechese_inscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catechese_inscriptions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `niveau_id` bigint unsigned DEFAULT NULL,
  `age` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statut` enum('en_attente','confirmee','annulee') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en_attente',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `catechese_inscriptions_user_id_foreign` (`user_id`),
  KEY `catechese_inscriptions_niveau_id_foreign` (`niveau_id`),
  CONSTRAINT `catechese_inscriptions_niveau_id_foreign` FOREIGN KEY (`niveau_id`) REFERENCES `catechese_niveaux` (`id`) ON DELETE SET NULL,
  CONSTRAINT `catechese_inscriptions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `catechese_inscriptions` WRITE;
/*!40000 ALTER TABLE `catechese_inscriptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `catechese_inscriptions` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `catechese_niveaux`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catechese_niveaux` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `age_label` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `duree` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `catechese_niveaux` WRITE;
/*!40000 ALTER TABLE `catechese_niveaux` DISABLE KEYS */;
INSERT INTO `catechese_niveaux` (`id`, `nom`, `age_label`, `icon`, `description`, `duree`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES (1,'Éveil à la foi','5-6 ans','🌱','Introduction douce à la foi chrétienne pour les tout-petits. Découverte de Dieu à travers des histoires, des chants et des activités adaptées.','1 an',0,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(2,'1ère Année','7-8 ans','📖','Approfondissement de la foi, préparation à la première réconciliation et découverte des sacrements.','1 an',1,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(3,'2e Année','9-10 ans','✝️','Préparation à la première communion. Découverte de l\'Eucharistie et de sa place dans la vie chrétienne.','1 an',2,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(4,'3e Année','11-12 ans','🕊️','Approfondissement de la vie chrétienne, préparation à la confirmation et engagement dans la communauté.','1 an',3,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(5,'Préparation au Mariage','Adultes','💍','Parcours complet pour les couples souhaitant se marier à l\'Église. Sessions collectives et entretiens personnels.','6 mois',4,1,'2026-11-05 12:45:47','2026-11-05 12:45:47');
/*!40000 ALTER TABLE `catechese_niveaux` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_messages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sujet` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `statut` enum('nouveau','traite','archive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'nouveau',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contact_messages_user_id_foreign` (`user_id`),
  CONSTRAINT `contact_messages_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `daily_readings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `daily_readings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `liturgical_day` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reading_1` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reading_1_text` text COLLATE utf8mb4_unicode_ci,
  `psalm` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `psalm_text` text COLLATE utf8mb4_unicode_ci,
  `reading_2` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reading_2_text` text COLLATE utf8mb4_unicode_ci,
  `gospel` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gospel_text` text COLLATE utf8mb4_unicode_ci,
  `gospel_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `daily_readings_date_unique` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `daily_readings` WRITE;
/*!40000 ALTER TABLE `daily_readings` DISABLE KEYS */;
/*!40000 ALTER TABLE `daily_readings` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `demandes_sacrement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `demandes_sacrement` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `demandes_sacrement` WRITE;
/*!40000 ALTER TABLE `demandes_sacrement` DISABLE KEYS */;
/*!40000 ALTER TABLE `demandes_sacrement` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `donations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `projet_id` bigint unsigned DEFAULT NULL,
  `montant` decimal(12,0) NOT NULL,
  `payment_method` enum('orange_money','mtn_momo','especes') COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` enum('en_attente','paye','echoue','annule') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en_attente',
  `intention` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_reference` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_provider` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_provider_status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_details` text COLLATE utf8mb4_unicode_ci,
  `confirmed_by_user_id` bigint unsigned DEFAULT NULL,
  `confirmed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `donations_user_id_foreign` (`user_id`),
  KEY `donations_confirmed_by_user_id_foreign` (`confirmed_by_user_id`),
  KEY `donations_payment_reference_index` (`payment_reference`),
  KEY `donations_projet_id_foreign` (`projet_id`),
  CONSTRAINT `donations_confirmed_by_user_id_foreign` FOREIGN KEY (`confirmed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `donations_projet_id_foreign` FOREIGN KEY (`projet_id`) REFERENCES `projets` (`id`) ON DELETE SET NULL,
  CONSTRAINT `donations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `donations` WRITE;
/*!40000 ALTER TABLE `donations` DISABLE KEYS */;
/*!40000 ALTER TABLE `donations` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `espaces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `espaces` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `kind` enum('chambre','salle') COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resume` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `capacite` smallint unsigned DEFAULT NULL,
  `quantite` smallint unsigned NOT NULL DEFAULT '1',
  `prix` decimal(12,0) DEFAULT NULL,
  `equipements` json DEFAULT NULL,
  `photos` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `espaces_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `espaces` WRITE;
/*!40000 ALTER TABLE `espaces` DISABLE KEYS */;
INSERT INTO `espaces` (`id`, `kind`, `nom`, `slug`, `resume`, `description`, `capacite`, `quantite`, `prix`, `equipements`, `photos`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES (1,'chambre','Chambre individuelle','chambre-individuelle','Chambre calme pour une personne, idéale pour une retraite ou un séjour de passage.','Chambre individuelle du centre d\'accueil paroissial, au calme, à deux pas de l\'église.\nLe petit-déjeuner peut être servi sur demande auprès du secrétariat.',1,4,10000,'[\"Lit simple\", \"Ventilateur\", \"Salle d\'eau privée\", \"Wi-Fi\", \"Bureau\"]','[\"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&h=800&fit=crop&auto=format\"]',1,0,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(2,'chambre','Chambre double','chambre-double','Chambre pour deux personnes (grand lit ou deux lits), climatisée.','Chambre double climatisée du centre d\'accueil, adaptée aux couples, familles de passage ou membres de délégations.',2,3,15000,'[\"Grand lit ou 2 lits\", \"Climatisation\", \"Salle d\'eau privée\", \"Wi-Fi\", \"Moustiquaire\"]','[\"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop&auto=format\"]',1,1,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(3,'salle','Grande salle polyvalente','grande-salle-polyvalente','Pour mariages, réceptions, conférences et grandes rencontres.','Grande salle de la paroisse pouvant accueillir jusqu\'à 300 personnes : réceptions de mariage, baptêmes, communions, conférences, concerts.\nLe ménage et la sonorisation peuvent être prévus en option avec le secrétariat.',300,1,100000,'[\"300 chaises\", \"Tables\", \"Sonorisation\", \"Scène\", \"Parking\", \"Toilettes\"]','[\"https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&h=800&fit=crop&auto=format\"]',1,2,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(4,'salle','Salle de réunion','salle-de-reunion','Pour réunions, formations, séminaires et petites rencontres.','Salle équipée pour les réunions, formations et séminaires jusqu\'à 40 personnes.',40,1,25000,'[\"40 places assises\", \"Vidéoprojecteur\", \"Tableau blanc\", \"Climatisation\", \"Wi-Fi\"]','[\"https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=800&fit=crop&auto=format\"]',1,3,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(5,'salle','Esplanade de la paroisse','esplanade-de-la-paroisse','Espace extérieur pour les grands événements — tarif sur devis.','Esplanade extérieure pour les grands rassemblements. Le tarif dépend de l\'événement : envoyez votre demande, le secrétariat vous recontacte avec un devis.',800,1,NULL,'[\"Espace plein air\", \"Accès électricité\", \"Parking\"]','[\"https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&h=800&fit=crop&auto=format\"]',1,4,'2026-11-05 12:45:48','2026-11-05 12:45:48');
/*!40000 ALTER TABLE `espaces` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `event_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#0B3D91',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `event_categories_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `event_categories` WRITE;
/*!40000 ALTER TABLE `event_categories` DISABLE KEYS */;
INSERT INTO `event_categories` (`id`, `name`, `slug`, `color`, `sort_order`, `created_at`, `updated_at`) VALUES (1,'Messe','messe','#0B3D91',0,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(2,'Sacrement','sacrement','#D4AF37',1,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(3,'Adoration','adoration','#7c3aed',2,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(4,'Catéchèse','catechese','#059669',3,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(5,'Communauté','communaute','#d97706',4,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(6,'Spiritualité','spiritualite','#dc2626',5,'2026-11-05 12:45:48','2026-11-05 12:45:48');
/*!40000 ALTER TABLE `event_categories` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `event_category_id` bigint unsigned DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `time` time DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_published` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `events_event_category_id_foreign` (`event_category_id`),
  KEY `events_date_time_index` (`date`,`time`),
  CONSTRAINT `events_event_category_id_foreign` FOREIGN KEY (`event_category_id`) REFERENCES `event_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` (`id`, `event_category_id`, `title`, `date`, `time`, `end_date`, `end_time`, `location`, `description`, `is_published`, `created_at`, `updated_at`) VALUES (1,1,'Messe dominicale','2026-09-14','07:00:00',NULL,NULL,'Église principale',NULL,1,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(2,1,'Messe dominicale','2026-09-14','09:00:00',NULL,NULL,'Église principale',NULL,1,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(3,1,'Messe principale','2026-09-14','11:00:00',NULL,NULL,'Église principale',NULL,1,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(4,1,'Messe du soir','2026-09-14','18:30:00',NULL,NULL,'Église principale',NULL,1,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(5,1,'Messe quotidienne + Adoration','2026-09-15','06:30:00',NULL,NULL,'Église principale',NULL,1,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(6,3,'Adoration (journée)','2026-09-17','07:15:00',NULL,NULL,'Église principale',NULL,1,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(7,2,'Confessions','2026-09-17','17:00:00',NULL,NULL,'Confessionnaux',NULL,1,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(8,1,'Messe des malades','2026-09-19','18:30:00',NULL,NULL,'Église principale',NULL,1,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(9,5,'Réunion CEV Saint-Joseph','2026-09-20','15:00:00',NULL,NULL,'Salle paroissiale',NULL,1,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(10,4,'Catéchèse des enfants','2026-09-21','09:00:00',NULL,NULL,'Salles de catéchèse',NULL,1,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(11,2,'Baptêmes d\'enfants','2026-09-26','09:00:00',NULL,NULL,'Fonts baptismaux',NULL,1,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(12,5,'Assemblée paroissiale','2026-09-28','10:00:00',NULL,NULL,'Grande salle',NULL,1,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(13,6,'Retraite spirituelle des jeunes (Jour 1)','2026-10-10','08:00:00',NULL,NULL,'Centre de Bonabéri',NULL,1,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(14,6,'Retraite spirituelle des jeunes (Jour 2)','2026-10-11','08:00:00',NULL,NULL,'Centre de Bonabéri',NULL,1,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(15,6,'Retraite spirituelle des jeunes (Jour 3)','2026-10-12','08:00:00',NULL,NULL,'Centre de Bonabéri',NULL,1,'2026-11-05 12:45:48','2026-11-05 12:45:48');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `favorite_homelies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorite_homelies` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `homelie_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `favorite_homelies_user_id_homelie_id_unique` (`user_id`,`homelie_id`),
  KEY `favorite_homelies_homelie_id_foreign` (`homelie_id`),
  CONSTRAINT `favorite_homelies_homelie_id_foreign` FOREIGN KEY (`homelie_id`) REFERENCES `homelies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favorite_homelies_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `favorite_homelies` WRITE;
/*!40000 ALTER TABLE `favorite_homelies` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorite_homelies` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `homelies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `homelies` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `priest` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `readings` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reading_1` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `psalm` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reading_2` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gospel` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sunday` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `duration` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `excerpt` text COLLATE utf8mb4_unicode_ci,
  `img` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `published_at` datetime NOT NULL,
  `audio_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pdf_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `homelies_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `homelies` WRITE;
/*!40000 ALTER TABLE `homelies` DISABLE KEYS */;
INSERT INTO `homelies` (`id`, `title`, `slug`, `priest`, `readings`, `reading_1`, `psalm`, `reading_2`, `gospel`, `sunday`, `duration`, `excerpt`, `img`, `published_at`, `audio_url`, `pdf_url`, `is_published`, `created_at`, `updated_at`) VALUES (1,'Hosanna ! – Dimanche des Rameaux','hosanna-dimanche-des-rameaux','Père Curé','Is 50,4-7 · Ph 2,6-11 · Lc 22,14 – 23,56',NULL,NULL,NULL,NULL,'Dimanche des Rameaux','18 min','En ce dimanche des Rameaux, nous entrons dans la Semaine Sainte en suivant Jésus dans sa montée vers Jérusalem...','https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=400&h=240&fit=crop&auto=format','2026-09-10 09:00:00',NULL,NULL,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(2,'La Croix Glorieuse – Source de salut','la-croix-glorieuse-source-de-salut','Père Curé','Nb 21,4b-9 · Ph 2,6-11 · Jn 3,13-17',NULL,NULL,NULL,NULL,'Fête de la Croix Glorieuse','22 min','Aujourd\'hui, nous célébrons la fête de la Croix Glorieuse. La croix est le signe par excellence de l\'amour de Dieu pour l\'humanité...','https://images.unsplash.com/photo-1687459730891-47dfa3217811?w=400&h=240&fit=crop&auto=format','2026-09-14 09:00:00',NULL,NULL,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(3,'Là où est ton trésor – Matthieu 6','la-ou-est-ton-tresor-matthieu-6','Père Curé','Am 6,1a.4-7 · 1Tm 6,11-16 · Lc 16,19-31',NULL,NULL,NULL,NULL,'26ᵉ dimanche du Temps ordinaire','20 min','L\'Évangile de ce dimanche nous invite à réfléchir sur nos priorités et sur ce qui compte vraiment dans nos vies...','https://images.unsplash.com/photo-1573591012925-76dd1f406bd1?w=400&h=240&fit=crop&auto=format','2026-09-07 09:00:00',NULL,NULL,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(4,'Perdre sa vie pour la trouver','perdre-sa-vie-pour-la-trouver','Père Curé','Jr 20,7-9 · Rm 12,1-2 · Mt 16,21-27',NULL,NULL,NULL,NULL,'22ᵉ dimanche du Temps ordinaire','19 min','Jésus nous invite aujourd\'hui à prendre notre croix et à le suivre. Mais que signifie concrètement ce chemin de renoncement ?','https://images.unsplash.com/photo-1515657241610-a6b33f0f6c5a?w=400&h=240&fit=crop&auto=format','2026-08-31 09:00:00',NULL,NULL,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(5,'Tu es Pierre et sur cette pierre','tu-es-pierre-et-sur-cette-pierre','Père Curé','Is 22,19-23 · Rm 11,33-36 · Mt 16,13-20',NULL,NULL,NULL,NULL,'21ᵉ dimanche du Temps ordinaire','17 min','La question que Jésus pose à ses disciples est fondamentale : « Et vous, qui dites-vous que je suis ? »','https://images.unsplash.com/photo-1631648859463-a42e6ce6d1e4?w=400&h=240&fit=crop&auto=format','2026-08-24 09:00:00',NULL,NULL,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(6,'Le pain vivant descendu du ciel','le-pain-vivant-descendu-du-ciel','Père Curé','Pr 9,1-6 · Ep 5,15-20 · Jn 6,51-58',NULL,NULL,NULL,NULL,'20ᵉ dimanche du Temps ordinaire','21 min','L\'Eucharistie est au cœur de notre foi. Jésus se donne lui-même comme nourriture pour notre vie spirituelle...','https://images.unsplash.com/photo-1763517789508-f23012039417?w=400&h=240&fit=crop&auto=format','2026-08-17 09:00:00',NULL,NULL,1,'2026-11-05 12:45:47','2026-11-05 12:45:47');
/*!40000 ALTER TABLE `homelies` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `intentions_messe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `intentions_messe` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_souhaitee` date DEFAULT NULL,
  `heure_souhaitee` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `messe_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statut` enum('en_attente','planifiee','celebree','annulee') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en_attente',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `intentions_messe_user_id_foreign` (`user_id`),
  CONSTRAINT `intentions_messe_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `intentions_messe` WRITE;
/*!40000 ALTER TABLE `intentions_messe` DISABLE KEYS */;
/*!40000 ALTER TABLE `intentions_messe` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `journal_issues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `journal_issues` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `numero` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `theme` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `published_at` date NOT NULL,
  `pdf_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `journal_issues` WRITE;
/*!40000 ALTER TABLE `journal_issues` DISABLE KEYS */;
INSERT INTO `journal_issues` (`id`, `numero`, `theme`, `published_at`, `pdf_url`, `created_at`, `updated_at`) VALUES (1,'N°38','Fête de la Croix Glorieuse','2026-09-15',NULL,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(2,'N°37','Nativité de la Vierge Marie','2026-09-08',NULL,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(3,'N°36','22e dimanche du Temps ordinaire','2026-09-01',NULL,'2026-11-05 12:45:48','2026-11-05 12:45:48');
/*!40000 ALTER TABLE `journal_issues` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `journal_subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `journal_subscriptions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `tarif_id` bigint unsigned DEFAULT NULL,
  `format` enum('electronique','papier') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'electronique',
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `started_at` date NOT NULL,
  `expires_at` date DEFAULT NULL,
  `deactivated_by_user_id` bigint unsigned DEFAULT NULL,
  `deactivated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `journal_subscriptions_user_id_foreign` (`user_id`),
  KEY `journal_subscriptions_tarif_id_foreign` (`tarif_id`),
  KEY `journal_subscriptions_deactivated_by_user_id_foreign` (`deactivated_by_user_id`),
  CONSTRAINT `journal_subscriptions_deactivated_by_user_id_foreign` FOREIGN KEY (`deactivated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `journal_subscriptions_tarif_id_foreign` FOREIGN KEY (`tarif_id`) REFERENCES `journal_tarifs` (`id`) ON DELETE SET NULL,
  CONSTRAINT `journal_subscriptions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `journal_subscriptions` WRITE;
/*!40000 ALTER TABLE `journal_subscriptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `journal_subscriptions` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `journal_tarifs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `journal_tarifs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `issues` int unsigned NOT NULL,
  `period` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `journal_tarifs` WRITE;
/*!40000 ALTER TABLE `journal_tarifs` DISABLE KEYS */;
INSERT INTO `journal_tarifs` (`id`, `label`, `price_label`, `issues`, `period`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES (1,'Mensuel','500 FCFA',4,'1 mois',0,1,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(2,'Trimestriel','1 500 FCFA',12,'3 mois',1,1,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(3,'Semestriel','3 000 FCFA',24,'6 mois',2,1,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(4,'Annuel','6 000 FCFA',52,'1 an',3,1,'2026-11-05 12:45:48','2026-11-05 12:45:48');
/*!40000 ALTER TABLE `journal_tarifs` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `mass_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mass_schedules` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `group_label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `weekdays` json DEFAULT NULL,
  `recurrence_type` enum('weekly','monthly_nth_weekday','special') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'weekly',
  `nth_week_of_month` tinyint unsigned DEFAULT NULL,
  `time` time DEFAULT NULL,
  `time_label` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `counts_as_mass` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `mass_schedules` WRITE;
/*!40000 ALTER TABLE `mass_schedules` DISABLE KEYS */;
INSERT INTO `mass_schedules` (`id`, `group_label`, `weekdays`, `recurrence_type`, `nth_week_of_month`, `time`, `time_label`, `type`, `note`, `counts_as_mass`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES (1,'Lundi – Vendredi','[1, 2, 3, 4, 5]','weekly',NULL,'06:30:00',NULL,'Messe',NULL,1,630,1,'2026-11-05 12:45:46','2026-11-05 12:45:46'),(2,'Lundi – Vendredi','[1, 2, 3, 4, 5]','weekly',NULL,'12:30:00',NULL,'Messe',NULL,1,1230,1,'2026-11-05 12:45:46','2026-11-05 12:45:46'),(3,'Lundi, Mardi, Jeudi & Vendredi','[1, 2, 4, 5]','weekly',NULL,'18:30:00',NULL,'Messe',NULL,1,1830,1,'2026-11-05 12:45:46','2026-11-05 12:45:46'),(4,'Samedi','[6]','weekly',NULL,'06:30:00',NULL,'Messe',NULL,1,50630,1,'2026-11-05 12:45:46','2026-11-05 12:45:46'),(5,'Samedi','[6]','weekly',NULL,'18:30:00',NULL,'Messe dominicale anticipée',NULL,1,51830,1,'2026-11-05 12:45:46','2026-11-05 12:45:46'),(6,'Dimanche','[0]','weekly',NULL,'06:30:00',NULL,'Messe dominicale',NULL,1,60630,1,'2026-11-05 12:45:46','2026-11-05 12:45:46'),(7,'Dimanche','[0]','weekly',NULL,'08:00:00',NULL,'Messe dominicale',NULL,1,60800,1,'2026-11-05 12:45:46','2026-11-05 12:45:46'),(8,'Dimanche','[0]','weekly',NULL,'09:30:00',NULL,'Messe dominicale',NULL,1,60930,1,'2026-11-05 12:45:46','2026-11-05 12:45:46'),(9,'Dimanche','[0]','weekly',NULL,'11:15:00',NULL,'Messe dominicale',NULL,1,61115,1,'2026-11-05 12:45:46','2026-11-05 12:45:46'),(10,'Dimanche','[0]','weekly',NULL,'18:00:00',NULL,'Messe dominicale',NULL,1,61800,1,'2026-11-05 12:45:46','2026-11-05 12:45:46'),(11,'3ᵉ lundi du mois','[1]','monthly_nth_weekday',3,'18:30:00',NULL,'Messe pour les malades','Avec bénédiction des sacramentaux',1,71830,1,'2026-11-05 12:45:46','2026-11-05 12:45:46'),(12,'Lundi, Mardi, Mercredi & Vendredi','[1, 2, 3, 5]','weekly',NULL,'07:00:00','Après 6h30','Adoration du Très Saint Sacrement','Après la messe de 6h30, jusqu\'à 18h30',0,700,1,'2026-11-05 12:45:46','2026-11-05 12:45:46'),(13,'Jeudi','[4]','weekly',NULL,'07:15:00',NULL,'Adoration du Très Saint Sacrement','Jusqu\'à 21h00, avec louange après la messe du soir animée par la chorale Vocem Angelorum et le groupe de prière Flamme d\'amour et du Cœur immaculé de Marie',0,30715,1,'2026-11-05 12:45:46','2026-11-05 12:45:46'),(14,'Adoration perpétuelle',NULL,'special',NULL,NULL,'Jour et nuit','Adoration perpétuelle','Tous les lundis et 1ers vendredis du mois : toute la journée et toute la nuit',0,82359,1,'2026-11-05 12:45:46','2026-11-05 12:45:46'),(15,'Jeudi','[4]','weekly',NULL,'17:00:00',NULL,'Confessions','Jusqu\'à 18h15',0,31700,1,'2026-11-05 12:45:46','2026-11-05 12:45:46'),(16,'Samedi','[6]','weekly',NULL,'09:30:00',NULL,'Baptêmes des petits-enfants','Tous les samedis du mois et la veille des solennités',0,50930,1,'2026-11-05 12:45:46','2026-11-05 12:45:46');
/*!40000 ALTER TABLE `mass_schedules` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `media_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `media_categories_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `media_categories` WRITE;
/*!40000 ALTER TABLE `media_categories` DISABLE KEYS */;
INSERT INTO `media_categories` (`id`, `name`, `slug`, `sort_order`, `created_at`, `updated_at`) VALUES (1,'Célébrations','celebrations',0,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(2,'Communauté','communaute',1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(3,'Église','eglise',2,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(4,'Catéchèse','catechese',3,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(5,'Formation','formation',4,'2026-11-05 12:45:47','2026-11-05 12:45:47');
/*!40000 ALTER TABLE `media_categories` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `media_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type` enum('photo','video','chant') COLLATE utf8mb4_unicode_ci NOT NULL,
  `media_category_id` bigint unsigned DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `language` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `youtube_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `youtube_id` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `audio_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pdf_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `taken_at` date DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_published` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `media_items_media_category_id_foreign` (`media_category_id`),
  CONSTRAINT `media_items_media_category_id_foreign` FOREIGN KEY (`media_category_id`) REFERENCES `media_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `media_items` WRITE;
/*!40000 ALTER TABLE `media_items` DISABLE KEYS */;
INSERT INTO `media_items` (`id`, `type`, `media_category_id`, `title`, `language`, `image`, `youtube_url`, `youtube_id`, `audio_url`, `pdf_url`, `taken_at`, `sort_order`, `is_published`, `created_at`, `updated_at`) VALUES (1,'photo',1,'Communauté en prière',NULL,'https://images.unsplash.com/photo-1515657241610-a6b33f0f6c5a?w=1200&h=800&fit=crop&auto=format',NULL,NULL,NULL,NULL,NULL,0,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(2,'photo',2,'Rassemblement communautaire',NULL,'https://images.unsplash.com/photo-1535361251-cbe9d0d2357d?w=1200&h=800&fit=crop&auto=format',NULL,NULL,NULL,NULL,NULL,1,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(3,'photo',1,'Cierges en prière',NULL,'https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=1200&h=800&fit=crop&auto=format',NULL,NULL,NULL,NULL,NULL,2,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(4,'photo',3,'Autel de l\'église',NULL,'https://images.unsplash.com/photo-1687459730891-47dfa3217811?w=1200&h=800&fit=crop&auto=format',NULL,NULL,NULL,NULL,NULL,3,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(5,'photo',1,'Prière en église',NULL,'https://images.unsplash.com/photo-1631648859463-a42e6ce6d1e4?w=1200&h=800&fit=crop&auto=format',NULL,NULL,NULL,NULL,NULL,4,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(6,'photo',4,'Catéchèse',NULL,'https://images.unsplash.com/photo-1774685398923-ba001b371579?w=1200&h=800&fit=crop&auto=format',NULL,NULL,NULL,NULL,NULL,5,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(7,'photo',5,'Formation spirituelle',NULL,'https://images.unsplash.com/photo-1763517789508-f23012039417?w=1200&h=800&fit=crop&auto=format',NULL,NULL,NULL,NULL,NULL,6,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(8,'photo',1,'Adoration',NULL,'https://images.unsplash.com/photo-1573591012925-76dd1f406bd1?w=1200&h=800&fit=crop&auto=format',NULL,NULL,NULL,NULL,NULL,7,1,'2026-11-05 12:45:47','2026-11-05 12:45:47');
/*!40000 ALTER TABLE `media_items` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_09_22_171855_create_personal_access_tokens_table',1),(5,'2026_09_22_172005_create_settings_table',1),(6,'2026_09_22_173123_create_catechese_niveaux_table',1),(7,'2026_09_22_173123_create_mass_schedules_table',1),(8,'2026_09_22_173123_create_prayer_times_table',1),(9,'2026_09_22_173123_create_sacrements_table',1),(10,'2026_09_22_173124_create_homelies_table',1),(11,'2026_09_22_173124_create_intention_messes_table',1),(12,'2026_09_22_173126_create_catechese_inscriptions_table',1),(13,'2026_09_22_173127_create_sacrement_details_table',1),(14,'2026_09_22_175258_create_mouvements_table',1),(15,'2026_09_22_175259_create_projets_table',1),(16,'2026_09_22_175259_create_registre_inscriptions_table',1),(17,'2026_09_22_175261_create_mouvement_details_table',1),(18,'2026_09_22_175262_create_projet_photos_table',1),(19,'2026_09_22_180408_create_orders_table',1),(20,'2026_09_22_180408_create_products_table',1),(21,'2026_09_22_180410_create_order_items_table',1),(22,'2026_09_22_182656_create_donations_table',1),(23,'2026_09_22_182657_create_favorite_homelies_table',1),(24,'2026_09_22_182657_create_journal_issues_table',1),(25,'2026_09_22_182657_create_journal_tarifs_table',1),(26,'2026_09_22_182659_create_journal_subscriptions_table',1),(27,'2026_09_23_080000_create_contact_messages_table',1),(28,'2026_09_23_080100_create_bans_table',1),(29,'2026_09_23_090000_add_structured_readings_to_homelies_table',1),(30,'2026_09_23_120000_create_daily_readings_table',1),(31,'2026_09_23_120100_create_news_tables',1),(32,'2026_09_23_120200_create_team_members_table',1),(33,'2026_09_23_120300_create_media_tables',1),(34,'2026_09_23_120400_create_events_tables',1),(35,'2026_09_24_100000_add_payment_provider_fields',1),(36,'2026_09_24_110000_add_projet_id_to_donations',1),(37,'2026_09_25_100000_create_page_contents_tables',1),(38,'2026_09_29_100000_add_heure_to_intentions_messe_table',1),(39,'2026_09_29_100100_add_texts_to_daily_readings_table',1),(40,'2026_09_29_110000_create_espaces_and_reservations_tables',1),(41,'2026_09_30_190000_create_transactions_tables',1),(42,'2026_09_30_201500_add_source_to_transactions_table',1),(43,'2026_10_14_120000_create_registre_sacrements_table',1),(44,'2026_10_14_130000_add_inscription_id_to_registre_sacrements_table',1),(45,'2026_10_14_140000_add_user_id_to_registre_inscriptions_table',1),(46,'2026_10_14_140100_create_registre_print_requests_table',1),(47,'2026_10_16_100000_add_chant_fields_to_media_items_table',1),(48,'2026_11_04_100000_add_end_date_to_events_table',1),(49,'2026_11_04_100100_add_membres_to_mouvements_table',1),(50,'2026_11_04_100200_create_demandes_sacrement_table',1),(51,'2026_11_04_100300_create_product_categories_and_images',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `mouvement_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mouvement_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `mouvement_id` bigint unsigned NOT NULL,
  `detail` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mouvement_details_mouvement_id_foreign` (`mouvement_id`),
  CONSTRAINT `mouvement_details_mouvement_id_foreign` FOREIGN KEY (`mouvement_id`) REFERENCES `mouvements` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `mouvement_details` WRITE;
/*!40000 ALTER TABLE `mouvement_details` DISABLE KEYS */;
INSERT INTO `mouvement_details` (`id`, `mouvement_id`, `detail`, `sort_order`, `created_at`, `updated_at`) VALUES (1,1,'Réunit clergé et représentants laïcs',0,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(2,1,'Examine les besoins d\'évangélisation',1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(3,1,'Propose des orientations pastorales',2,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(4,1,'Présidé par le curé',3,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(5,2,'Gestion des biens paroissiaux',0,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(6,2,'Suivi des finances',1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(7,2,'Transparence et bonne gestion',2,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(8,2,'Service de la mission de l\'Église',3,'2026-11-05 12:45:47','2026-11-05 12:45:47');
/*!40000 ALTER TABLE `mouvement_details` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `mouvements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mouvements` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category` enum('conseil','mouvement','chorale','cev') COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `content` text COLLATE utf8mb4_unicode_ci,
  `color` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `membres` json DEFAULT NULL,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mouvements_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `mouvements` WRITE;
/*!40000 ALTER TABLE `mouvements` DISABLE KEYS */;
INSERT INTO `mouvements` (`id`, `category`, `slug`, `icon`, `title`, `description`, `content`, `color`, `image`, `membres`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES (1,'conseil','conseil-pastoral','🏛️','Conseil Pastoral','Le Conseil Pastoral réunit le clergé et les représentants laïcs de la paroisse. Il examine les besoins d\'évangélisation de la communauté et propose des orientations pour la vie paroissiale. Il est présidé par le curé.',NULL,NULL,NULL,NULL,0,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(2,'conseil','conseil-des-affaires-economiques','💰','Conseil des Affaires Économiques','Le Conseil des Affaires Économiques assure la gestion des biens et finances paroissiaux. Il est un signe de la mission de l\'Église et garantit la transparence et la bonne gestion des ressources au service de la communauté.',NULL,NULL,NULL,NULL,1,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(3,'mouvement','mouvements-adultes','👨‍👩‍👧','Mouvements adultes','Groupes pour les adultes de la paroisse souhaitant approfondir leur foi et s\'engager au service de la communauté.',NULL,'#0B3D91',NULL,NULL,2,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(4,'mouvement','mouvements-jeunes','👦','Mouvements jeunes','Groupes pour les jeunes de la paroisse : scouts, JEC, MJC et autres mouvements d\'apostolat jeunesse.',NULL,'#D4AF37',NULL,NULL,3,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(5,'mouvement','groupes-liturgiques','✝️','Groupes liturgiques','Au service de la liturgie paroissiale : servants de messe, lecteurs, chantres et autres ministres.',NULL,'#0B3D91',NULL,NULL,4,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(6,'mouvement','communautes-du-grand-nord','🌍','Communautés du Grand Nord','Communauté originaire du Nord-Cameroun, unie dans la foi et la fraternité au sein de notre paroisse.',NULL,'#D4AF37',NULL,NULL,5,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(7,'chorale','le-chant-liturgique','🎵','Le chant liturgique','La chorale paroissiale est un ensemble vocal dont les membres — les choristes — chantent collectivement les différentes parties musicales de la liturgie.','La chorale paroissiale est un ensemble vocal dont les membres — les choristes — chantent collectivement les différentes parties musicales de la liturgie. Par leur service, ils embellissent les célébrations et aident l\'assemblée à prier et louer Dieu.\n\n🎵 Rejoindre une chorale : Toute personne aimant le chant est la bienvenue. Les répétitions ont lieu en semaine. Renseignez-vous au secrétariat paroissial.',NULL,NULL,NULL,6,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(8,'chorale','chorale-principale','🎼','Chorale principale','Anime la messe de 11h00 et les grandes fêtes liturgiques.',NULL,NULL,NULL,NULL,7,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(9,'chorale','chorale-des-jeunes','🎹','Chorale des jeunes','Animent les messes dominicales du soir et les rassemblements jeunesse.',NULL,NULL,NULL,NULL,8,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(10,'chorale','schola-gregorienne','🎸','Schola grégorienne','Chant grégorien et musique sacrée classique pour les occasions spéciales.',NULL,NULL,NULL,NULL,9,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(11,'cev','priere-communautaire','🙏','Prière communautaire','Chapelet, lecture de la Parole, partage en petits groupes.',NULL,NULL,NULL,NULL,10,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(12,'cev','solidarite','❤️','Solidarité','Entraide entre membres, visite des malades et des personnes seules.',NULL,NULL,NULL,NULL,11,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(13,'cev','formation','📖','Formation','Lecture et partage de la Parole de Dieu en contexte local.',NULL,NULL,NULL,NULL,12,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(14,'cev','evangelisation','🌿','Évangélisation','Témoignage et annonce de l\'Évangile dans le quartier.',NULL,NULL,NULL,NULL,13,1,'2026-11-05 12:45:47','2026-11-05 12:45:47');
/*!40000 ALTER TABLE `mouvements` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `news_category_id` bigint unsigned DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `excerpt` text COLLATE utf8mb4_unicode_ci,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `img` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `published_at` datetime NOT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `news_slug_unique` (`slug`),
  KEY `news_news_category_id_foreign` (`news_category_id`),
  CONSTRAINT `news_news_category_id_foreign` FOREIGN KEY (`news_category_id`) REFERENCES `news_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` (`id`, `news_category_id`, `title`, `slug`, `excerpt`, `content`, `img`, `published_at`, `is_published`, `created_at`, `updated_at`) VALUES (1,1,'Inscriptions ouvertes pour la catéchèse 2026–2027','inscriptions-ouvertes-pour-la-catechese-2026-2027','Les inscriptions pour la catéchèse des enfants, des jeunes et des adultes sont désormais ouvertes pour l\'année 2026–2027. Venez nous rejoindre au secrétariat paroissial pour plus d\'informations.','La paroisse Saint Dominique Savio est heureuse d\'annoncer l\'ouverture des inscriptions pour la catéchèse 2026–2027.\n\nNous proposons des programmes adaptés à tous les âges :\n\n• **Catéchèse des enfants** (7–12 ans) : éveil à la foi, préparation aux sacrements\n• **Catéchèse des jeunes** (13–18 ans) : approfondissement de la foi, confirmation\n• **Catéchèse des adultes** : parcours biblique, initiation chrétienne (RICA)\n\nLes inscriptions se font au secrétariat paroissial du lundi au vendredi de 8h à 13h et de 15h30 à 18h30.\n\nDes documents sont requis : acte de baptême, carte d\'identité des parents, photo d\'identité.','https://images.unsplash.com/photo-1774685398923-ba001b371579?w=800&h=450&fit=crop&auto=format','2026-09-12 09:00:00',1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(2,2,'Opération rentrée scolaire : ensemble pour nos enfants','operation-rentree-scolaire-ensemble-pour-nos-enfants','La Caritas paroissiale lance son opération de rentrée scolaire 2026/2027 en faveur des familles défavorisées de notre communauté.','La Caritas de la paroisse Saint Dominique Savio organise son opération de rentrée scolaire 2026/2027.\n\nDans le cadre de sa mission de solidarité, notre Caritas paroissiale se mobilise pour aider les familles défavorisées à scolariser leurs enfants. Des fournitures scolaires, des uniformes et des contributions aux frais de scolarité seront distribués aux familles bénéficiaires.\n\nComment participer ?\n• **Faire un don** en espèces au secrétariat\n• **Offrir des fournitures** scolaires neuves\n• **Se porter volontaire** pour la distribution\n\nLes familles bénéficiaires doivent se présenter au secrétariat avec une pièce d\'identité et un justificatif de résidence.','https://images.unsplash.com/photo-1535361251-cbe9d0d2357d?w=800&h=450&fit=crop&auto=format','2026-09-10 09:00:00',1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(3,3,'Neuvaine à Marie qui défait les nœuds','neuvaine-a-marie-qui-defait-les-noeuds','Clôture du mois du Cœur Immaculé de Marie avec la neuvaine à Notre-Dame qui défait les nœuds. Rejoignez-nous chaque soir à 18h30.','La paroisse organise la neuvaine à Marie qui défait les nœuds pour clôturer le mois du Cœur Immaculé de Marie.\n\nCette dévotion, popularisée par le Pape François, consiste en neuf jours de prière intensive pour confier à la Vierge Marie les situations difficiles de nos vies.\n\n**Programme de la neuvaine :**\n• Chapelet à 18h00\n• Méditation et prière de la neuvaine à 18h30\n• Bénédiction finale\n\nToute la communauté paroissiale est invitée à participer à ces temps de prière. Venez avec vos intentions particulières.','https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=800&h=450&fit=crop&auto=format','2026-09-08 09:00:00',1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(4,4,'Journée de prière pour la paix dans le monde','journee-de-priere-pour-la-paix-dans-le-monde','À l\'initiative de l\'Archidiocèse de Douala, notre paroisse participe à la journée de prière pour la paix dans le monde.','Sur invitation de l\'Archidiocèse de Douala, la paroisse Saint Dominique Savio s\'unit à toute l\'Église universelle pour une journée de prière pour la paix dans le monde.\n\nCette journée se déroulera avec un programme spirituel intense :\n\n• 06h30 : Messe d\'intention pour la paix\n• 09h00 : Chapelet mondial en communion avec toutes les paroisses\n• 15h00 : Via Crucis pour la paix\n• 18h30 : Vêpres et bénédiction du Saint-Sacrement\n\n« Heureux les artisans de paix, car ils seront appelés fils de Dieu. » (Mt 5,9)','https://images.unsplash.com/photo-1631648859463-a42e6ce6d1e4?w=800&h=450&fit=crop&auto=format','2026-09-05 09:00:00',1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(5,5,'Service de nettoyage de l\'église : CEV Notre Dame','service-de-nettoyage-de-leglise-cev-notre-dame','Le service de nettoyage de l\'église pour la semaine du 24 au 29 août est assuré par la CEV Notre Dame de l\'Immaculée Conception.','Le service hebdomadaire de nettoyage de notre église est assuré en rotation par les différentes Communautés Ecclésiales Vivantes (CEV) de la paroisse.\n\nPour la semaine du 24 au 29 août 2026, c\'est la CEV Notre Dame de l\'Immaculée Conception qui est chargée du nettoyage.\n\nNous remercions tous les membres qui contribuent généreusement de leur temps pour maintenir notre église propre et accueillante pour tous. C\'est un service précieux rendu à toute la communauté.\n\nLe calendrier complet des services est disponible au secrétariat paroissial.','https://images.unsplash.com/photo-1687459730891-47dfa3217811?w=800&h=450&fit=crop&auto=format','2026-08-24 09:00:00',1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(6,6,'Retraite spirituelle pour les jeunes – Octobre 2026','retraite-spirituelle-pour-les-jeunes-octobre-2026','Une retraite spirituelle de trois jours est organisée pour les jeunes de la paroisse en octobre 2026. Inscriptions ouvertes.','La paroisse Saint Dominique Savio organise une retraite spirituelle pour les jeunes du 10 au 12 octobre 2026.\n\nSous le thème « Enracinés dans le Christ », cette retraite de trois jours proposera :\n\n• Des temps de prière et d\'adoration\n• Des conférences animées par le Père curé\n• Des partages en groupes\n• Une veillée de prière\n• La célébration de l\'Eucharistie\n\n**Lieu :** Centre spirituel de Bonabéri\n**Coût de participation :** 15 000 FCFA (repas et hébergement inclus)\n\nInscriptions au secrétariat avant le 30 septembre 2026.','https://images.unsplash.com/photo-1573591012925-76dd1f406bd1?w=800&h=450&fit=crop&auto=format','2026-09-01 09:00:00',1,'2026-11-05 12:45:47','2026-11-05 12:45:47');
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `news_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#0B3D91',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `news_categories_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `news_categories` WRITE;
/*!40000 ALTER TABLE `news_categories` DISABLE KEYS */;
INSERT INTO `news_categories` (`id`, `name`, `slug`, `color`, `sort_order`, `created_at`, `updated_at`) VALUES (1,'Catéchèse','catechese','#D4AF37',0,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(2,'Caritas','caritas','#D4AF37',1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(3,'Vie paroissiale','vie-paroissiale','#0B3D91',2,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(4,'Général','general','#6b7280',3,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(5,'Annonces','annonces','#6b7280',4,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(6,'Méditation','meditation','#0B3D91',5,'2026-11-05 12:45:47','2026-11-05 12:45:47');
/*!40000 ALTER TABLE `news_categories` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned DEFAULT NULL,
  `product_nom_snapshot` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prix_unitaire` decimal(10,0) NOT NULL,
  `qty` int unsigned NOT NULL,
  `subtotal` decimal(12,0) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_foreign` (`order_id`),
  KEY `order_items_product_id_foreign` (`product_id`),
  CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `order_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total` decimal(12,0) NOT NULL,
  `payment_method` enum('orange_money','mtn_momo','especes') COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_status` enum('en_attente','paye','echoue','annule') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en_attente',
  `order_status` enum('en_attente','confirmee','preparee','livree','annulee') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en_attente',
  `payment_reference` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_provider` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_provider_status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_details` text COLLATE utf8mb4_unicode_ci,
  `confirmed_by_user_id` bigint unsigned DEFAULT NULL,
  `confirmed_at` timestamp NULL DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_order_number_unique` (`order_number`),
  KEY `orders_user_id_foreign` (`user_id`),
  KEY `orders_confirmed_by_user_id_foreign` (`confirmed_by_user_id`),
  KEY `orders_payment_reference_index` (`payment_reference`),
  CONSTRAINT `orders_confirmed_by_user_id_foreign` FOREIGN KEY (`confirmed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `page_blocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `page_blocks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `page_key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kind` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subtitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_highlight` tinyint(1) NOT NULL DEFAULT '0',
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `page_blocks_page_key_kind_sort_order_index` (`page_key`,`kind`,`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `page_blocks` WRITE;
/*!40000 ALTER TABLE `page_blocks` DISABLE KEYS */;
INSERT INTO `page_blocks` (`id`, `page_key`, `kind`, `title`, `subtitle`, `description`, `image`, `meta`, `icon`, `is_highlight`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES (1,'genese','timeline','Achat du terrain fondateur',NULL,'Le Père Alexis Derrien, Spiritain, acquiert 3 000 m² à New-Bell Bonadoumbé. Ce terrain devient la pierre angulaire de la future paroisse.',NULL,'1961',NULL,0,0,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(2,'genese','timeline','Premières célébrations',NULL,'Mgr Thomas Mongo et Abbé Robert Lépine établissent les premières structures liturgiques. Des messes sont célébrées dans des locaux provisoires du quartier.',NULL,'1962–1963',NULL,0,1,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(3,'genese','timeline','Première salle de culte',NULL,'Construction de la première salle dédiée au culte. L\'Abbé Lépine devient le premier prêtre responsable officiel. La Sœur Christian Nourry prépare les enfants aux sacrements.',NULL,'1964',NULL,0,2,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(4,'genese','timeline','Naissance des premières communautés',NULL,'Les premières communautés chrétiennes de base s\'organisent dans les quartiers environnants. La vie associative paroissiale prend son essor.',NULL,'1966',NULL,0,3,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(5,'genese','timeline','Premier curé résident',NULL,'L\'Abbé Michel Lécuyer, Spiritain, devient le premier curé résident permanent de la paroisse. Cette étape marque la maturité institutionnelle de la communauté.',NULL,'Septembre 1973',NULL,0,4,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(6,'genese','timeline','Érection canonique officielle',NULL,'Mgr Simon Tonye, archevêque de Douala, procède à l\'érection canonique officielle de la Paroisse Saint Dominique Savio. La communauté est désormais une paroisse à part entière dans l\'Archidiocèse de Douala.',NULL,'1974',NULL,0,5,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(7,'genese','cure','Abbé Robert LÉPINE',NULL,'Spiritain, premier prêtre responsable de la communauté naissante. Il pose les fondements pastoraux de la paroisse et prépare les premières catéchèses.',NULL,'1964 – 1966',NULL,0,6,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(8,'genese','cure','Abbé Jean RIVAIN',NULL,'Spiritain, il poursuit l\'œuvre de son prédécesseur et développe les premières communautés chrétiennes dans le quartier de New-Bell.',NULL,'1966 – 1969',NULL,0,7,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(9,'genese','cure','Abbé Pierre SAURET',NULL,'Spiritain, il développe la structure pastorale de la paroisse et renforce les liens avec les mouvements catholiques locaux.',NULL,'1969 – 1972',NULL,0,8,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(10,'genese','cure','Abbé Pierre PAPON',NULL,'Spiritain, curé de transition, il prépare l\'arrivée du premier curé résident permanent de la paroisse.',NULL,'1972 – 1973',NULL,0,9,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(11,'genese','cure','Abbé Michel LÉCUYER',NULL,'Spiritain, premier curé résident de la paroisse depuis septembre 1973. Il préside à l\'érection canonique officielle en 1974 et construit l\'identité spirituelle de la communauté.',NULL,'1973 – 1987',NULL,0,10,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(12,'genese','cure','Abbé Antoine BABÉ',NULL,'Il consolide la croissance de la paroisse et développe les structures de la vie communautaire, notamment les groupes de prière.',NULL,'1987 – 1990',NULL,0,11,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(13,'genese','cure','Abbé Simon EPÉA',NULL,'Il approfondit l\'enracinement de la paroisse dans le tissu social et ecclésial de Douala, et dynamise la vie des CEV.',NULL,'1990 – 1996',NULL,0,12,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(14,'genese','cure','Abbé Bonaventure TAA',NULL,'Sous sa conduite, la paroisse connaît un essor remarquable. Il engage des travaux de rénovation et renforce la pastorale familiale.',NULL,'1996 – 2003',NULL,0,13,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(15,'genese','cure','Abbé Étienne NGUE',NULL,'Long mandat marqué par la structuration de la vie paroissiale, le développement de la catéchèse et l\'extension vers le quartier de Youpwè.',NULL,'2003 – 2012',NULL,0,14,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(16,'genese','cure','Prof. Abbé Oscar EONÉ EONÉ',NULL,'Professeur de théologie, il apporte une dimension intellectuelle et académique à la vie paroissiale, enrichissant les homélies et la formation des fidèles.',NULL,'2012 – 2016',NULL,0,15,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(17,'genese','cure','Mgr Sébastien MONGO-BEHON',NULL,'Évêque auxiliaire de Douala, sa présence à la tête de la paroisse fut un honneur particulier pour toute la communauté paroissiale.',NULL,'2016 – 2018',NULL,0,16,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(18,'genese','cure','Abbé Jacques Luc BAKOUBA BAKINDE',NULL,'Il poursuit le développement pastoral et engage la communauté dans une dynamique de renouveau liturgique et sacramentel.',NULL,'2018 – 2020',NULL,0,17,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(19,'genese','cure','Abbé Philippe Pacôme MBANDA MANDENGUE',NULL,'Il guide la paroisse pendant la période difficile de la pandémie de Covid-19, maintenant le lien communautaire et assurant la continuité pastorale.',NULL,'2020 – 2022',NULL,0,18,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(20,'genese','cure','Abbé Jean-Robert FANKAM NGANDJUI',NULL,'Curé actuel de la paroisse, il conduit notre communauté avec dynamisme, renforçant la vie spirituelle, la solidarité et l\'engagement missionnaire de tous les fidèles.',NULL,'2022 – présent',NULL,1,19,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(21,'histoire','timeline','Achat du terrain',NULL,'Père Alexis Derrien achète 3 000 m² à New-Bell Bonadoumbé.',NULL,'4 déc. 1961',NULL,0,0,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(22,'histoire','timeline','Lieu de culte établi',NULL,'Mgr Thomas Mongo et Abbé Robert Lépine établissent un premier lieu de culte.',NULL,'~1962-63',NULL,0,1,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(23,'histoire','timeline','Premières communautés',NULL,'Père Lépine construit l\'église, lance les premières communautés chrétiennes.',NULL,'1964-1966',NULL,0,2,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(24,'histoire','timeline','Érection canonique',NULL,'Érection canonique par Mgr Simon Tonye.',NULL,'1974',NULL,0,3,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(25,'histoire','timeline','Succession de curés',NULL,'Abbé Babe → Abbé Epea Simon (1990) → Abbé Bonaventure Taa (1996).',NULL,'~1988-1996',NULL,0,4,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(26,'histoire','timeline','Consécration de l\'église',NULL,'Consécration de l\'église par le Cardinal Christian Tumi.',NULL,'6 mai 2000',NULL,0,5,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(27,'histoire','timeline','Construction du presbytère',NULL,'Construction du presbytère à deux niveaux.',NULL,'Après 2000',NULL,0,6,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(28,'histoire','timeline','Naissance de Youpwè',NULL,'Naissance de la paroisse de Youpwè (Saint Ignace d\'Antioche).',NULL,'Juillet 2015',NULL,0,7,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(29,'histoire','timeline','Développement',NULL,'Bâtiment catéchèse, salle mouvements, forage d\'eau.',NULL,'2016-2018',NULL,0,8,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(30,'histoire','timeline','Rénovations',NULL,'Toiture grotte mariale, rénovation sacristie.',NULL,'~2019-2020',NULL,0,9,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(31,'histoire','timeline','Visite apostolique',NULL,'Visite du Nonce Apostolique Mgr Julio Murat.',NULL,'8 oct. 2021',NULL,0,10,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(32,'histoire','milestone','Conception',NULL,'Conception du projet d\'extension par le Père EPEA.',NULL,'1996',NULL,0,11,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(33,'histoire','milestone','Opérationnel',NULL,'Opérationnel sous l\'Abbé Bonaventure TAA.',NULL,'Fév. 1997',NULL,0,12,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(34,'histoire','milestone','Première Eucharistie',NULL,'Première Eucharistie chez M. NOUNG Georges, puis grotte du patriarche MBOUCK Guillaume (mai 1998).',NULL,'Carême 1998',NULL,0,13,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(35,'histoire','milestone','Catéchèse lancée',NULL,'Catéchèse lancée par Mme MBOUCK Marie Thérèse et une sœur Spiritaine.',NULL,'Déc. 1998',NULL,0,14,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(36,'histoire','milestone','Communauté anglophone',NULL,'La communauté anglophone intègre le mouvement.',NULL,'1999',NULL,0,15,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(37,'histoire','milestone','Financement terrain',NULL,'Visite honorable DOOH Collins → financement terrain et chapelle.',NULL,'Août 2001',NULL,0,16,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(38,'histoire','milestone','Premières messes',NULL,'Premières messes dans la chapelle de Youpwè.',NULL,'Janv. 2005',NULL,0,17,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(39,'histoire','milestone','Communautés CEV',NULL,'6 CEVs créées dans le secteur de Youpwè.',NULL,'2007',NULL,0,18,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(40,'histoire','milestone','Érection en paroisse',NULL,'Youpwè érigée en paroisse autonome. Abbé Janvier WOPOULÉ, premier curé.',NULL,'13 juillet 2015',NULL,0,19,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(41,'savio','bullet','Une foi ardente vécue dans la joie quotidienne',NULL,NULL,NULL,NULL,NULL,0,0,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(42,'savio','bullet','La dévotion mariale comme pilier de sa vie',NULL,NULL,NULL,NULL,NULL,0,1,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(43,'savio','bullet','L\'amour de l\'Eucharistie et de la confession',NULL,NULL,NULL,NULL,NULL,0,2,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(44,'savio','bullet','L\'apostolat par l\'exemple et la fraternité',NULL,NULL,NULL,NULL,NULL,0,3,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(45,'savio','bullet','La sainteté ordinaire accessible à tous les jeunes',NULL,NULL,NULL,NULL,NULL,0,4,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(46,'organisation','bullet','Conseil pastoral paroissial',NULL,NULL,NULL,NULL,NULL,0,0,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(47,'organisation','bullet','Conseil économique paroissial',NULL,NULL,NULL,NULL,NULL,0,1,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(48,'organisation','bullet','Communautés Ecclésiales Vivantes (CEV)',NULL,NULL,NULL,NULL,NULL,0,2,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(49,'organisation','bullet','Équipes pastorales spécialisées',NULL,NULL,NULL,NULL,NULL,0,3,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(50,'organisation','bullet','Mouvements et associations de laïcs',NULL,NULL,NULL,NULL,NULL,0,4,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(51,'organisation','bullet','Service de la catéchèse',NULL,NULL,NULL,NULL,NULL,0,5,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(52,'organisation','stat','Année de fondation',NULL,NULL,NULL,'1961',NULL,0,6,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(53,'organisation','stat','Années d\'histoire',NULL,NULL,NULL,'65+',NULL,0,7,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(54,'organisation','stat','Paroisses du Doyenné Wouri I',NULL,NULL,NULL,'7',NULL,0,8,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(55,'organisation','stat','Messes dominicales',NULL,NULL,NULL,'4',NULL,0,9,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(56,'organisation','stat','Mouvements & associations',NULL,NULL,NULL,'8',NULL,0,10,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(57,'organisation','stat','Communauté ouverte à tous',NULL,NULL,NULL,'∞',NULL,0,11,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(58,'organisation','card','Le Curé',NULL,'Responsable pastoral et administratif de la paroisse',NULL,NULL,'⛪',0,12,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(59,'organisation','card','Les Vicaires',NULL,'Assistants du curé pour les célébrations et l\'accompagnement',NULL,NULL,'👨‍💼',0,13,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(60,'organisation','card','Conseil pastoral',NULL,'Représentants laïcs, examine les besoins d\'évangélisation',NULL,NULL,'👥',0,14,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(61,'organisation','card','Conseil économique',NULL,'Gestion des biens et finances paroissiaux',NULL,NULL,'💰',0,15,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(62,'organisation','card','CEV',NULL,'Communautés Ecclésiales Vivantes dans les quartiers',NULL,NULL,'🏘️',0,16,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(63,'organisation','card','Catéchèse',NULL,'Formation des enfants, jeunes et adultes dans la foi',NULL,NULL,'📚',0,17,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(64,'archidiocese','card','Cathédrale Saints Pierre et Paul',NULL,'Siège épiscopal de l\'Archidiocèse de Douala',NULL,NULL,'⛪',0,0,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(65,'archidiocese','card','CENC',NULL,'Conférence Épiscopale Nationale du Cameroun - coordination nationale de l\'Église',NULL,NULL,'🌍',0,1,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(66,'archidiocese','card','Doyenné Wouri I',NULL,'Notre doyenné regroupant plusieurs paroisses du secteur',NULL,NULL,'🏘️',0,2,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(67,'caritas','card','Rentrée scolaire',NULL,'Distribution de fournitures scolaires aux familles défavorisées pour permettre à tous les enfants d\'aller à l\'école.',NULL,NULL,'🏫',0,0,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(68,'caritas','card','Aide alimentaire',NULL,'Distribution de vivres aux familles dans le besoin, particulièrement pendant les périodes de fête.',NULL,NULL,'🍽️',0,1,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(69,'caritas','card','Santé',NULL,'Soutien médical et accompagnement des malades et personnes âgées isolées.',NULL,NULL,'💊',0,2,1,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(70,'caritas','card','Vêtements',NULL,'Collecte et distribution de vêtements et d\'articles ménagers aux personnes dans le besoin.',NULL,NULL,'👔',0,3,1,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(71,'caritas','card','Logement',NULL,'Aide d\'urgence pour les familles en situation de précarité de logement.',NULL,NULL,'🏠',0,4,1,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(72,'caritas','card','Insertion professionnelle',NULL,'Accompagnement et orientation vers des formations professionnelles.',NULL,NULL,'💼',0,5,1,'2026-11-05 12:45:48','2026-11-05 12:45:48');
/*!40000 ALTER TABLE `page_blocks` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `page_contents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `page_contents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hero_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `intro` text COLLATE utf8mb4_unicode_ci,
  `extra` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `page_contents_key_unique` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `page_contents` WRITE;
/*!40000 ALTER TABLE `page_contents` DISABLE KEYS */;
INSERT INTO `page_contents` (`id`, `key`, `title`, `subtitle`, `hero_image`, `intro`, `extra`, `is_active`, `created_at`, `updated_at`) VALUES (1,'genese','Genèse de la Paroisse','Les origines et fondements de notre communauté de foi à Douala',NULL,'La paroisse Saint Dominique Savio trouve ses origines en **1961**, lorsque le Père Alexis Derrien, Spiritain, acquit un terrain de **3 000 m²** dans le quartier populaire de New-Bell Bonadoumbé à Douala. Ce geste simple mais fondateur allait être le premier pas d\'une communauté chrétienne appelée à rayonner dans tout le quartier et au-delà.\n\nC\'est sous l\'impulsion de **Monseigneur Thomas Mongo**, archevêque de Douala, et de l\'Abbé Robert Lépine que naquit la vision d\'implanter l\'Église au cœur de ce quartier populaire. Cette démarche missionnaire reflétait l\'engagement profond de l\'Église catholique à rejoindre les hommes et les femmes dans leur vie quotidienne.\n\nÀ proximité immédiate du terrain acquis, les **Sœurs du Saint-Esprit** dirigeaient déjà une école primaire qui portait le nom de *Dominique Savio*. Ce voisinage n\'était pas fortuit : il annonçait la vocation particulière de cette future paroisse pour l\'éducation, la jeunesse et la famille, qui allait devenir une caractéristique essentielle de son identité.\n\nLes premières réunions de prière se tiennent dans des salles modestes. La Sœur Christian Nourry joue un rôle précieux dans la préparation des enfants à la première communion et à la confirmation, posant ainsi les premières pierres de la catéchèse paroissiale.','{\"quote\": \"L\'Église naît là où l\'on annonce l\'Évangile, là où on rassemble les hommes et les femmes au nom du Christ.\", \"quote_author\": \"— Esprit de la fondation de la Paroisse Saint Dominique Savio, 1961\", \"section_label\": \"LES ORIGINES\", \"section_title\": \"1961 : La naissance d\'une communauté\", \"timeline_intro\": \"Depuis 1964, quatorze prêtres ont guidé notre communauté. Chacun a apporté sa pierre à l\'édifice spirituel de notre paroisse.\", \"timeline_label\": \"SUCCESSION PASTORALE\", \"timeline_title\": \"Les curés qui nous ont précédés\"}',1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(2,'histoire','Notre Histoire','Plus de 60 ans de foi, de service et de communauté à Douala',NULL,NULL,'{\"youpwe_intro\": \"Dans les années 1990, la paroisse Saint Dominique Savio a étendu sa mission vers le quartier de Youpwè, donnant naissance à une nouvelle communauté qui deviendra une paroisse autonome en 2015.\", \"youpwe_label\": \"EXTENSION\", \"youpwe_title\": \"L\'extension vers Youpwè\"}',1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(3,'savio','Saint Dominique Savio','Notre saint patron, modèle de jeunesse et de foi',NULL,'Dominique Savio naquit le **2 avril 1842** à Riva di Chieri, en Italie. Deuxième de dix enfants, il grandit dans une famille profondément croyante qui lui apprit à prier dès son plus jeune âge.\n\nSa première communion, reçue à l\'âge de **7 ans**, fut un moment décisif. Il prit alors des résolutions qui marquèrent toute sa courte vie : *\"Mes amis seront Jésus et Marie. La mort, mais pas de péchés.\"*\n\nSous la direction spirituelle de **Don Bosco**, qu\'il rencontra à Turin, Dominique progressa rapidement dans la vie spirituelle. En 1854, il fonda *La Compagnie de l\'Immaculée Conception*, un groupe de jeunes engagés pour la piété et l\'apostolat.\n\nIl se distinguait comme artisan de paix entre ses camarades, intervenant courageusement pour réconcilier ceux qui étaient en conflit. Il rêvait de devenir prêtre, mais la Providence en décida autrement.\n\nAtteint d\'une maladie pulmonaire, il mourut le **9 mars 1857**, à l\'âge de 14 ans. Ses derniers mots, selon Don Bosco, témoignaient d\'une joie profonde : il décrivait une belle vision qui lui était accordée.','{\"bio\": [[\"Né le\", \"2 avril 1842\"], [\"Lieu de naissance\", \"Riva di Chieri, Italie\"], [\"Décédé le\", \"9 mars 1857\"], [\"Âge au décès\", \"14 ans\"], [\"Directeur spirituel\", \"Don Bosco (Saint Jean Bosco)\"], [\"Canonisé par\", \"Pie XII, en 1954\"], [\"Fête\", \"9 mars\"]], \"quote\": \"L\'Église met Dominique Savio sur les autels pour qu\'il devienne le Patron et le modèle des jeunes.\", \"prayer\": \"Saint Dominique Savio, toi qui as su unir ta vie à Jésus et Marie dans la joie et la pureté du cœur, intercède pour nous auprès du Seigneur. Aide-nous à vivre notre foi avec la même ardeur que toi, à trouver en Dieu la source de toute joie, et à être pour ceux qui nous entourent des témoins du Christ vivant.\", \"bio_image\": \"https://backoffice.paroissesaintdominiquesavio.com/assets/09633277-f72b-4102-9fe8-3752e3acd3ee\", \"bio_label\": \"REPÈRES BIOGRAPHIQUES\", \"prayer_title\": \"Prière à Saint Dominique Savio\", \"quote_author\": \"— Pape Pie XII, lors de la canonisation, 1954\", \"section_label\": \"NOTRE SAINT PATRON\", \"section_title\": \"La vie de Dominique Savio\", \"spirituality_label\": \"SPIRITUALITÉ DE DOMINIQUE SAVIO\"}',1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(4,'organisation','Organisation de la paroisse','Structure pastorale et gouvernance',NULL,NULL,'{\"chart_title\": \"Organigramme pastoral\", \"stats_title\": \"Chiffres clés\", \"structure_title\": \"Structure pastorale\"}',1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(5,'archidiocese','L\'Archidiocèse de Douala','Notre ancrage diocésain',NULL,'La paroisse Saint Dominique Savio fait partie de l\'**Archidiocèse de Douala**, dont le siège épiscopal est la Cathédrale Saints Pierre et Paul de Douala.\n\nNotre paroisse est rattachée au **Doyenné Wouri I**, l\'un des doyennés de l\'archidiocèse, regroupant plusieurs paroisses du secteur de Douala.\n\nL\'Archidiocèse de Douala est l\'un des diocèses catholiques les plus actifs du Cameroun, animé par une vie ecclésiale intense et un engagement fort au service de l\'évangélisation et du développement humain.\n\nLa Conférence Épiscopale Nationale du Cameroun (**CENC**) regroupe tous les évêques catholiques du Cameroun et coordonne l\'action de l\'Église à l\'échelle nationale.','{\"facts\": [[\"Archidiocèse\", \"Douala\"], [\"Doyenné\", \"Wouri I\"], [\"Pays\", \"Cameroun\"], [\"Conférence épiscopale\", \"CENC\"], [\"Cathédrale\", \"Saints Pierre et Paul\"], [\"Notre paroisse fondée\", \"4 décembre 1961\"]], \"cameroon_title\": \"L\'Église au Cameroun\"}',1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(6,'caritas','Caritas Paroissiale','Au service des plus démunis',NULL,NULL,'{\"cta_text\": \"Votre don permet à notre Caritas de continuer à agir au service des plus pauvres. Chaque geste compte.\", \"cta_title\": \"Soutenir la Caritas\", \"section_intro\": \"La Caritas paroissiale est le bras charitable de notre communauté. Inspirée par l\'amour du Christ pour les pauvres, elle coordonne les actions de solidarité et d\'entraide au service des plus démunis de notre quartier.\", \"section_label\": \"SOLIDARITÉ\", \"section_title\": \"Notre mission Caritas\"}',1,'2026-11-05 12:45:47','2026-11-05 12:45:47');
/*!40000 ALTER TABLE `page_contents` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `prayer_times`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prayer_times` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `time_label` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `prayer_times` WRITE;
/*!40000 ALTER TABLE `prayer_times` DISABLE KEYS */;
INSERT INTO `prayer_times` (`id`, `icon`, `title`, `time_label`, `description`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES (1,'🕯️','Adoration eucharistique','Lun–Ven après la messe de 06h30 jusqu\'à 18h30','Temps silencieux de contemplation devant le Saint-Sacrement exposé.',0,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(2,'📿','Chapelet','Chaque soir à 18h00','Prière mariale en commun, suivie du partage sur l\'Évangile du jour.',1,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(3,'🕊️','Adoration nocturne','Chaque lundi et 1er vendredi du mois','Nuit de prière, louange et intercession pour la paroisse et le monde.',2,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(4,'🙏','Groupes de prière','Selon le calendrier','Différents groupes de prière se réunissent régulièrement dans la paroisse.',3,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(5,'📖','Lectio Divina','Mercredi matin','Lecture méditée de la Parole de Dieu, selon la méthode de la Lectio Divina.',4,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(6,'✝️','Chemin de croix','Vendredi en Carême','Prière du chemin de croix chaque vendredi pendant le temps de Carême.',5,1,'2026-11-05 12:45:47','2026-11-05 12:45:47');
/*!40000 ALTER TABLE `prayer_times` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `product_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_categories_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `product_categories` WRITE;
/*!40000 ALTER TABLE `product_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_categories` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prix` decimal(10,0) NOT NULL,
  `prix_barre` decimal(10,0) DEFAULT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `img` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `images` json DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` (`id`, `nom`, `slug`, `prix`, `prix_barre`, `category`, `img`, `images`, `description`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES (1,'La prière - Un guide complet','la-priere-un-guide-complet',7000,NULL,'Livres','https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=300&h=300&fit=crop',NULL,'Un guide complet sur la vie de prière chrétienne.',1,0,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(2,'Un temps pour changer','un-temps-pour-changer',7000,NULL,'Livres','https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=300&h=300&fit=crop',NULL,'Ouvrage de conversion et de renouveau spirituel.',1,1,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(3,'Le COVID est notre moment de Noé','le-covid-est-notre-moment-de-noe',3000,NULL,'Livres','https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=300&h=300&fit=crop',NULL,'Réflexion spirituelle sur la pandémie et la foi.',1,2,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(4,'Vices et vertus','vices-et-vertus',4000,NULL,'Livres','https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=300&h=300&fit=crop',NULL,'Enseignement moral chrétien sur les vertus et les vices.',1,3,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(5,'Les fondamentaux de la foi chrétienne','les-fondamentaux-de-la-foi-chretienne',4500,5000,'Livres','https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=300&h=300&fit=crop',NULL,'Introduction complète aux fondements de la foi catholique.',1,4,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(6,'La Bonne Nouvelle de l\'Église sur le mariage','la-bonne-nouvelle-de-leglise-sur-le-mariage',2000,NULL,'Livres','https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=300&h=300&fit=crop',NULL,'L\'enseignement de l\'Église catholique sur le sacrement du mariage.',1,5,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(7,'Chapelet','chapelet',500,NULL,'Accessoires','https://images.unsplash.com/photo-1631648859463-a42e6ce6d1e4?w=300&h=300&fit=crop',NULL,'Chapelet classique pour la prière mariale.',1,6,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(8,'Collier','collier',1000,NULL,'Accessoires','https://images.unsplash.com/photo-1631648859463-a42e6ce6d1e4?w=300&h=300&fit=crop',NULL,'Collier religieux béni.',1,7,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(9,'Chaîne blanche','chaine-blanche',1500,NULL,'Accessoires','https://images.unsplash.com/photo-1631648859463-a42e6ce6d1e4?w=300&h=300&fit=crop',NULL,'Chaîne blanche pour la foi.',1,8,'2026-11-05 12:45:48','2026-11-05 12:45:48');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `projet_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projet_photos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `projet_id` bigint unsigned NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `projet_photos_projet_id_foreign` (`projet_id`),
  CONSTRAINT `projet_photos_projet_id_foreign` FOREIGN KEY (`projet_id`) REFERENCES `projets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `projet_photos` WRITE;
/*!40000 ALTER TABLE `projet_photos` DISABLE KEYS */;
/*!40000 ALTER TABLE `projet_photos` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `projets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `titre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `statut` enum('en_cours','termine') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en_cours',
  `objectif` decimal(14,0) NOT NULL DEFAULT '0',
  `collecte` decimal(14,0) NOT NULL DEFAULT '0',
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `details` text COLLATE utf8mb4_unicode_ci,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `projets_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `projets` WRITE;
/*!40000 ALTER TABLE `projets` DISABLE KEYS */;
INSERT INTO `projets` (`id`, `titre`, `slug`, `description`, `statut`, `objectif`, `collecte`, `image`, `details`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES (1,'Rénovation de l\'église principale','renovation-de-leglise-principale','Travaux de rénovation de la toiture, des vitraux et de la façade de notre église.','en_cours',15000000,9200000,'https://images.unsplash.com/photo-1687459730891-47dfa3217811?w=600&h=400&fit=crop&auto=format','Ce projet vise à restaurer notre église afin d\'assurer sa pérennité pour les générations futures. Les travaux concernent principalement la toiture, les vitraux et la façade extérieure. La rénovation permettra également d\'améliorer l\'acoustique de l\'église pour les célébrations liturgiques.',0,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(2,'Construction de salles de catéchèse','construction-de-salles-de-catechese','Construction de 4 nouvelles salles pour accueillir les enfants de catéchèse dans de meilleures conditions.','en_cours',8000000,3500000,'https://images.unsplash.com/photo-1774685398923-ba001b371579?w=600&h=400&fit=crop&auto=format','Le nombre croissant d\'enfants inscrits à la catéchèse nécessite la construction de nouvelles salles. Ce projet prévoit 4 salles polyvalentes équipées, pouvant accueillir 30 enfants chacune. Les salles seront également utilisées pour les réunions de mouvements et les formations.',1,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(3,'Forage d\'eau','forage-deau','Installation d\'un forage pour approvisionner la paroisse et les familles environnantes en eau potable.','termine',5000000,5000000,'https://images.unsplash.com/photo-1515657241610-a6b33f0f6c5a?w=600&h=400&fit=crop&auto=format','Le projet de forage a été réalisé avec succès. La paroisse dispose maintenant d\'une source d\'eau potable accessible à tous, bénéficiant à l\'ensemble de la communauté paroissiale et aux familles environnantes. Ce projet a été financé grâce à la générosité de nos paroissiens.',2,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(4,'Salle multifonctionnelle','salle-multifonctionnelle','Construction d\'une grande salle pour les réunions, fêtes paroissiales et activités communautaires.','en_cours',20000000,4800000,'https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=600&h=400&fit=crop&auto=format','Cette salle multifonctionnelle accueillera les grandes réunions paroissiales, les fêtes communautaires, les formations et les activités culturelles. D\'une capacité de 500 personnes, elle sera équipée d\'une cuisine, de sanitaires et d\'un système audiovisuel moderne.',3,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(5,'Grotte Mariale','grotte-mariale','Rénovation et embellissement de la grotte mariale pour la prière et les pèlerinages.','termine',3000000,3000000,'https://images.unsplash.com/photo-1631648859463-a42e6ce6d1e4?w=600&h=400&fit=crop&auto=format','La grotte mariale a été entièrement rénovée : nouvelle toiture, éclairage, aménagement paysager et chemin d\'accès. Ce lieu de prière est désormais accessible à tous et accueille régulièrement des célébrations mariales et des groupes de prière.',4,1,'2026-11-05 12:45:47','2026-11-05 12:45:47');
/*!40000 ALTER TABLE `projets` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `registre_inscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registre_inscriptions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tranche_age` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rue` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quartier` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lieu_dit` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `membre_cev` tinyint(1) NOT NULL DEFAULT '0',
  `quelle_cev` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `membre_groupe` tinyint(1) NOT NULL DEFAULT '0',
  `quel_groupe` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `anciennete` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source` enum('public','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'public',
  `created_by_user_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `registre_inscriptions_created_by_user_id_foreign` (`created_by_user_id`),
  KEY `registre_inscriptions_user_id_foreign` (`user_id`),
  CONSTRAINT `registre_inscriptions_created_by_user_id_foreign` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `registre_inscriptions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `registre_inscriptions` WRITE;
/*!40000 ALTER TABLE `registre_inscriptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `registre_inscriptions` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `registre_print_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registre_print_requests` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `reference` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `registre_inscription_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `statut` enum('en_attente','en_traitement','prete','livree','refusee') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en_attente',
  `message` text COLLATE utf8mb4_unicode_ci,
  `admin_notes` text COLLATE utf8mb4_unicode_ci,
  `processed_by_user_id` bigint unsigned DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `registre_print_requests_reference_unique` (`reference`),
  KEY `registre_print_requests_registre_inscription_id_foreign` (`registre_inscription_id`),
  KEY `registre_print_requests_user_id_foreign` (`user_id`),
  KEY `registre_print_requests_processed_by_user_id_foreign` (`processed_by_user_id`),
  CONSTRAINT `registre_print_requests_processed_by_user_id_foreign` FOREIGN KEY (`processed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `registre_print_requests_registre_inscription_id_foreign` FOREIGN KEY (`registre_inscription_id`) REFERENCES `registre_inscriptions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `registre_print_requests_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `registre_print_requests` WRITE;
/*!40000 ALTER TABLE `registre_print_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `registre_print_requests` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `registre_sacrements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registre_sacrements` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type` enum('bapteme','communion','confirmation','mariage') COLLATE utf8mb4_unicode_ci NOT NULL,
  `registre_inscription_id` bigint unsigned DEFAULT NULL,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sexe` enum('fils','fille') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pere` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mere` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_naissance` date DEFAULT NULL,
  `date_evenement` date DEFAULT NULL,
  `lieu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numero` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numero_registre` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parrain_marraine` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `conjoint` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `baptise_a` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `temoins` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ministre` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `signataire` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_certificat` date DEFAULT NULL,
  `remarques` text COLLATE utf8mb4_unicode_ci,
  `source` enum('public','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'public',
  `created_by_user_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `registre_sacrements_created_by_user_id_foreign` (`created_by_user_id`),
  KEY `registre_sacrements_registre_inscription_id_foreign` (`registre_inscription_id`),
  CONSTRAINT `registre_sacrements_created_by_user_id_foreign` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `registre_sacrements_registre_inscription_id_foreign` FOREIGN KEY (`registre_inscription_id`) REFERENCES `registre_inscriptions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `registre_sacrements` WRITE;
/*!40000 ALTER TABLE `registre_sacrements` DISABLE KEYS */;
/*!40000 ALTER TABLE `registre_sacrements` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `reference` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `espace_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `nb_unites` smallint unsigned NOT NULL DEFAULT '1',
  `nb_personnes` smallint unsigned DEFAULT NULL,
  `evenement` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `montant` decimal(12,0) DEFAULT NULL,
  `payment_method` enum('orange_money','mtn_momo','especes') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` enum('en_attente','paye','echoue','annule') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en_attente',
  `payment_reference` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_provider` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_provider_status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_details` text COLLATE utf8mb4_unicode_ci,
  `statut` enum('en_attente','confirmee','terminee','annulee') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en_attente',
  `confirmed_by_user_id` bigint unsigned DEFAULT NULL,
  `confirmed_at` timestamp NULL DEFAULT NULL,
  `admin_notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reservations_reference_unique` (`reference`),
  KEY `reservations_user_id_foreign` (`user_id`),
  KEY `reservations_confirmed_by_user_id_foreign` (`confirmed_by_user_id`),
  KEY `reservations_espace_id_date_debut_date_fin_index` (`espace_id`,`date_debut`,`date_fin`),
  KEY `reservations_payment_reference_index` (`payment_reference`),
  CONSTRAINT `reservations_confirmed_by_user_id_foreign` FOREIGN KEY (`confirmed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `reservations_espace_id_foreign` FOREIGN KEY (`espace_id`) REFERENCES `espaces` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `reservations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `sacrement_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sacrement_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sacrement_id` bigint unsigned NOT NULL,
  `detail` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sacrement_details_sacrement_id_foreign` (`sacrement_id`),
  CONSTRAINT `sacrement_details_sacrement_id_foreign` FOREIGN KEY (`sacrement_id`) REFERENCES `sacrements` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `sacrement_details` WRITE;
/*!40000 ALTER TABLE `sacrement_details` DISABLE KEYS */;
INSERT INTO `sacrement_details` (`id`, `sacrement_id`, `detail`, `sort_order`, `created_at`, `updated_at`) VALUES (1,1,'Baptêmes d\'enfants : dernier samedi du mois à 9h00',0,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(2,1,'Préparation obligatoire des parents (2 sessions)',1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(3,1,'Parrain et marraine catholiques pratiquants requis',2,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(4,1,'Contact : secrétariat paroissial',3,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(5,2,'Publication des bans 3 semaines avant la cérémonie',0,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(6,2,'Préparation au mariage obligatoire (session collective)',1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(7,2,'Entretien préalable avec le curé',2,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(8,2,'Délai minimum : 6 mois avant la date souhaitée',3,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(9,3,'Préparation de 2 ans minimum',0,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(10,3,'Réservée aux adolescents et adultes baptisés',1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(11,3,'Parcours de catéchèse approfondie',2,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(12,3,'Parrain ou marraine catholique pratiquant',3,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(13,4,'Première Communion : après 2 ans de catéchèse',0,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(14,4,'Messes quotidiennes à 06h30',1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(15,4,'Messes dominicales : 7h, 9h, 11h, 18h30',2,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(16,4,'Communion aux malades sur demande',3,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(17,5,'Confessions chaque jeudi de 17h00 à 18h15',0,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(18,5,'Confessions avant chaque messe sur demande',1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(19,5,'Préparation à la première confession incluse dans la catéchèse',2,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(20,6,'Messe des malades : 3ᵉ lundi du mois à 18h30',0,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(21,6,'Visite aux malades sur demande au secrétariat',1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(22,6,'Onction possible à domicile ou à l\'hôpital',2,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(23,6,'Contact d\'urgence : (+ 237) 655 529 999',3,'2026-11-05 12:45:47','2026-11-05 12:45:47');
/*!40000 ALTER TABLE `sacrement_details` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `sacrements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sacrements` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `img` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sacrements_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `sacrements` WRITE;
/*!40000 ALTER TABLE `sacrements` DISABLE KEYS */;
INSERT INTO `sacrements` (`id`, `slug`, `icon`, `title`, `subtitle`, `description`, `img`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES (1,'bapteme','💧','Baptême','Naître à la vie en Christ','Le Baptême est le premier des sacrements, celui par lequel nous naissons à la vie divine et devenons membres de l\'Église.','https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=600&h=400&fit=crop&auto=format',0,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(2,'mariage','💍','Mariage','L\'amour sanctifié par Dieu','Le Mariage est le sacrement par lequel un homme et une femme s\'unissent devant Dieu et l\'Église pour fonder une famille chrétienne.','https://images.unsplash.com/photo-1515657241610-a6b33f0f6c5a?w=600&h=400&fit=crop&auto=format',1,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(3,'confirmation','🕊️','Confirmation','L\'Esprit Saint au cœur de la foi','La Confirmation complète le Baptême et donne les dons de l\'Esprit Saint pour témoigner de la foi chrétienne.','https://images.unsplash.com/photo-1687459730891-47dfa3217811?w=600&h=400&fit=crop&auto=format',2,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(4,'eucharistie','✝️','Eucharistie','Le Corps et le Sang du Christ','L\'Eucharistie est « la source et le sommet de toute la vie chrétienne ». Première Communion et messes dominicales.','https://images.unsplash.com/photo-1573591012925-76dd1f406bd1?w=600&h=400&fit=crop&auto=format',3,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(5,'confession','🙏','Confession','La réconciliation avec Dieu','Le sacrement de Réconciliation nous offre le pardon de Dieu et la paix intérieure après le péché.','https://images.unsplash.com/photo-1631648859463-a42e6ce6d1e4?w=600&h=400&fit=crop&auto=format',4,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(6,'onction','🕯️','Onction des malades','La grâce dans l\'épreuve','L\'Onction des malades apporte la grâce divine aux personnes gravement malades ou âgées, en union avec la souffrance du Christ.','https://images.unsplash.com/photo-1763517789508-f23012039417?w=600&h=400&fit=crop&auto=format',5,1,'2026-11-05 12:45:47','2026-11-05 12:45:47');
/*!40000 ALTER TABLE `sacrements` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `settings_key_unique` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES (1,'parish.name','Paroisse Saint Dominique Savio','2026-11-05 12:45:46','2026-11-05 12:45:46'),(2,'parish.short_name','Saint Dominique Savio','2026-11-05 12:45:46','2026-11-05 12:45:46'),(3,'parish.location','Douala · Cameroun','2026-11-05 12:45:46','2026-11-05 12:45:46'),(4,'parish.address','Rue de la Messe Bonadoumbé, Douala','2026-11-05 12:45:46','2026-11-05 12:45:46'),(5,'parish.phone','(+237) 655 529 999','2026-11-05 12:45:46','2026-11-05 12:45:46'),(6,'parish.whatsapp_number','237655529999','2026-11-05 12:45:46','2026-11-05 12:45:46'),(7,'parish.email','secretariat@paroissesaintdominiquesavio.com','2026-11-05 12:45:46','2026-11-05 12:45:46'),(8,'parish.hours','Lun–Ven : 7h30–13h00 & 15h30–18h30','2026-11-05 12:45:46','2026-11-05 12:45:46'),(9,'parish.founded','4 décembre 1961','2026-11-05 12:45:46','2026-11-05 12:45:46'),(10,'parish.diocese','Archidiocèse de Douala','2026-11-05 12:45:46','2026-11-05 12:45:46'),(11,'parish.deanery','Doyenné Wouri I','2026-11-05 12:45:46','2026-11-05 12:45:46'),(12,'parish.tagline','Une communauté de foi, de prière, de fraternité et de service','2026-11-05 12:45:46','2026-11-05 12:45:46'),(13,'parish.maps_url','https://goo.gl/maps/bPGHqwpVQrioTF7n6','2026-11-05 12:45:46','2026-11-05 12:45:46'),(14,'social.facebook_url','','2026-11-05 12:45:46','2026-11-05 12:45:46'),(15,'social.youtube_url','','2026-11-05 12:45:46','2026-11-05 12:45:46'),(16,'social.instagram_url','','2026-11-05 12:45:46','2026-11-05 12:45:46');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `team_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_members` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `since` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `origin` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `motto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `born` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ordained` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ordained_by` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ministries` json DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `team_members_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `team_members` WRITE;
/*!40000 ALTER TABLE `team_members` DISABLE KEYS */;
INSERT INTO `team_members` (`id`, `slug`, `name`, `role`, `photo`, `since`, `origin`, `bio`, `motto`, `email`, `born`, `ordained`, `ordained_by`, `ministries`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES (1,'fankam-ngandjui','Abbé Jean-Robert FANKAM NGANDJUI','Curé de la paroisse','team/fankam-ngandjui.jpg','2022','Archidiocèse de Douala','Abbé Jean-Robert Fankam Ngandjui est le curé en titre de la Paroisse Saint Dominique Savio. Prêtre de l\'Archidiocèse de Douala, il assure la direction pastorale de notre communauté avec dévouement. Il coordonne l\'ensemble des activités paroissiales, préside les célébrations eucharistiques dominicales et accompagne les fidèles dans leur cheminement spirituel.','Que ma vie soit un témoignage vivant de l\'amour du Christ.','cure@paroissesaintdominiquesavio.com',NULL,NULL,NULL,NULL,0,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(2,'kamga','Abbé Joseph Fotso KAMGA','Vicaire','team/kamga.png','2021','Archidiocèse de Douala','Abbé Joseph Fotso Kamga est vicaire à la Paroisse Saint Dominique Savio. Fort de nombreuses années de ministère presbytéral, il accompagne avec sagesse et expérience les fidèles et les différents groupes paroissiaux. Il est particulièrement engagé dans le soutien spirituel des aînés et des personnes malades.','Servir avec humilité, aimer sans réserve.','vicariat@paroissesaintdominiquesavio.com',NULL,NULL,NULL,NULL,1,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(3,'pandeu-tatsi','Abbé Achille Hermann PANDEU TATSI','Vicaire','team/pandeu-tatsi.jpg','2023','Archidiocèse de Douala','Abbé Achille Hermann Pandeu Tatsi est vicaire à la paroisse. Dynamique et proche des jeunes, il anime la pastorale des jeunes, la catéchèse et les mouvements de jeunesse. Il s\'investit particulièrement dans la formation spirituelle et l\'accompagnement des lycéens et des étudiants.','La jeunesse est le visage de demain ; donnons-lui l\'Évangile aujourd\'hui.','jeunesse@paroissesaintdominiquesavio.com',NULL,NULL,NULL,NULL,2,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(4,'gwodog-tang','Abbé Simon Rodrigue GWODOG TANG','Vicaire','team/gwodog-tang.jpg','2023','Archidiocèse de Douala','Abbé Simon Rodrigue Gwodog Tang est vicaire à la Paroisse Saint Dominique Savio. Il coordonne les célébrations liturgiques hebdomadaires, accompagne les communautés ecclésiales vivantes (CEV) et participe à l\'animation des temps forts liturgiques tout au long de l\'année.','Annoncer le Christ ressuscité, voilà ma joie et ma mission.','liturgie@paroissesaintdominiquesavio.com',NULL,NULL,NULL,NULL,3,1,'2026-11-05 12:45:47','2026-11-05 12:45:47'),(5,'mbekou','Francis Hervé Duclair MBEKOU','Séminariste stagiaire','team/mbekou.jpg','2026','Grand Séminaire de Yaoundé','Francis Hervé Duclair Mbekou est séminariste en stage pastoral à la Paroisse Saint Dominique Savio. Dans le cadre de sa formation au sacerdoce, il participe activement à la vie paroissiale, à la catéchèse et aux différentes célébrations. Sa présence est un signe de l\'avenir de l\'Église.','Me préparer chaque jour à être un serviteur de Dieu et de son peuple.','stage@paroissesaintdominiquesavio.com',NULL,NULL,NULL,NULL,4,1,'2026-11-05 12:45:47','2026-11-05 12:45:47');
/*!40000 ALTER TABLE `team_members` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `transaction_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('entree','sortie') COLLATE utf8mb4_unicode_ci NOT NULL,
  `color` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#0B3D91',
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `transaction_categories` WRITE;
/*!40000 ALTER TABLE `transaction_categories` DISABLE KEYS */;
INSERT INTO `transaction_categories` (`id`, `name`, `type`, `color`, `sort_order`, `created_at`, `updated_at`) VALUES (1,'Dons et offrandes','entree','#16a34a',0,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(2,'Quêtes','entree','#0B3D91',1,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(3,'Location de salles','entree','#0e7490',2,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(4,'Centre d\'accueil','entree','#7c3aed',3,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(5,'Boutique et journal','entree','#0891b2',4,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(6,'Aide Caritas','sortie','#dc2626',5,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(7,'Entretien et réparations','sortie','#b45309',6,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(8,'Énergie et eau','sortie','#ca8a04',7,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(9,'Achat de fournitures','sortie','#4b5563',8,'2026-11-05 12:45:48','2026-11-05 12:45:48'),(10,'Projets paroissiaux','sortie','#1d4ed8',9,'2026-11-05 12:45:48','2026-11-05 12:45:48');
/*!40000 ALTER TABLE `transaction_categories` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `transaction_category_id` bigint unsigned DEFAULT NULL,
  `type` enum('entree','sortie') COLLATE utf8mb4_unicode_ci NOT NULL,
  `libelle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `montant` decimal(14,0) NOT NULL,
  `date` date NOT NULL,
  `reference` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `source_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transactions_source_type_source_id_unique` (`source_type`,`source_id`),
  KEY `transactions_transaction_category_id_foreign` (`transaction_category_id`),
  KEY `transactions_date_index` (`date`),
  KEY `transactions_type_index` (`type`),
  CONSTRAINT `transactions_transaction_category_id_foreign` FOREIGN KEY (`transaction_category_id`) REFERENCES `transaction_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('member','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'member',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `nom`, `prenom`, `email`, `phone`, `role`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES (1,'Admin','Savio','admin@savio.com',NULL,'admin',NULL,'$2y$12$RCBjqjhYjY2B8nevR6vbAeaeto.iABe2qFJjCkgAxcuUofl543MxG',NULL,'2026-11-05 12:45:46','2026-11-05 12:45:46');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

