# 📧 Configuración de Resend para envío de emails

Esta guía te ayudará a configurar **Resend** para enviar emails automáticos con los tickets y códigos QR.

---

## 🚀 Paso 1: Crear cuenta en Resend

1. **Ve a [https://resend.com](https://resend.com)**
2. **Crea una cuenta gratuita** (100 emails/día gratis)
3. **Verifica tu email** (recibirás un correo de confirmación)

---

## 🔑 Paso 2: Obtener la API Key

1. **Inicia sesión** en Resend
2. Ve a **API Keys** en el menú lateral
3. Clic en **Create API Key**
4. Dale un nombre (ej: "Feria Empresarial Production")
5. Selecciona permisos: **Sending access** (Full access)
6. Clic en **Create**
7. **Copia la API key** (empieza con `re_...`) — solo la verás una vez

---

## 📨 Paso 3: Configurar el dominio (opcional pero recomendado)

### Opción A: Usar el dominio de prueba (más rápido)
- **Email del remitente:** `onboarding@resend.dev`
- Solo para pruebas, emails enviados a tu propio correo
- **Listo para usar inmediatamente**

### Opción B: Usar tu propio dominio (producción)
1. Ve a **Domains** en Resend
2. Clic en **Add Domain**
3. Ingresa tu dominio (ej: `tudominio.com`)
4. Añade los registros DNS que te muestra Resend:
   - **SPF** (TXT)
   - **DKIM** (TXT o CNAME)
   - **DMARC** (TXT)
5. Espera la verificación (puede tardar unos minutos)
6. Una vez verificado, podrás enviar desde `noreply@tudominio.com`

---

## ⚙️ Paso 4: Configurar variables de entorno

### En Vercel (Producción):

1. **Ve a tu proyecto en Vercel**
2. **Settings** → **Environment Variables**
3. Añade estas dos variables:

#### Variable 1: RESEND_API_KEY
- **Key:** `RESEND_API_KEY`
- **Value:** (tu API key que copiaste, ej: `re_abc123xyz...`)
- **Environments:** Production, Preview

#### Variable 2: RESEND_FROM_EMAIL
- **Key:** `RESEND_FROM_EMAIL`
- **Value (opción A - testing):** `Feria Empresarial <onboarding@resend.dev>`
- **Value (opción B - producción):** `Feria Empresarial <noreply@tudominio.com>`
- **Environments:** Production, Preview

4. **Guarda** y espera la confirmación

---

## 🧪 Paso 5: Probar el envío de emails

### Prueba local (opcional):
1. Copia `.env.example` a `.env.local`
2. Añade tus valores:
   ```env
   RESEND_API_KEY=re_tu_api_key_aqui
   RESEND_FROM_EMAIL=Feria Empresarial <onboarding@resend.dev>
   ```
3. Ejecuta: `npm run dev`
4. Completa el formulario con **tu propio email**
5. Verifica que recibes el email con el QR

### Prueba en producción:
1. Después de desplegar, abre tu URL de Vercel
2. Completa el formulario con **tu email**
3. Verifica que recibes el ticket con QR en tu bandeja

---

## ✅ Verificación

Después de registrarte, deberías recibir un email con:
- ✅ Header con colores de la institución
- ✅ Datos del registro (nombre, documento, tipo, jornada)
- ✅ Código QR grande y visible
- ✅ Instrucciones para usar el QR
- ✅ Detalles del evento

---

## 🔍 Troubleshooting

### No recibo el email
- Verifica que la API key es correcta en Vercel
- Revisa la carpeta de SPAM
- Verifica los logs en Vercel (Runtime Logs)
- Si usas dominio propio, verifica que esté verificado en Resend

### Error: "Resend API key not found"
- Añade `RESEND_API_KEY` en Vercel Environment Variables
- Redespliega la aplicación

### Email enviado desde dominio incorrecto
- Verifica `RESEND_FROM_EMAIL` en Vercel
- Si usas dominio propio, asegúrate de que esté verificado

### El QR no se muestra en el email
- El QR se genera como imagen base64 embebida
- Algunos clientes de email (Outlook antiguo) pueden bloquearlo
- Prueba abriendo el email en Gmail o web

---

## 📊 Monitoreo

### Ver emails enviados:
1. Ve a **Logs** en el dashboard de Resend
2. Verás todos los emails enviados con estado:
   - ✅ **Delivered** - Email entregado exitosamente
   - ⏳ **Queued** - En cola de envío
   - ❌ **Failed** - Error al enviar

### Límites del plan gratuito:
- **100 emails/día**
- **1,000 emails/mes**
- Para más, considera actualizar a un plan pago

---

## 💡 Consejos

1. **Testing:** Usa `onboarding@resend.dev` para pruebas rápidas
2. **Producción:** Configura tu propio dominio para mayor profesionalidad
3. **Monitoreo:** Revisa los logs de Resend diariamente durante el evento
4. **Backup:** Ten un plan B si alcanzas el límite de emails (ej: upgrade a plan pago)

---

## 🆘 Soporte

- **Documentación oficial:** https://resend.com/docs
- **Soporte de Resend:** support@resend.com
- **Status page:** https://status.resend.com
