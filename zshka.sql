/*
 Navicat MySQL Data Transfer

 Source Server         : local
 Source Server Type    : MySQL
 Source Server Version : 80013
 Source Host           : localhost:3306
 Source Schema         : zshka

 Target Server Type    : MySQL
 Target Server Version : 80013
 File Encoding         : 65001

 Date: 04/01/2019 16:25:16
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for docs
-- ----------------------------
DROP TABLE IF EXISTS `docs`;
CREATE TABLE `docs` (
  `did` int(11) NOT NULL AUTO_INCREMENT,
  `dname` varchar(35) CHARACTER SET utf8 COLLATE utf8_hungarian_ci DEFAULT NULL,
  `osz` int(255) DEFAULT NULL,
  `year` int(4) DEFAULT NULL,
  PRIMARY KEY (`did`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- ----------------------------
-- Records of docs
-- ----------------------------
BEGIN;
INSERT INTO `docs` VALUES (1, 'HU_SZZSH_A_II_5_1900_659', 1, 1900);
INSERT INTO `docs` VALUES (2, 'HU_SZZSH_A_II_5_1900_660', 1, 1900);
INSERT INTO `docs` VALUES (3, 'HU_SZZSH_A_II_5_1900_661', 1, 1900);
INSERT INTO `docs` VALUES (4, 'HU_SZZSH_A_II_5_1900_662', 2, 1900);
COMMIT;

-- ----------------------------
-- Table structure for ksz
-- ----------------------------
DROP TABLE IF EXISTS `ksz`;
CREATE TABLE `ksz` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kulcsszo` varchar(40) CHARACTER SET utf8 COLLATE utf8_hungarian_ci DEFAULT NULL,
  `ktip` enum('','név','év','törzsszám','helység') CHARACTER SET utf8 COLLATE utf8_hungarian_ci DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- ----------------------------
-- Records of ksz
-- ----------------------------
BEGIN;
INSERT INTO `ksz` VALUES (1, 'Szegedi Zsidó Hitközség', '');
INSERT INTO `ksz` VALUES (2, 'kultusz adó', '');
INSERT INTO `ksz` VALUES (3, 'törlesztés', '');
INSERT INTO `ksz` VALUES (4, 'indoklás', '');
INSERT INTO `ksz` VALUES (5, 'kérvény', '');
INSERT INTO `ksz` VALUES (6, 'lakcím', '');
INSERT INTO `ksz` VALUES (7, 'Ádám Pál', 'név');
INSERT INTO `ksz` VALUES (8, 'Grosz testvérek', 'név');
INSERT INTO `ksz` VALUES (9, '1900', 'év');
INSERT INTO `ksz` VALUES (10, 'Ádám János', 'név');
INSERT INTO `ksz` VALUES (11, 'katona', '');
INSERT INTO `ksz` VALUES (12, 'Arató Dezső', 'név');
INSERT INTO `ksz` VALUES (13, 'Ádám Ödön', 'név');
INSERT INTO `ksz` VALUES (14, 'Bajnok Mór', 'név');
INSERT INTO `ksz` VALUES (15, 'protestáns', '');
INSERT INTO `ksz` VALUES (16, 'figyelmeztetés', '');
INSERT INTO `ksz` VALUES (17, 'dr. Barta Dezső', 'név');
INSERT INTO `ksz` VALUES (18, 'foglalkozás', '');
INSERT INTO `ksz` VALUES (19, 'Birnfeld Manó', 'név');
INSERT INTO `ksz` VALUES (20, 'Szlogov', 'név');
INSERT INTO `ksz` VALUES (21, 'Galícia', 'név');
INSERT INTO `ksz` VALUES (22, 'Blauer Miksa', 'név');
COMMIT;

-- ----------------------------
-- Table structure for kt
-- ----------------------------
DROP TABLE IF EXISTS `kt`;
CREATE TABLE `kt` (
  `rowid` int(11) NOT NULL AUTO_INCREMENT,
  `ksz` int(11) DEFAULT NULL,
  `docid` int(11) DEFAULT NULL,
  `osz` int(11) DEFAULT NULL,
  PRIMARY KEY (`rowid`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- ----------------------------
-- Records of kt
-- ----------------------------
BEGIN;
INSERT INTO `kt` VALUES (1, 1, 1, 1);
INSERT INTO `kt` VALUES (2, 1, 2, 1);
INSERT INTO `kt` VALUES (3, 1, 3, 1);
INSERT INTO `kt` VALUES (4, 1, 4, 1);
INSERT INTO `kt` VALUES (5, 2, 1, 1);
INSERT INTO `kt` VALUES (6, 2, 2, 1);
INSERT INTO `kt` VALUES (7, 2, 3, 1);
INSERT INTO `kt` VALUES (8, 2, 4, 1);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
