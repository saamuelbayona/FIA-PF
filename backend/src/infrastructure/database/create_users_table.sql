-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL COMMENT 'Contraseña (texto plano por ahora, implementar bcrypt)',
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'analyst', 'viewer') NOT NULL DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar usuarios por defecto
INSERT INTO users (username, password, full_name, role) VALUES 
('admin', 'admin123', 'Administrador', 'admin'),
('analista', 'analista123', 'Analista Financiero', 'analyst'),
('viewer', 'viewer123', 'Visualizador', 'viewer');
