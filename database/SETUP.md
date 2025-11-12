# 🚀 Pasos finales para activar el backend en producción

## ⚡ Paso 1: Ejecutar el schema en Neon SQL Editor

1. **Accede a Neon Console:**
   - Desde Vercel: ve a tu proyecto → pestaña **Storage** → clic en tu base de datos → **Open in Neon Console**
   - O directamente: https://console.neon.tech

2. **Abre el SQL Editor** (pestaña lateral izquierda)

3. **Copia y ejecuta este SQL:**

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
  
  -- Código QR único
  qr_code VARCHAR(100) UNIQUE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Índices para búsquedas rápidas
  UNIQUE(numero_documento)
);

CREATE INDEX idx_asistentes_tipo_jornada ON asistentes(tipo_asistente, jornada);
CREATE INDEX idx_asistentes_created_at ON asistentes(created_at DESC);
CREATE INDEX idx_asistentes_qr_code ON asistentes(qr_code);
```

**NOTA:** Si ya creaste la tabla antes, ejecuta esta migración para añadir la columna QR:
```sql
ALTER TABLE asistentes ADD COLUMN IF NOT EXISTS qr_code VARCHAR(100) UNIQUE;
CREATE INDEX IF NOT EXISTS idx_asistentes_qr_code ON asistentes(qr_code);
```

4. **Verifica** que se creó correctamente:
```sql
SELECT * FROM asistentes LIMIT 1;
```

---

## ⚙️ Paso 2: Configurar variables de entorno en Vercel

1. **Accede a tu proyecto en Vercel:**
   - Dashboard → tu proyecto → **Settings** → **Environment Variables**

2. **Añade las siguientes variables:**

### Variable 1: DATABASE_URL
   - **Key:** `DATABASE_URL`
   - **Value:** (tu connection string de Neon, la que empieza con `postgresql://...pooler...`)
   ```
   postgresql://neondb_owner:npg_OlGmnVQ4Z1zo@ep-cool-bonus-ad59t666-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
   - **Environments:** Marca `Production`, `Preview` y `Development` (según necesites)

### Variable 2: RESEND_API_KEY
   - **Key:** `RESEND_API_KEY`
   - **Value:** Tu API key de Resend (obtén una en https://resend.com/api-keys)
   - **Environments:** Marca `Production`, `Preview`
   - **Guía completa:** Consulta `database/RESEND_SETUP.md`

### Variable 3: RESEND_FROM_EMAIL
   - **Key:** `RESEND_FROM_EMAIL`
   - **Value (testing):** `Feria Empresarial <onboarding@resend.dev>`
   - **Value (producción):** `Feria Empresarial <noreply@tudominio.com>`
   - **Environments:** Marca `Production`, `Preview`

3. **Guarda** y espera la confirmación

📖 **Guía detallada de Resend:** Ver `database/RESEND_SETUP.md`

---

## 🚢 Paso 3: Redesplegar en Vercel

1. **Opción A - Desde el dashboard de Vercel:**
   - Ve a la pestaña **Deployments**
   - Clic en el botón **Redeploy** del último deployment
   - Confirma

2. **Opción B - Desde Git (recomendado):**
   - Haz commit de todos los cambios locales:
   ```powershell
   git add .
   git commit -m "feat: añadir generación de QR y envío de emails con Resend"
   git push origin main
   ```
   - Vercel desplegará automáticamente

**IMPORTANTE:** Asegúrate de haber configurado las 3 variables de entorno antes de desplegar.

---

## ✅ Paso 4: Verificar que funciona

1. **Espera** a que termine el deployment (1-3 minutos)

2. **Abre tu app** en producción (URL de Vercel, ej: `https://tu-proyecto.vercel.app`)

3. **Prueba el formulario:**
   - Completa todos los campos
   - **Usa tu propio email** (para recibir el ticket)
   - Acepta las políticas
   - Clic en **Registrar Asistencia**
   - Deberías ver mensaje: "¡Registro exitoso! Revisa tu correo para ver tu ticket con código QR."

4. **Verifica tu email:**
   - Revisa tu bandeja de entrada (y spam)
   - Deberías recibir un email con:
     - ✅ Tus datos de registro
     - ✅ Código QR grande y visible
     - ✅ Instrucciones de uso

5. **Verifica en Neon SQL Editor:**
```sql
SELECT 
  id, nombres, apellidos, numero_documento, tipo_asistente, qr_code, created_at
FROM asistentes 
ORDER BY created_at DESC 
LIMIT 5;
```

6. **Si ves el registro Y recibiste el email**, ¡todo funcionó! 🎉

---

## 🔍 Troubleshooting

### Error: "DATABASE_URL no está configurado"
- Verifica que añadiste la variable en Vercel Settings
- Asegúrate de redesplegar después de añadir la variable

### Error: "relation 'asistentes' does not exist"
- Ejecuta el schema SQL en Neon Console (Paso 1)
- Verifica que estás conectado a la base de datos correcta

### Error: "duplicate key value violates unique constraint"
- Ya existe un registro con ese número de documento
- Usa otro documento o elimina el registro duplicado en Neon

### Los datos no se guardan
- Revisa los logs en Vercel: Dashboard → tu proyecto → **Logs** (pestaña Runtime Logs)
- Verifica que DATABASE_URL tiene el valor correcto

### No recibo el email con el QR
- Verifica que configuraste `RESEND_API_KEY` en Vercel
- Revisa tu carpeta de SPAM
- Verifica los logs de Resend: https://resend.com/logs
- Asegúrate de que `RESEND_FROM_EMAIL` está configurado correctamente
- Para testing rápido, usa: `onboarding@resend.dev`

### El email se envía pero sin QR o con formato roto
- Verifica que la columna `qr_code` existe en la tabla (ejecuta la migración)
- Revisa los Runtime Logs en Vercel para errores de generación de QR
- Prueba abrir el email en otro cliente (Gmail web, Outlook web)

### Error: "Resend API key not found"
- Añade `RESEND_API_KEY` en Vercel Environment Variables
- Redespliega la aplicación
- Consulta `database/RESEND_SETUP.md` para obtener tu API key

---

## 📊 Próximos pasos opcionales

- [ ] Crear página de admin (`/admin`) para ver lista de asistentes
- [ ] Implementar exportación CSV
- [ ] Añadir verificación de QR en el evento (app de escaneo)
- [ ] Personalizar la plantilla del email
- [ ] Configurar dominio propio en Resend para emails profesionales

---

## 🆘 Ayuda adicional

Si encuentras problemas:
1. Revisa los logs en Vercel (Runtime Logs)
2. Verifica la conexión en Neon Console
3. Revisa los logs de Resend: https://resend.com/logs
4. Consulta las guías:
   - Backend: `database/README.md`
   - Emails: `database/RESEND_SETUP.md`
