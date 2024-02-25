-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema atts
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema atts
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `atts` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `atts` ;

-- -----------------------------------------------------
-- Table `atts`.`client`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `atts`.`client` ;

CREATE TABLE IF NOT EXISTS `atts`.`client` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `default_subscription` DOUBLE NULL DEFAULT NULL,
  `reference` VARCHAR(45) NULL DEFAULT NULL,
  `postal_code` VARCHAR(45) NULL DEFAULT NULL,
  `address` VARCHAR(100) NULL DEFAULT NULL,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `city` VARCHAR(45) NULL DEFAULT NULL,
  `diverse` TINYINT NULL DEFAULT NULL,
  `diverse_amount` DOUBLE NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `reference_UNIQUE` (`reference` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 554
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `atts`.`invoice`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `atts`.`invoice` ;

CREATE TABLE IF NOT EXISTS `atts`.`invoice` (
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `proforma` TINYINT NULL DEFAULT NULL,
  `special_numbers` TINYINT NULL DEFAULT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  `file_uri` VARCHAR(45) NULL DEFAULT NULL,
  `start_period` DATE NULL DEFAULT NULL,
  `end_period` DATE NULL DEFAULT NULL,
  `ht_amount` DOUBLE NULL DEFAULT NULL,
  `ttc_amount` DOUBLE NULL DEFAULT NULL,
  `client_id` INT NOT NULL,
  `tva` DOUBLE NULL,
  `status` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_invoice_client1_idx` (`client_id` ASC) VISIBLE,
  CONSTRAINT `fk_invoice_client1`
    FOREIGN KEY (`client_id`)
    REFERENCES `atts`.`client` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1251
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `atts`.`consumption`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `atts`.`consumption` ;

CREATE TABLE IF NOT EXISTS `atts`.`consumption` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `duration` INT NULL DEFAULT NULL,
  `count` INT NULL DEFAULT '1',
  `type` VARCHAR(45) NULL DEFAULT NULL,
  `start_period` DATE NULL,
  `end_period` DATE NULL,
  `ht_amount` DOUBLE NULL,
  `invoice_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_consumption_invoice1_idx` (`invoice_id` ASC) VISIBLE,
  CONSTRAINT `fk_consumption_invoice1`
    FOREIGN KEY (`invoice_id`)
    REFERENCES `atts`.`invoice` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 561
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `atts`.`subscription`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `atts`.`subscription` ;

CREATE TABLE IF NOT EXISTS `atts`.`subscription` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `price` DOUBLE NULL DEFAULT NULL,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `data` VARCHAR(45) NULL DEFAULT NULL,
  `client_id` INT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_Subscription_Client_idx` (`client_id` ASC) VISIBLE,
  CONSTRAINT `fk_Subscription_Client`
    FOREIGN KEY (`client_id`)
    REFERENCES `atts`.`client` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `atts`.`email_template`
-- -----------------------------------------------------

DROP TABLE IF EXISTS `atts`.`email_template` ;

CREATE TABLE IF NOT EXISTS `atts`.`email_template` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `content` VARCHAR(1000) NULL DEFAULT NULL,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `user_id` INT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_Email_Template_User_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_Email_Template_User`
    FOREIGN KEY (`user_id`)
    REFERENCES `atts`.`user` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `atts`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `atts`.`user` ;

CREATE TABLE IF NOT EXISTS `atts`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(45) NULL DEFAULT NULL,
  `first_name` VARCHAR(45) NULL DEFAULT NULL,
  `last_name` VARCHAR(45) NULL DEFAULT NULL,
  `phone_number` VARCHAR(20) NULL DEFAULT NULL,
  `client_id` INT NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  INDEX `fk_user_client1_idx` (`client_id` ASC) VISIBLE,
  CONSTRAINT `fk_user_client1`
    FOREIGN KEY (`client_id`)
    REFERENCES `atts`.`client` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 32
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `atts`.`log`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `atts`.`log` ;

CREATE TABLE IF NOT EXISTS `atts`.`log` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `source` VARCHAR(45) NULL DEFAULT NULL,
  `level` VARCHAR(45) NULL DEFAULT NULL,
  `message` VARCHAR(150) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
)
ENGINE = InnoDB
AUTO_INCREMENT = 32
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
