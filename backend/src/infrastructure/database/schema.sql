-- Schema consolidado para almacenar datos de los CSV

-- Tabla para Auditoría (Análisis de Merma)
CREATE TABLE IF NOT EXISTS auditoria_merma (
  id INT AUTO_INCREMENT PRIMARY KEY,
  anio INT NOT NULL,
  mes VARCHAR(20),
  mes_numero INT,
  porcentaje_merma DECIMAL(5,2),
  serie VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_anio_mes (anio, mes_numero)
);

-- Tabla para Fuentes y Usos (Balance General)
CREATE TABLE IF NOT EXISTS fuentes_usos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  anio INT NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  tipo VARCHAR(20) NOT NULL, -- 'ACTIVO', 'PASIVO', 'PATRIMONIO'
  valor_actual DECIMAL(18,2),
  valor_anterior DECIMAL(18,2),
  variacion DECIMAL(18,2),
  fuentes DECIMAL(18,2),
  usos DECIMAL(18,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_anio_tipo (anio, tipo)
);

-- Tabla para Gestión de Cartera
CREATE TABLE IF NOT EXISTS gestion_cartera (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mes VARCHAR(20) NOT NULL,
  anio INT NOT NULL,
  total_cartera DECIMAL(15,2),
  cartera_vencida DECIMAL(15,2),
  indice_morosidad DECIMAL(5,2),
  variacion_cartera_vencida DECIMAL(15,2),
  dias_rotacion DECIMAL(8,2),
  porcentaje_ventas_contado DECIMAL(5,2),
  ventas_contado DECIMAL(15,2),
  porcentaje_ventas_credito DECIMAL(5,2),
  ventas_credito DECIMAL(15,2),
  ventas_netas_empresa DECIMAL(15,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_anio_mes (anio, mes)
);

-- Tabla CONSOLIDADA para Gestión Humana (personal, costos, retiros, horas)
CREATE TABLE IF NOT EXISTS gestion_humana (
  id INT AUTO_INCREMENT PRIMARY KEY,
  anio INT NOT NULL,
  mes VARCHAR(20),
  tipo_dato VARCHAR(50) NOT NULL, -- 'PERSONAL', 'COSTO', 'RETIRO', 'HORAS_EXTRAS'
  concepto VARCHAR(100),
  valor_numerico DECIMAL(15,2),
  valor_texto VARCHAR(200),
  porcentaje DECIMAL(5,2),
  cantidad INT,
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_anio_tipo (anio, tipo_dato)
);

-- Tabla para Gestión Logística
CREATE TABLE IF NOT EXISTS gestion_logistica (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sede VARCHAR(50) NOT NULL,
  anio INT NOT NULL,
  concepto VARCHAR(100) NOT NULL,
  total_2024 DECIMAL(15,2),
  total_2025 DECIMAL(15,2),
  variacion_porcentaje DECIMAL(8,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_sede_anio (sede, anio)
);

-- Tabla CONSOLIDADA para Producción (encasetado, sacrificio, granjas)
CREATE TABLE IF NOT EXISTS produccion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  anio INT NOT NULL,
  mes VARCHAR(20),
  mes_numero INT,
  tipo_dato VARCHAR(50) NOT NULL, -- 'ENCASETADO', 'GRANJA'
  concepto VARCHAR(100), -- nombre de granja o tipo de clima
  programado INT,
  real_value INT,
  metros INT,
  aves INT,
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_anio_tipo (anio, tipo_dato)
);

-- Tabla CONSOLIDADA para Gestión Comercial y Ventas
CREATE TABLE IF NOT EXISTS gestion_comercial (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sede VARCHAR(50),
  canal VARCHAR(100),
  tipo_dato VARCHAR(50), -- 'VENTAS_CANAL', 'EQUIPO_VENTAS'
  mes VARCHAR(20),
  anio INT NOT NULL,
  concepto VARCHAR(200),
  valor_numerico DECIMAL(15,2),
  valor_texto VARCHAR(200),
  porcentaje DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_anio_tipo (anio, tipo_dato)
);

-- Tabla para Sistema SAGRILAFT
CREATE TABLE IF NOT EXISTS sistema_sagrilaft (
  id INT AUTO_INCREMENT PRIMARY KEY,
  anio INT NOT NULL,
  mes VARCHAR(20),
  mes_numero INT,
  actividad VARCHAR(200),
  responsable VARCHAR(100),
  estado VARCHAR(50),
  porcentaje_cumplimiento DECIMAL(5,2),
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_anio_mes (anio, mes_numero)
);
