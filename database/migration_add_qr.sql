-- Migración para añadir código QR a la tabla de asistentes
-- Ejecuta este SQL en Neon Console DESPUÉS de crear la tabla inicial

-- Añadir columna para el código QR único
ALTER TABLE asistentes 
ADD COLUMN IF NOT EXISTS qr_code VARCHAR(100) UNIQUE;

-- Crear índice para búsquedas rápidas por QR
CREATE INDEX IF NOT EXISTS idx_asistentes_qr_code ON asistentes(qr_code);

-- Comentario para documentación
COMMENT ON COLUMN asistentes.qr_code IS 'Código QR único generado para el asistente';
