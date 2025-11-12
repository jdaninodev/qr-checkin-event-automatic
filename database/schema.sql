-- Schema para la aplicación de check-in de eventos
-- Ejecuta este script en el Neon SQL Editor para crear la tabla

-- Tabla principal de asistentes
CREATE TABLE IF NOT EXISTS asistentes (
  id SERIAL PRIMARY KEY,
  tipo_asistente VARCHAR(20) NOT NULL CHECK (tipo_asistente IN ('estudiante', 'acudiente')),
  jornada VARCHAR(20) CHECK (jornada IN ('mañana', 'tarde', 'ambas')),
  
  -- Campos comunes
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  tipo_documento VARCHAR(20) NOT NULL,
  numero_documento VARCHAR(50) NOT NULL,
  correo_electronico VARCHAR(100),
  telefono VARCHAR(20),
  
  -- Campos específicos de estudiante
  grado VARCHAR(20),
  grupo VARCHAR(10),
  nombre_acudiente VARCHAR(200),
  
  -- Campos específicos de acudiente
  profesion VARCHAR(100),
  empresa VARCHAR(100),
  cargo VARCHAR(100),
  
  -- Acepta políticas
  acepta_politicas BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Índices para búsquedas rápidas
  UNIQUE(numero_documento)
);

-- Índice para búsqueda por tipo y jornada
CREATE INDEX idx_asistentes_tipo_jornada ON asistentes(tipo_asistente, jornada);

-- Índice para búsqueda por fecha
CREATE INDEX idx_asistentes_created_at ON asistentes(created_at DESC);

-- Comentarios para documentación
COMMENT ON TABLE asistentes IS 'Tabla de registro de asistentes a la Feria Empresarial 2025';
COMMENT ON COLUMN asistentes.tipo_asistente IS 'Tipo: estudiante o acudiente';
COMMENT ON COLUMN asistentes.jornada IS 'Jornada del evento: mañana, tarde o ambas';
COMMENT ON COLUMN asistentes.numero_documento IS 'Documento único de identificación';
