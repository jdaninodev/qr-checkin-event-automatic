# qr-checkin-event-automatic

¡Bienvenido! Este repositorio contiene una aplicación Next.js para el check-in de asistentes a eventos mediante un formulario y lectura de QR. El objetivo es facilitar el registro rápido y (opcionalmente) la exportación de asistencia desde una interfaz de administración.

---

## Contenido del README

- Descripción breve
- Requisitos e instalación
- Uso (local y producción)
- Arquitectura y flujo (gráficos)
- Campos del formulario y validaciones
- Desarrollo y notas para contributors

---

## Vista rápida

- Ruta pública: página principal con formulario de registro.
- Panel admin: `/admin` — lista / exportación (si está implementado).

## Instalación

Requisitos: Node.js 16+ y npm/pnpm/yarn.

En PowerShell (o terminal):

```powershell
# Instalar dependencias
npm install

# Configurar variables de entorno (ver sección Backend)
# Copia .env.example a .env.local y completa con tus valores

# Iniciar en modo desarrollo
npm run dev

# Construir para producción
npm run build
# Levantar en producción
npm start
```

Abre http://localhost:3000 en tu navegador.

## Backend y Base de Datos

Este proyecto usa **Neon Postgres** como base de datos y está configurado para funcionar en producción (Vercel).

### Configuración rápida (para deploy en Vercel):

1. **Ejecuta el schema SQL** en Neon Console (ver `database/SETUP.md` para instrucciones detalladas):
   - Accede al SQL Editor desde Vercel Storage o Neon Console
   - Ejecuta el script en `database/schema.sql`

2. **Configura la variable de entorno** en Vercel:
   - Settings → Environment Variables
   - Añade `DATABASE_URL` con tu connection string de Neon

3. **Redespliega** la aplicación

📖 **Guía completa:** consulta `database/SETUP.md` y `database/README.md`

### Dependencias del backend:
- `@neondatabase/serverless` - Driver de Postgres para Vercel/Edge
- `@vercel/analytics` - Analytics de Vercel
- `@vercel/speed-insights` - Speed Insights de Vercel

## Uso

1. Escanea el QR del evento (o abre la URL pública).
2. Completa el formulario con los datos del asistente.
3. Al enviar, verás una confirmación. Si existe un backend, se persistirá; si no, el comportamiento es local/temporal.

## Arquitectura

Diagrama de alto nivel:

![Arquitectura](/images/architecture.svg)

Breve explicación:

- Navegador / Móvil: interfaz donde el usuario escanea o accede a la URL y completa el formulario.
- Next.js App: contiene las páginas principales y los componentes del formulario (ubicados en `src/components`).
- API / Backend (opcional): puede recibir los POST de check-in y almacenar en base de datos o enviar a un servicio externo.

### Flujo de check-in

![Flujo](/images/flow.svg)

1. Escanear QR → 2. Completar formulario → 3. Confirmación → 4. Admin / Export

## Campos del formulario (componentes principales)

- Tipo de asistente (estudiante, acudiente) — `TipoAsistenteSelector.tsx`.
- Jornada — `JornadaSelector.tsx`.
- Campos de Estudiante — `EstudianteForm.tsx`.
- Campos de Acudiente — `AcudienteForm.tsx`.
- Inputs reutilizables — `InputField.tsx`, `SelectField.tsx`.

Validaciones recomendadas:

- Campos obligatorios: nombre, documento, tipo de asistente.
- Validación de formato para documento / teléfono.
- Prevención de envíos duplicados (por ejemplo, mismo documento en corto periodo).

## Desarrollo

Estructura relevante:

- `app/` — rutas y layout de Next.js.
- `src/components/` — componentes del formulario y UI.
- `public/images/` — gráficos e imágenes (ahora contiene `architecture.svg` y `flow.svg`).

Para contribuir:

1. Crea una rama con tu cambio.
2. Haz un PR indicando qué se modifica.

## Cómo añadir persistencia

Si quieres guardar los registros, puedes añadir una API (por ejemplo, Cloud Functions, serverless o un endpoint Next.js API) que reciba los datos del formulario y los almacene en una base de datos (Postgres, MongoDB, Firestore, etc.).

## Notas y recomendaciones

- Las rutas estáticas de imágenes en Next.js se sirven desde `/images/` si están en `public/images`.
- Si quieres exportar CSV desde el admin, implementa un endpoint que devuelva `text/csv` con los registros.

## Contacto

Si necesitas ayuda extra, abre un issue en este repositorio o contacta al mantenedor.

---

_README alternativo generado (archivo `README.es.md`). Si quieres que reemplace `README.md`, puedo intentar renombrarlo o volver a aplicar el parche._
