# 📥 Guía de Importación de CSV a Base de Datos

Este documento explica cómo importar asistentes desde un archivo CSV a la base de datos de Neon.

## 📋 Requisitos Previos

1. ✅ Base de datos Neon configurada
2. ✅ Columna `qr_code` añadida a la tabla (ejecuta la migración primero)
3. ✅ Archivo CSV con los datos de asistentes
4. ✅ Variables de entorno configuradas (`.env.local`)

## 🗂️ Formato del CSV

Tu archivo CSV debe tener las siguientes columnas (los nombres pueden variar, el script se adaptará):

### Columnas Obligatorias:
- `Nombres` o `nombres`
- `Apellidos` o `apellidos`  
- `Número de documento` o `numero_documento`
- `Tipo de asistente` (valores: "estudiante" o "acudiente")

### Columnas Opcionales Comunes:
- `Tipo de documento` o `tipo_documento` (CC, TI, CE, etc.)
- `Correo electrónico` o `correo`
- `Teléfono` o `telefono`
- `Jornada` (mañana, tarde, ambas)

### Columnas para Estudiantes:
- `Grado` o `grado`
- `Grupo` o `grupo`
- `Nombre del acudiente` o `nombre_acudiente`

### Columnas para Acudientes:
- `Profesión` o `profesion`
- `Empresa` o `empresa`
- `Cargo` o `cargo`

## 📝 Ejemplo de CSV

```csv
Tipo de asistente,Nombres,Apellidos,Número de documento,Tipo de documento,Correo electrónico,Teléfono,Jornada,Grado,Grupo
estudiante,Juan,Pérez,1234567890,TI,juan@email.com,3001234567,mañana,10,A
acudiente,María,González,9876543210,CC,maria@email.com,3009876543,tarde,,,
```

## 🚀 Pasos para Importar

### 1. Preparar el archivo CSV

Coloca tu archivo CSV en la raíz del proyecto o recuerda la ruta completa.

### 2. Ajustar el mapeo de columnas (si es necesario)

Si los nombres de las columnas de tu CSV son diferentes, edita el archivo `scripts/import-csv.ts`:

```typescript
// Líneas 54-64 aproximadamente
const nombres = row['Nombres'] || row['nombres'] || '';
const apellidos = row['Apellidos'] || row['apellidos'] || '';
// ... etc
```

Cambia `'Nombres'` por el nombre exacto de la columna en tu CSV.

### 3. Ejecutar la importación

#### Opción A: Usando el nombre por defecto
Si tu archivo se llama `Formulario de asistencia - Feria Empresarial.csv`:

```powershell
npm run import-csv
```

#### Opción B: Especificando la ruta del archivo

```powershell
npm run import-csv "ruta/al/archivo.csv"
```

Ejemplos:
```powershell
npm run import-csv "datos-asistentes.csv"
npm run import-csv "C:\Users\usuario\Downloads\asistentes.csv"
```

### 4. Revisar el proceso

El script mostrará en tiempo real:
- ✅ Registros importados exitosamente
- ⏭️ Registros duplicados (que ya existen en la BD)
- ❌ Registros con errores
- 📊 Resumen final con estadísticas

### 5. Verificar en la base de datos

Después de la importación, verifica que los datos se guardaron correctamente:

**Opción A - Neon Console:**
```sql
SELECT COUNT(*) as total FROM asistentes;

SELECT nombres, apellidos, numero_documento, qr_code 
FROM asistentes 
ORDER BY created_at DESC 
LIMIT 10;
```

**Opción B - Panel de Admin:**
- Ve a `https://tu-proyecto.vercel.app/admin`
- Ingresa con la contraseña
- Deberías ver todos los registros importados

## 🔍 Solución de Problemas

### Error: "Cannot find module 'csv-parse'"
```powershell
npm install csv-parse
```

### Error: "DATABASE_URL no está configurado"
Asegúrate de que `.env.local` existe y tiene:
```
DATABASE_URL=postgresql://...
```

### Error: "column 'qr_code' does not exist"
Ejecuta primero la migración en Neon SQL Editor:
```sql
ALTER TABLE asistentes ADD COLUMN IF NOT EXISTS qr_code VARCHAR(100) UNIQUE;
CREATE INDEX IF NOT EXISTS idx_asistentes_qr_code ON asistentes(qr_code);
```

### Duplicados encontrados
El script detecta automáticamente registros duplicados por `numero_documento` y los salta. Esto es normal si ya importaste el archivo antes.

### Errores en filas específicas
Revisa que:
- Los campos obligatorios (nombres, apellidos, documento) estén completos
- El tipo de asistente sea exactamente "estudiante" o "acudiente"
- No haya caracteres especiales que rompan el CSV

## 📊 Después de Importar

1. **Verifica las estadísticas** en el panel de admin
2. **Los códigos QR se generan automáticamente** para cada registro
3. **NO es necesario enviar emails** - el script solo importa datos
4. Si quieres enviar emails con QR a los asistentes importados, deberás crear un script adicional

## 🔄 Re-importar o Actualizar

Si necesitas volver a importar:
1. El script **omite automáticamente** los registros duplicados (mismo número de documento)
2. Si quieres actualizar registros existentes, primero elimínalos en Neon:
   ```sql
   DELETE FROM asistentes WHERE numero_documento IN ('1234567890', '9876543210');
   ```

## 💡 Tips

- **Haz una copia de seguridad** antes de importar grandes cantidades de datos
- **Prueba primero** con un CSV pequeño (5-10 registros)
- **Revisa el formato** del CSV en Excel o Google Sheets antes de importar
- El script muestra **progreso en tiempo real**, no lo interrumpas

## 📧 Soporte

Si encuentras problemas:
1. Revisa los logs que muestra el script
2. Verifica el formato del CSV
3. Comprueba que las columnas coincidan con las del script
4. Revisa que la base de datos tenga todas las columnas necesarias

---

**¿Listo para importar?** 🚀

```powershell
npm run import-csv "tu-archivo.csv"
```
