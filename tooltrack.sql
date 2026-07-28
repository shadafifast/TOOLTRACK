-- phpMyAdmin SQL Dump
-- version 5.2.x
-- Host: 127.0.0.1
-- Waktu Pembuatan: 2026-07-28
-- Versi Server: 10.4.x-MariaDB
-- Versi PHP: 8.2.x

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tooltrack`
--
CREATE DATABASE IF NOT EXISTS `tooltrack` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `tooltrack`;

-- --------------------------------------------------------

--
-- Struktur dari tabel `departments`
--

DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `departments`
--

INSERT INTO `departments` (`id`, `name`) VALUES
(4, 'Fasilitas'),
(2, 'Operasional'),
(3, 'Teknik Elektrik'),
(1, 'Teknologi Informasi');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tool_categories`
--

DROP TABLE IF EXISTS `tool_categories`;
CREATE TABLE `tool_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `tool_categories`
--

INSERT INTO `tool_categories` (`id`, `name`) VALUES
(3, 'Alat Ukur'),
(1, 'Komputer & Laptop'),
(2, 'Peralatan Jaringan'),
(4, 'Perkakas Tangan'),
(5, 'Proyektor & Audio');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users` (Karyawan)
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `department_id` int(11) NOT NULL,
  `position` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `avatar` varchar(5) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_users_department` (`department_id`),
  CONSTRAINT `fk_users_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `users`
-- (password dummy adalah hash dari 'password123')
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `department_id`, `position`, `phone`, `avatar`, `created_at`, `updated_at`) VALUES
('EMP001', 'Reza Pratama', 'reza.p@tooltrack.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 'Manajer IT', '081234567890', 'RP', current_timestamp(), current_timestamp()),
('EMP002', 'Budi Santoso', 'budi.s@tooltrack.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, 'Teknisi Lapangan', '081298765432', 'BS', current_timestamp(), current_timestamp());

-- --------------------------------------------------------

--
-- Struktur dari tabel `tools`
--

DROP TABLE IF EXISTS `tools`;
CREATE TABLE `tools` (
  `id` varchar(10) NOT NULL,
  `name` varchar(200) NOT NULL,
  `category_id` int(11) NOT NULL,
  `location` varchar(150) NOT NULL,
  `status` enum('available','borrowed','overdue','damaged') NOT NULL DEFAULT 'available',
  `serial_number` varchar(100) NOT NULL,
  `purchase_date` date DEFAULT NULL,
  `description` text DEFAULT NULL,
  `photo_url` varchar(500) DEFAULT NULL,
  `last_user_id` varchar(10) DEFAULT NULL,
  `last_scan_time` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `serial_number` (`serial_number`),
  KEY `idx_tools_status` (`status`),
  KEY `fk_tools_category` (`category_id`),
  KEY `fk_tools_last_user` (`last_user_id`),
  CONSTRAINT `fk_tools_category` FOREIGN KEY (`category_id`) REFERENCES `tool_categories` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_tools_last_user` FOREIGN KEY (`last_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `tools`
--

INSERT INTO `tools` (`id`, `name`, `category_id`, `location`, `status`, `serial_number`, `purchase_date`, `description`, `photo_url`, `last_user_id`, `last_scan_time`, `created_at`, `updated_at`) VALUES
('TL-001', 'Laptop ThinkPad T14', 1, 'Lemari IT 1', 'available', 'SN-TP14-001', '2023-01-15', 'Laptop untuk dinas luar', NULL, NULL, NULL, current_timestamp(), current_timestamp()),
('TL-002', 'Multimeter Fluke 117', 3, 'Rak Alat 2', 'borrowed', 'SN-FL117-002', '2022-11-20', 'Multimeter digital presisi tinggi', NULL, 'EMP002', current_timestamp(), current_timestamp(), current_timestamp()),
('TL-003', 'Crimping Tool RJ45', 2, 'Laci Jaringan', 'available', 'SN-CR45-003', '2024-02-10', 'Alat crimp kabel UTP', NULL, NULL, NULL, current_timestamp(), current_timestamp());

-- --------------------------------------------------------

--
-- Struktur dari tabel `borrow_records`
--

DROP TABLE IF EXISTS `borrow_records`;
CREATE TABLE `borrow_records` (
  `id` varchar(10) NOT NULL,
  `tool_id` varchar(10) NOT NULL,
  `employee_id` varchar(10) NOT NULL,
  `borrow_time` datetime NOT NULL DEFAULT current_timestamp(),
  `estimated_return_date` date NOT NULL,
  `return_time` datetime DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `status` enum('active','returned','overdue') NOT NULL DEFAULT 'active',
  `condition_on_return` enum('excellent','good','fair','damaged') DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_borrow_status` (`status`),
  KEY `fk_borrow_tool` (`tool_id`),
  KEY `fk_borrow_employee` (`employee_id`),
  CONSTRAINT `fk_borrow_employee` FOREIGN KEY (`employee_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_borrow_tool` FOREIGN KEY (`tool_id`) REFERENCES `tools` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `borrow_records`
--

INSERT INTO `borrow_records` (`id`, `tool_id`, `employee_id`, `borrow_time`, `estimated_return_date`, `return_time`, `duration`, `status`, `condition_on_return`, `notes`, `created_at`, `updated_at`) VALUES
('BR-001', 'TL-002', 'EMP002', '2023-10-25 09:00:00', '2026-10-27', NULL, NULL, 'active', NULL, 'Untuk instalasi proyek', current_timestamp(), current_timestamp());

-- --------------------------------------------------------

--
-- Struktur dari tabel `activities`
--

DROP TABLE IF EXISTS `activities`;
CREATE TABLE `activities` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `type` enum('borrow','return','damage','maintenance','system') NOT NULL,
  `tool_id` varchar(10) NOT NULL,
  `user_id` varchar(10) DEFAULT NULL,
  `borrow_record_id` varchar(10) DEFAULT NULL,
  `description` text NOT NULL,
  `time` datetime NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_activities_time` (`time`),
  KEY `fk_activity_tool` (`tool_id`),
  KEY `fk_activity_user` (`user_id`),
  KEY `fk_activity_borrow` (`borrow_record_id`),
  CONSTRAINT `fk_activity_borrow` FOREIGN KEY (`borrow_record_id`) REFERENCES `borrow_records` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_activity_tool` FOREIGN KEY (`tool_id`) REFERENCES `tools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_activity_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `activities`
--

INSERT INTO `activities` (`id`, `type`, `tool_id`, `user_id`, `borrow_record_id`, `description`, `time`, `created_at`) VALUES
(1, 'system', 'TL-001', NULL, NULL, 'Alat baru ditambahkan ke sistem.', current_timestamp(), current_timestamp()),
(2, 'borrow', 'TL-002', 'EMP002', 'BR-001', 'Budi Santoso meminjam Multimeter Fluke 117.', current_timestamp(), current_timestamp());

-- --------------------------------------------------------

--
-- Struktur dari tabel `maintenance_logs`
--

DROP TABLE IF EXISTS `maintenance_logs`;
CREATE TABLE `maintenance_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `tool_id` varchar(10) NOT NULL,
  `reported_by` varchar(10) NOT NULL,
  `description` text NOT NULL,
  `status` enum('pending','in_progress','done') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_maintenance_tool` (`tool_id`),
  KEY `fk_maintenance_user` (`reported_by`),
  CONSTRAINT `fk_maintenance_tool` FOREIGN KEY (`tool_id`) REFERENCES `tools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_maintenance_user` FOREIGN KEY (`reported_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
