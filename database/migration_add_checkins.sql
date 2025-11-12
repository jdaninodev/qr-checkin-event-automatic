-- Migración para añadir columnas de check-in por cada sesión
-- Ejecuta este SQL en Neon Console

-- Añadir columnas para los 4 puntos de check-in
ALTER TABLE asistentes 
ADD COLUMN IF NOT EXISTS checkin_12nov_am TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS checkin_12nov_pm TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS checkin_13nov_am TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS checkin_13nov_pm TIMESTAMP WITH TIME ZONE;

-- Crear índices para búsquedas rápidas por fecha de check-in
CREATE INDEX IF NOT EXISTS idx_asistentes_checkin_12nov_am ON asistentes(checkin_12nov_am);
CREATE INDEX IF NOT EXISTS idx_asistentes_checkin_12nov_pm ON asistentes(checkin_12nov_pm);
CREATE INDEX IF NOT EXISTS idx_asistentes_checkin_13nov_am ON asistentes(checkin_13nov_am);
CREATE INDEX IF NOT EXISTS idx_asistentes_checkin_13nov_pm ON asistentes(checkin_13nov_pm);

-- Crear tabla de administradores para el sistema de check-in
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(50) DEFAULT 'scanner', -- 'scanner' o 'admin'
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear índice para búsqueda rápida por email
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Insertar un usuario administrador por defecto
-- Email: admin@feria.com
-- Password: "Feria2025!" (debes cambiar esto después del primer login)
INSERT INTO admin_users (nombre, email, password_hash, rol)
VALUES (
  'Administrador Principal',
  'admin@feria.com',
  '$2b$10$5SwnB79S3mpSVEQd71QevOLuC/EQzxDoGa.iz2Bc2qqZ3is5tPaBa',
  'admin'
)
ON CONFLICT (email) DO UPDATE 
SET password_hash = EXCLUDED.password_hash;

-- Verificar que se crearon correctamente
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'asistentes' AND column_name LIKE 'checkin%'
ORDER BY column_name;

SELECT * FROM admin_users;
