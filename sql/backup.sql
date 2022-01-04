-- MySQL dump 10.13  Distrib 8.0.25, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: covid
-- ------------------------------------------------------
-- Server version	8.0.19-0ubuntu5

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
-- Current Database: `covid`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `covid` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `covid`;

--
-- Table structure for table `checkin`
--

DROP TABLE IF EXISTS `checkin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `checkin` (
  `c_id` int NOT NULL AUTO_INCREMENT,
  `user` int DEFAULT NULL,
  `venue` int DEFAULT NULL,
  `time_stamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`c_id`),
  KEY `user` (`user`),
  KEY `venue` (`venue`),
  CONSTRAINT `checkin_ibfk_1` FOREIGN KEY (`user`) REFERENCES `user` (`u_id`) ON DELETE CASCADE,
  CONSTRAINT `checkin_ibfk_2` FOREIGN KEY (`venue`) REFERENCES `venue` (`v_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checkin`
--

LOCK TABLES `checkin` WRITE;
/*!40000 ALTER TABLE `checkin` DISABLE KEYS */;
INSERT INTO `checkin` VALUES (1,2,1,'2021-06-13 03:14:04'),(2,2,2,'2021-06-14 03:14:04'),(10,9,10,'2021-06-14 03:51:47'),(13,9,6,'2021-06-14 04:02:56'),(27,37,4,'2021-06-14 04:51:54'),(28,37,3,'2021-06-14 04:52:03'),(29,9,8,'2021-06-14 04:55:36');
/*!40000 ALTER TABLE `checkin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotspot`
--

DROP TABLE IF EXISTS `hotspot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotspot` (
  `h_id` int NOT NULL AUTO_INCREMENT,
  `venue` int DEFAULT NULL,
  `start` date DEFAULT NULL,
  `positive_tests` int DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`h_id`),
  KEY `venue` (`venue`),
  CONSTRAINT `hotspot_ibfk_1` FOREIGN KEY (`venue`) REFERENCES `venue` (`v_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotspot`
--

LOCK TABLES `hotspot` WRITE;
/*!40000 ALTER TABLE `hotspot` DISABLE KEYS */;
INSERT INTO `hotspot` VALUES (1,1,'2021-06-12',12,1),(2,6,'2021-06-10',60,1),(3,4,'2021-06-04',8034,1),(7,3,'2021-06-13',12,1);
/*!40000 ALTER TABLE `hotspot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `u_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(128) NOT NULL,
  `first_name` varchar(64) DEFAULT NULL,
  `last_name` varchar(64) DEFAULT NULL,
  `password_hash` varchar(256) DEFAULT NULL,
  `health_official` tinyint(1) DEFAULT '0',
  `infected` tinyint(1) DEFAULT '0',
  `email_notification` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`u_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'venue@test.com','tester','test','e622da235a56977383e1db8bfe71eaa9b6156cec5cd95df9dc4d2aa3ac5d267a',0,0,1),(2,'user@test.com','Patrick','star','04f8996da763b7a969b1028ee3007569eaf3a635486ddab211d512c85b9df8fb',0,1,1),(3,'health@test.com','Matt','Vol','62484e22a6a5ade1ba25cb1b7c55c4b8861de24caddab73c9409742734008b26',1,0,1),(9,'volarismatthew@gmail.com','Matthew','Volaris',NULL,0,0,0),(37,'a1799436@adelaide.edu.au','sponge','squidward','f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b',0,0,0),(38,'matthewvolaris@yahoo.com.au','Matthew','Volaris','f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b',0,0,0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venue`
--

DROP TABLE IF EXISTS `venue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venue` (
  `v_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `latitude` float DEFAULT NULL,
  PRIMARY KEY (`v_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venue`
--

LOCK TABLES `venue` WRITE;
/*!40000 ALTER TABLE `venue` DISABLE KEYS */;
INSERT INTO `venue` VALUES (1,'Zoo',138.606,-34.9146),(2,'University of Adelaide',138.605,-34.9196),(3,'Adelaide Oval',138.596,-34.9153),(4,'The Beachouse',138.511,-34.979),(5,'Carrick Hill',138.632,-34.9793),(6,'Mount Lofty Botanic Garden',138.715,-34.987),(7,'Art Gallery of South Australia',138.604,-34.9206),(8,'Port Noarlunga Jetty Fishing',138.466,-35.149),(9,'Amazon Waterlily Pavilion',138.611,-34.9181),(10,'Adelaide Airport',138.533,-34.9462),(11,'Adelaide Convention Centre',138.594,-34.9203);
/*!40000 ALTER TABLE `venue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venueOwner`
--

DROP TABLE IF EXISTS `venueOwner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venueOwner` (
  `user` int NOT NULL,
  `venue` int NOT NULL,
  PRIMARY KEY (`user`,`venue`),
  KEY `venue` (`venue`),
  CONSTRAINT `venueOwner_ibfk_1` FOREIGN KEY (`user`) REFERENCES `user` (`u_id`) ON DELETE CASCADE,
  CONSTRAINT `venueOwner_ibfk_2` FOREIGN KEY (`venue`) REFERENCES `venue` (`v_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venueOwner`
--

LOCK TABLES `venueOwner` WRITE;
/*!40000 ALTER TABLE `venueOwner` DISABLE KEYS */;
INSERT INTO `venueOwner` VALUES (1,1),(38,4);
/*!40000 ALTER TABLE `venueOwner` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-06-14  4:59:23
