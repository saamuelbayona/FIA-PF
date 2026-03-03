-- Schema para cPanel - Solo tablas (sin CREATE DATABASE)
-- Configuración de charset UTF-8
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- NOTA: Asegúrate de seleccionar tu base de datos en phpMyAdmin antes de ejecutar este script

-- ELIMINAR TABLAS EXISTENTES SI EXISTEN
DROP TABLE IF EXISTS `financial_data`;
DROP TABLE IF EXISTS `fin_cartera`;
DROP TABLE IF EXISTS `com_ventas_sede1`;
DROP TABLE IF EXISTS `rh_gestion_talento`;
DROP TABLE IF EXISTS `log_gastos_sedes`;
DROP TABLE IF EXISTS `prod_capacidad_instalada`;
DROP TABLE IF EXISTS `prod_historico_sacrificio`;
DROP TABLE IF EXISTS `cumplimiento_sagrilaft`;
DROP TABLE IF EXISTS `gerencia_estrategica`;
DROP TABLE IF EXISTS `users`;

-- 1. TABLA: financial_data (Balance General - Fuentes y Usos)
CREATE TABLE `financial_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(50) NOT NULL COMMENT 'ACTIVOS, PASIVOS, PATRIMONIO',
  `subcategory` varchar(50) DEFAULT NULL COMMENT 'CORRIENTE, NO CORRIENTE, etc',
  `account_name` varchar(200) NOT NULL COMMENT 'Nombre de la cuenta',
  `value_2025` decimal(18,2) DEFAULT NULL COMMENT 'Valor año 2025',
  `value_2024` decimal(18,2) DEFAULT NULL COMMENT 'Valor año 2024',
  `variation` decimal(18,2) DEFAULT NULL COMMENT 'Variación entre años',
  `fuentes` decimal(18,2) DEFAULT NULL COMMENT 'Fuentes de recursos',
  `usos` decimal(18,2) DEFAULT NULL COMMENT 'Usos de recursos',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_subcategory` (`subcategory`),
  KEY `idx_account` (`account_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TABLA: fin_cartera (Gestión de Cartera)
CREATE TABLE `fin_cartera` (
  `mes` varchar(10) DEFAULT NULL COMMENT 'Mes del registro',
  `total_cartera` bigint(20) DEFAULT NULL COMMENT 'Total de cartera',
  `cartera_vencida` bigint(20) DEFAULT NULL COMMENT 'Cartera vencida',
  `indice_mora` decimal(5,2) DEFAULT NULL COMMENT 'Índice de morosidad',
  `rotacion_dias` decimal(8,2) DEFAULT NULL COMMENT 'Días de rotación',
  `ventas_contado` bigint(20) DEFAULT NULL COMMENT 'Ventas de contado',
  `ventas_credito` bigint(20) DEFAULT NULL COMMENT 'Ventas a crédito',
  `exp_millones_2025` int(11) DEFAULT NULL COMMENT 'Exportaciones 2025 en millones',
  `exp_millones_2024` int(11) DEFAULT NULL COMMENT 'Exportaciones 2024 en millones',
  KEY `idx_mes` (`mes`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TABLA: com_ventas_sede1 (Gestión Comercial - Ventas por Línea)
CREATE TABLE `com_ventas_sede1` (
  `linea` varchar(100) DEFAULT NULL COMMENT 'Línea de producto',
  `categoria` varchar(50) DEFAULT NULL COMMENT 'Categoría del producto',
  `kg_2025` bigint(20) DEFAULT NULL COMMENT 'Kilogramos vendidos 2025',
  `kg_2024` bigint(20) DEFAULT NULL COMMENT 'Kilogramos vendidos 2024',
  `pct_participacion` decimal(5,4) DEFAULT NULL COMMENT 'Porcentaje de participación',
  `cumplimiento_meta` decimal(5,4) DEFAULT NULL COMMENT 'Cumplimiento de meta',
  KEY `idx_linea` (`linea`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TABLA: rh_gestion_talento (Gestión Humana)
CREATE TABLE `rh_gestion_talento` (
  `concepto` varchar(100) DEFAULT NULL COMMENT 'Concepto de gestión humana',
  `valor_2024` bigint(20) DEFAULT NULL COMMENT 'Valor año 2024',
  `valor_2025` bigint(20) DEFAULT NULL COMMENT 'Valor año 2025',
  `cantidad_horas` int(11) DEFAULT NULL COMMENT 'Cantidad de horas',
  KEY `idx_concepto` (`concepto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. TABLA: log_gastos_sedes (Gestión Logística)
CREATE TABLE `log_gastos_sedes` (
  `sede_id` int(11) DEFAULT NULL COMMENT 'ID de la sede',
  `concepto` varchar(100) DEFAULT NULL COMMENT 'Concepto del gasto',
  `valor_2024` bigint(20) DEFAULT NULL COMMENT 'Valor año 2024',
  `valor_2025` bigint(20) DEFAULT NULL COMMENT 'Valor año 2025',
  KEY `idx_sede` (`sede_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. TABLA: prod_capacidad_instalada (Producción - Capacidad de Granjas)
CREATE TABLE `prod_capacidad_instalada` (
  `tipo_clima` varchar(20) DEFAULT NULL COMMENT 'Tipo de clima: FRIO, CALIDO',
  `nombre_granja` varchar(100) DEFAULT NULL COMMENT 'Nombre de la granja',
  `metros_cuadrados` int(11) DEFAULT NULL COMMENT 'Metros cuadrados',
  `capacidad_aves` int(11) DEFAULT NULL COMMENT 'Capacidad en aves',
  KEY `idx_tipo_clima` (`tipo_clima`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. TABLA: prod_historico_sacrificio (Producción - Histórico de Sacrificio)
CREATE TABLE `prod_historico_sacrificio` (
  `mes` varchar(20) DEFAULT NULL COMMENT 'Mes del registro',
  `prog_2024` bigint(20) DEFAULT NULL COMMENT 'Programado 2024',
  `real_2024` bigint(20) DEFAULT NULL COMMENT 'Real 2024',
  `encasetado_real_2025` bigint(20) DEFAULT NULL COMMENT 'Encasetado real 2025',
  KEY `idx_mes` (`mes`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. TABLA: cumplimiento_sagrilaft (Sistema SAGRILAFT)
CREATE TABLE `cumplimiento_sagrilaft` (
  `contraparte` varchar(50) DEFAULT NULL COMMENT 'Tipo de contraparte',
  `rechazados` int(11) DEFAULT NULL COMMENT 'Cantidad rechazados',
  `pct_la_ft` decimal(5,4) DEFAULT NULL COMMENT 'Porcentaje LA/FT',
  `pct_falla_doc` decimal(5,4) DEFAULT NULL COMMENT 'Porcentaje falla documental',
  `pct_antecedentes` decimal(5,4) DEFAULT NULL COMMENT 'Porcentaje antecedentes',
  KEY `idx_contraparte` (`contraparte`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. TABLA: gerencia_estrategica (Gerencia Estratégica)
CREATE TABLE `gerencia_estrategica` (
  `indicador` varchar(100) DEFAULT NULL COMMENT 'Nombre del indicador',
  `resultado` varchar(100) DEFAULT NULL COMMENT 'Resultado del indicador',
  KEY `idx_indicador` (`indicador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. TABLA: users (Usuarios del Sistema)
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL COMMENT 'Nombre de usuario',
  `password` varchar(255) NOT NULL COMMENT 'Contraseña (sin encriptar por ahora)',
  `full_name` varchar(100) DEFAULT NULL COMMENT 'Nombre completo',
  `role` varchar(20) NOT NULL DEFAULT 'viewer' COMMENT 'Rol: admin, analyst, viewer',
  `is_active` tinyint(1) DEFAULT 1 COMMENT 'Usuario activo',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- INSERTAR USUARIOS POR DEFECTO
INSERT INTO `users` (`username`, `password`, `full_name`, `role`, `is_active`) VALUES
('admin', 'admin123', 'Administrador', 'admin', 1),
('analista', 'analista123', 'Analista Financiero', 'analyst', 1),
('viewer', 'viewer123', 'Visualizador', 'viewer', 1);

-- Mensaje de confirmación
SELECT 'Tablas creadas exitosamente. Ahora puedes importar los datos desde los archivos CSV.' AS mensaje;
