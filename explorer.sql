-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: explorer
-- ------------------------------------------------------
-- Server version	8.0.42

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

--
-- Table structure for table `files`
--

DROP TABLE IF EXISTS `files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `original_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` int DEFAULT NULL,
  `mime_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `folder_id` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_files_folder_id` (`folder_id`),
  CONSTRAINT `fk_files_folder` FOREIGN KEY (`folder_id`) REFERENCES `folders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files`
--

LOCK TABLES `files` WRITE;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;
/*!40000 ALTER TABLE `files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `folders`
--

DROP TABLE IF EXISTS `folders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `folders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_folders_parent_id` (`parent_id`),
  CONSTRAINT `fk_folders_parent` FOREIGN KEY (`parent_id`) REFERENCES `folders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `folders`
--

LOCK TABLES `folders` WRITE;
/*!40000 ALTER TABLE `folders` DISABLE KEYS */;
INSERT INTO `folders` VALUES (1,'Documents',NULL,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(2,'Downloads',NULL,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(3,'Pictures',NULL,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(4,'Music',NULL,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(5,'Videos',NULL,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(6,'Projects',NULL,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(7,'Work',NULL,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(8,'Archives',NULL,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(9,'Temp Files',NULL,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(10,'Misc',NULL,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(11,'Projects',1,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(12,'Images',1,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(13,'Notes',1,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(14,'Vue App',11,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(15,'React App',11,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(16,'Screenshots',12,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(17,'Installers',2,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(18,'Vacation',3,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(19,'Family',3,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(20,'Rock',4,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(21,'Pop',4,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(22,'Movies',5,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(23,'Tutorials',5,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(24,'Invoices',1,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(25,'Reports',1,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(26,'Letters',1,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(27,'Angular App',11,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(28,'Node Backend',11,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(29,'Components',14,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(30,'Pages',14,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(31,'Store',14,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(32,'Components',15,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(33,'Hooks',15,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(34,'Pages',15,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(35,'Wallpapers',12,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(36,'Icons',12,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(37,'Ebooks',2,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(38,'Software',2,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(39,'Friends',3,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(40,'Events',3,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(41,'Beach',18,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(42,'Mountains',18,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(43,'City',18,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(44,'Jazz',4,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(45,'Classical',4,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(46,'Clips',5,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(47,'Documentaries',5,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(48,'Action',22,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(49,'Comedy',22,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(50,'Drama',22,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(51,'Programming',23,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(52,'Cooking',23,'2025-08-22 00:23:24','2025-08-22 00:23:24'),(53,'Fitness',23,'2025-08-22 00:23:24','2025-08-22 00:23:24');
/*!40000 ALTER TABLE `folders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'explorer'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-22  7:48:44
