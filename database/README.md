# Configuración del Backend con Neon (Postgres)

Este documento explica cómo configurar y usar el backend de la aplicación con Neon Database.

## Pasos de configuración

### 1. Crear la tabla en Neon SQL Editor

Ve a tu proyecto en Neon Console (desde el Storage tab de Vercel o directamente en Neon) y ejecuta el script SQL ubicado en `database/schema.sql`.

Alternativamente, copia y pega este comando en el SQL Editor:

```sql
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

CREATE INDEX idx_asistentes_tipo_jornada ON asistentes(tipo_asistente, jornada);
CREATE INDEX idx_asistentes_created_at ON asistentes(created_at DESC);
```

### 2. Configurar variables de entorno en Vercel

En el dashboard de Vercel:

1. Ve a tu proyecto → Settings → Environment Variables
2. Añade la variable `DATABASE_URL` con el valor de tu connection string de Neon (pooled):
   ```
   postgresql://neondb_owner:npg_OlGmnVQ4Z1zo@ep-cool-bonus-ad59t666-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
3. Marca la variable como disponible para: Production, Preview y Development (según necesites)
4. Guarda y redeploya la aplicación

### 3. Usar las Server Actions

Las server actions están disponibles en `src/app/actions.ts`:

#### `registrarAsistente(data: AsistenteData)`
Inserta un nuevo asistente en la base de datos.

**Ejemplo de uso en un componente:**

```tsx
'use client';

import { registrarAsistente } from '@/app/actions';
import { useState } from 'react';

export default function FormularioRegistro() {
  const [mensaje, setMensaje] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      tipoAsistente: formData.get('tipoAsistente') as 'estudiante' | 'acudiente',
      nombres: formData.get('nombres') as string,
      apellidos: formData.get('apellidos') as string,
      tipoDocumento: formData.get('tipoDocumento') as string,
      numeroDocumento: formData.get('numeroDocumento') as string,
      aceptaPoliticas: formData.get('aceptaPoliticas') === 'on',
      // ... más campos
    };

    const resultado = await registrarAsistente(data);
    
    if (resultado.success) {
      setMensaje('¡Registro exitoso!');
      // Redirigir o mostrar confirmación
    } else {
      setMensaje(resultado.message || 'Error al registrar');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos del formulario */}
      {mensaje && <p>{mensaje}</p>}
    </form>
  );
}
```

#### `obtenerAsistentes()`
Obtiene todos los asistentes registrados (para el panel de administración).

#### `obtenerEstadisticas()`
Obtiene estadísticas de asistencia (total, por tipo, por jornada).

### 4. Verificar en producción

Una vez desplegado en Vercel con las variables de entorno configuradas:

1. Prueba registrar un asistente desde el formulario
2. Verifica en el Neon SQL Editor que los datos se insertaron:
   ```sql
   SELECT * FROM asistentes ORDER BY created_at DESC LIMIT 10;
   ```

## Notas importantes

- **Desarrollo local**: El archivo `.env.local` contiene las credenciales (NO commitear a git)
- **Producción**: Las variables de entorno se configuran en el dashboard de Vercel
- **Seguridad**: Las server actions validan datos y previenen duplicados por número de documento
- **Errores**: Los errores se logean en la consola del servidor (ver logs en Vercel)

## Próximos pasos

- [ ] Integrar las server actions en los componentes de formulario existentes
- [ ] Crear página de admin (`/admin`) para ver registros y estadísticas
- [ ] Añadir exportación CSV de asistentes
- [ ] Implementar generación de códigos QR únicos por asistente
