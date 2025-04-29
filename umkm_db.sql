-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 29 Apr 2025 pada 13.01
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `umkm_db`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `predictions`
--

CREATE TABLE `predictions` (
  `id` int(11) NOT NULL,
  `owner_name` varchar(255) NOT NULL,
  `business_name` varchar(255) NOT NULL,
  `business_location` varchar(255) NOT NULL,
  `age` int(11) NOT NULL,
  `education` int(11) NOT NULL,
  `initial_capital` decimal(15,2) NOT NULL,
  `financial_record_keeping` tinyint(1) NOT NULL,
  `internet_usage` tinyint(1) NOT NULL,
  `business_plan` tinyint(1) NOT NULL,
  `marketing_effort` tinyint(1) NOT NULL,
  `partnership` tinyint(1) NOT NULL,
  `parent_business_experience` tinyint(1) NOT NULL,
  `industry_experience` tinyint(1) NOT NULL,
  `owner_gender` tinyint(1) NOT NULL,
  `professional_advice` tinyint(1) NOT NULL,
  `probability` float NOT NULL,
  `prediction` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `predictions`
--

INSERT INTO `predictions` (`id`, `owner_name`, `business_name`, `business_location`, `age`, `education`, `initial_capital`, `financial_record_keeping`, `internet_usage`, `business_plan`, `marketing_effort`, `partnership`, `parent_business_experience`, `industry_experience`, `owner_gender`, `professional_advice`, `probability`, `prediction`, `created_at`) VALUES
(1, 'andre syaputra', 'jingga kopi', 'krueng mane,aceh utara', 26, 4, 1.00, 1, 1, 1, 1, 1, 1, 5, 1, 7, 0.996, '1', '2025-02-28 10:26:20'),
(2, 'andre', 'pt abadi', 'lhoksemawe', 18, 4, 1.00, 1, 1, 1, 7, 1, 1, 10, 1, 1, 0.9956, '1', '2025-04-15 09:04:52'),
(3, 'kiki', 'dimsum', 'aceh', 22, 4, 1.00, 1, 0, 1, 3, 0, 1, 2, 1, 7, 0.6999, '1', '2025-04-15 09:32:06'),
(4, 'andre syaputra', 'jingga kopi', 'krueng mane,aceh utara', 26, 4, 1.00, 1, 1, 1, 1, 1, 1, 5, 1, 7, 0.996, '1', '2025-04-15 09:48:13'),
(5, 'andre', 'pt abadi', 'lhoksemawe', 18, 4, 1.00, 1, 1, 1, 7, 1, 1, 10, 1, 1, 0.9956, '1', '2025-04-15 09:48:13'),
(6, 'kiki', 'dimsum', 'aceh', 22, 4, 1.00, 1, 0, 1, 3, 0, 1, 2, 1, 7, 0.6999, '1', '2025-04-15 09:48:13'),
(7, 'andrea', 'andre tampan vape', 'aceh utara', 50, 4, 1.00, 1, 1, 1, 7, 1, 1, 1, 1, 1, 0.9929, '1', '2025-04-23 14:58:47');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`) VALUES
(1, 'admin', 'admin123', 'admin', '2025-02-25 10:02:41');

-- --------------------------------------------------------

--
-- Struktur dari tabel `videos`
--

CREATE TABLE `videos` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `video_url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `videos`
--

INSERT INTO `videos` (`id`, `title`, `description`, `video_url`, `created_at`) VALUES
(1, 'pentingnya ecomers', 'kali ini', '/uploads/1740589753412.mp4', '2025-02-26 17:09:13'),
(2, 'aaa', 'aa', '/uploads/1744709286524.mp4', '2025-04-15 09:28:06'),
(3, 'pentingnya pubic', 'awdwdawd', '/uploads/1744709408196.mp4', '2025-04-15 09:30:08'),
(4, 'pentingnya digital marketing bagi bisnis', 'Pentingnya Digital Marketing bagi Bisnis\r\n\r\nDi era digital saat ini, digital marketing menjadi kunci utama dalam mengembangkan dan mempertahankan eksistensi bisnis. Berbeda dengan pemasaran tradisional, digital marketing memungkinkan bisnis untuk menjangkau audiens yang lebih luas, lebih cepat, dan dengan biaya yang lebih efisien. Melalui berbagai platform seperti media sosial, mesin pencari, email, dan website, bisnis dapat membangun hubungan yang lebih dekat dengan pelanggan.\r\n\r\nDigital marketing juga memberikan data dan analitik yang akurat untuk mengevaluasi kinerja kampanye secara real-time. Hal ini membantu pengambilan keputusan yang lebih tepat dan strategi pemasaran yang lebih terarah. Selain itu, digital marketing memungkinkan personalisasi pesan kepada pelanggan, sehingga meningkatkan peluang konversi dan loyalitas.\r\n\r\nDengan persaingan bisnis yang semakin ketat, memanfaatkan digital marketing bukan lagi sekadar pilihan, melainkan kebutuhan. Bisnis yang tidak beradaptasi dengan perkembangan digital berisiko tertinggal dan kehilangan peluang pasar yang sangat besar.', '/uploads/1745420800254.mp4', '2025-04-23 15:06:40');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `predictions`
--
ALTER TABLE `predictions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_business_name` (`business_name`),
  ADD KEY `idx_owner_name` (`owner_name`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indeks untuk tabel `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `predictions`
--
ALTER TABLE `predictions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `videos`
--
ALTER TABLE `videos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
