-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, 
SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema atts
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema atts
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `atts` DEFAULT CHARACTER SET utf8mb4 COLLATE 
utf8mb4_0900_ai_ci ;
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
  `email` VARCHAR(45) NULL DEFAULT NULL,
  `diverse` TINYINT NULL DEFAULT NULL,
  `diverse_amount` DOUBLE NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE 
CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `reference_UNIQUE` (`reference` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `atts`.`invoice`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `atts`.`invoice` ;

CREATE TABLE IF NOT EXISTS `atts`.`invoice` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE 
CURRENT_TIMESTAMP,
  `proforma` TINYINT NULL DEFAULT NULL,
  `invoice_number` INT NOT NULL,
  `file_uri` VARCHAR(45) NULL DEFAULT NULL,
  `start_period` DATE NULL DEFAULT NULL,
  `end_period` DATE NULL DEFAULT NULL,
  `ht_amount` DOUBLE NULL DEFAULT NULL,
  `ttc_amount` DOUBLE NULL DEFAULT NULL,
  `client_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_invoice_client1_idx` (`client_id` ASC) VISIBLE,
  CONSTRAINT `fk_invoice_client1`
    FOREIGN KEY (`client_id`)
    REFERENCES `atts`.`client` (`id`))
ENGINE = InnoDB
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
  `invoice_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_consumption_invoice1_idx` (`invoice_id` ASC) VISIBLE,
  CONSTRAINT `fk_consumption_invoice1`
    FOREIGN KEY (`invoice_id`)
    REFERENCES `atts`.`invoice` (`id`))
ENGINE = InnoDB
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
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE 
CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_Subscription_Client_idx` (`client_id` ASC) VISIBLE,
  CONSTRAINT `fk_Subscription_Client`
    FOREIGN KEY (`client_id`)
    REFERENCES `atts`.`client` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `atts`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `atts`.`user` ;

CREATE TABLE IF NOT EXISTS `atts`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NULL DEFAULT NULL,
  `email` VARCHAR(45) NULL DEFAULT NULL,
  `client_id` INT NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE 
CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  INDEX `fk_user_client1_idx` (`client_id` ASC) VISIBLE,
  CONSTRAINT `fk_user_client1`
    FOREIGN KEY (`client_id`)
    REFERENCES `atts`.`client` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 28
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

