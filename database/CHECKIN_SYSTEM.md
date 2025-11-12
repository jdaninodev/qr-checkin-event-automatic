# 📋 Sistema de Check-in con QR - Feria Empresarial 2025

## 🎯 Descripción General

Sistema completo de gestión de asistencia con escaneo de códigos QR para la Feria Empresarial 2025. Permite registrar 4 puntos de check-in diferentes:

- ✅ **12 de Noviembre - Mañana (AM)**
- ✅ **12 de Noviembre - Tarde (PM)**
- ✅ **13 de Noviembre - Mañana (AM)**
- ✅ **13 de Noviembre - Tarde (PM)**

---

## 🚀 Configuración Inicial

### Paso 1: Ejecutar migración SQL en Neon

1. **Accede a Neon Console:** https://console.neon.tech
2. **Abre el SQL Editor** (barra lateral izquierda)
3. **Copia y ejecuta** el contenido de `database/migration_add_checkins.sql`

Esto creará:
- 4 columnas de timestamp para check-ins
- Tabla `admin_users` para autenticación
- Usuario administrador por defecto
- Índices para búsquedas rápidas

### Paso 2: Configurar variables de entorno

Agrega a Vercel (Settings → Environment Variables):

```bash
JWT_SECRET=tu-clave-secreta-aleatoria-aqui
```

O genera una con:
```bash
openssl rand -base64 32
```

### Paso 3: Redesplegar

```bash
git add .
git commit -m "feat: agregar sistema de check-in con QR scanner"
git push origin main
```

---

## 👤 Acceso de Administradores

### Credenciales por defecto:

```
Email: admin@feria.com
Contraseña: Feria2025!
```

⚠️ **IMPORTANTE:** Cambia estas credenciales después del primer login.

### URLs:

- **Login:** `https://tu-dominio.vercel.app/admin/login`
- **Scanner:** `https://tu-dominio.vercel.app/admin/scanner`
- **Panel Admin:** `https://tu-dominio.vercel.app/admin`

---

## 📱 Cómo usar el Scanner

### 1. Iniciar sesión

- Ve a `/admin/login`
- Ingresa email y contraseña
- Serás redirigido automáticamente al scanner

### 2. Seleccionar punto de check-in

Elige el momento correspondiente:
- **12 Nov - Mañana (AM)** - Azul
- **12 Nov - Tarde (PM)** - Índigo
- **13 Nov - Mañana (AM)** - Púrpura
- **13 Nov - Tarde (PM)** - Rosa

### 3. Escanear códigos QR

1. Permite acceso a la cámara cuando lo solicite
2. Apunta la cámara hacia el código QR del asistente
3. El sistema:
   - ✅ Valida el código
   - ✅ Verifica si ya registró check-in en este punto
   - ✅ Registra la hora exacta del ingreso
   - ✅ Muestra confirmación visual

### 4. Resultados

**Check-in exitoso:**
- ✅ Mensaje verde con nombre del asistente
- Contador de escaneos incrementa
- Timestamp guardado en base de datos

**Errores comunes:**
- ❌ **QR no válido**: El código no existe en la base de datos
- ⚠️ **Ya registrado**: La persona ya hizo check-in en este punto
- 🔒 **No autenticado**: La sesión expiró, vuelve a iniciar sesión

---

## 🗂️ Estructura de Base de Datos

### Tabla `asistentes` (actualizada)

```sql
asistentes
├── id (SERIAL PRIMARY KEY)
├── ... (campos existentes)
├── checkin_12nov_am (TIMESTAMP) -- Check-in 12 nov mañana
├── checkin_12nov_pm (TIMESTAMP) -- Check-in 12 nov tarde
├── checkin_13nov_am (TIMESTAMP) -- Check-in 13 nov mañana
└── checkin_13nov_pm (TIMESTAMP) -- Check-in 13 nov tarde
```

### Tabla `admin_users` (nueva)

```sql
admin_users
├── id (SERIAL PRIMARY KEY)
├── nombre (VARCHAR) -- Nombre completo
├── email (VARCHAR UNIQUE) -- Email de login
├── password_hash (VARCHAR) -- Contraseña hasheada con bcrypt
├── rol (VARCHAR) -- 'admin' o 'scanner'
├── activo (BOOLEAN) -- Si puede iniciar sesión
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

---

## 📊 Consultas SQL Útiles

### Ver todos los check-ins de un asistente

```sql
SELECT 
  nombres, apellidos, numero_documento,
  checkin_12nov_am,
  checkin_12nov_pm,
  checkin_13nov_am,
  checkin_13nov_pm
FROM asistentes
WHERE qr_code = 'FERIA2025-DOCUMENTO-ID';
```

### Estadísticas por punto de ingreso

```sql
SELECT 
  COUNT(checkin_12nov_am) as "12 Nov AM",
  COUNT(checkin_12nov_pm) as "12 Nov PM",
  COUNT(checkin_13nov_am) as "13 Nov AM",
  COUNT(checkin_13nov_pm) as "13 Nov PM"
FROM asistentes;
```

### Asistentes que fueron a todos los puntos

```sql
SELECT nombres, apellidos, tipo_asistente
FROM asistentes
WHERE checkin_12nov_am IS NOT NULL
  AND checkin_12nov_pm IS NOT NULL
  AND checkin_13nov_am IS NOT NULL
  AND checkin_13nov_pm IS NOT NULL;
```

### Asistentes que no han hecho ningún check-in

```sql
SELECT nombres, apellidos, correo_electronico
FROM asistentes
WHERE checkin_12nov_am IS NULL
  AND checkin_12nov_pm IS NULL
  AND checkin_13nov_am IS NULL
  AND checkin_13nov_pm IS NULL;
```

---

## 🔐 Seguridad

### Autenticación

- ✅ Contraseñas hasheadas con **bcrypt** (10 salt rounds)
- ✅ Sesiones con **JWT** (JSON Web Tokens)
- ✅ Tokens válidos por 8 horas
- ✅ Cookies httpOnly y secure en producción

### Validaciones

- Verificación de QR code único
- Prevención de check-ins duplicados
- Logs detallados de cada operación
- Validación de sesión en cada request

---

## 📱 Compatibilidad

### Navegadores soportados:

- ✅ Chrome/Edge (desktop y móvil)
- ✅ Firefox (desktop y móvil)
- ✅ Safari (iOS 14+)
- ✅ Samsung Internet

### Requisitos:

- Cámara funcional (frontal o trasera)
- Permisos de cámara otorgados
- Conexión a internet estable

---

## 🛠️ Agregar nuevos administradores

### Método 1: Desde SQL Editor

```sql
-- Generar hash de contraseña primero con bcrypt
-- Luego insertar:
INSERT INTO admin_users (nombre, email, password_hash, rol)
VALUES (
  'Nombre del Admin',
  'email@admin.com',
  '$2b$10$HASH_AQUI', -- Hash generado con bcrypt
  'scanner' -- o 'admin'
);
```

### Método 2: Usando el script

```bash
node scripts/generate-admin-hash.js
# Copia el SQL generado y ejecútalo en Neon Console
```

---

## 📈 Monitoreo y Logs

### Ver logs en producción (Vercel):

1. Dashboard de Vercel
2. Tu proyecto → pestaña **Logs**
3. Filtrar por **Runtime Logs**

### Logs del sistema:

- `🔐 [LOGIN]` - Intentos de autenticación
- `📋 [CHECKIN]` - Registros de check-in
- `✅` - Operaciones exitosas
- `❌` - Errores y fallos

---

## 🆘 Troubleshooting

### "No se puede acceder a la cámara"

1. Verifica permisos del navegador
2. Usa HTTPS (requerido para cámara)
3. Prueba con otro navegador
4. Reinicia el dispositivo

### "Código QR no válido"

1. Verifica que el QR fue generado por el sistema
2. Asegúrate de que el registro existe en la BD
3. Comprueba que la cámara enfoca correctamente

### "Ya registró su ingreso en esta sesión"

- Es normal, el asistente ya hizo check-in en este punto
- Puedes verificar en la BD con:
  ```sql
  SELECT * FROM asistentes WHERE qr_code = 'CODIGO_QR';
  ```

### "No autenticado"

- La sesión expiró (8 horas)
- Vuelve a `/admin/login`

---

## 📋 Exportar datos de check-ins

```sql
-- Exportar a CSV desde Neon Console
COPY (
  SELECT 
    nombres, apellidos, numero_documento, tipo_asistente,
    checkin_12nov_am, checkin_12nov_pm, checkin_13nov_am, checkin_13nov_pm
  FROM asistentes
  ORDER BY nombres
) TO STDOUT WITH CSV HEADER;
```

---

## 🎨 Personalización

### Cambiar colores de puntos de check-in

Edita `src/app/admin/scanner/page.tsx`:

```typescript
const CHECKPOINTS = [
  { value: 'checkin_12nov_am', label: '12 Nov - Mañana', color: 'bg-blue-500' },
  // Cambia los colores aquí
];
```

### Modificar tiempo de sesión

Edita `src/lib/auth.ts`:

```typescript
.setExpirationTime('8h') // Cambia '8h' a lo que necesites
```

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs en Vercel
2. Verifica la conexión a Neon
3. Comprueba las variables de entorno
4. Consulta la documentación en `database/`

---

## ✨ Características Futuras (Opcional)

- [ ] Dashboard con gráficos en tiempo real
- [ ] Exportación automática a Excel
- [ ] Notificaciones push cuando alguien hace check-in
- [ ] Modo offline con sincronización posterior
- [ ] Reporte PDF de asistencia por sesión
- [ ] Búsqueda de asistentes por nombre/documento
