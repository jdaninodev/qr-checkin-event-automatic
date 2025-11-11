# Proyecto: Sistema de Check-In con QR

## Descripción del Proyecto
Este proyecto tiene como objetivo desarrollar un sistema de registro de asistentes a eventos utilizando códigos QR. Los asistentes recibirán un ticket en formato PDF con un QR único para su entrada, y los organizadores podrán escanear estos códigos para realizar un check-in en tiempo real.

El sistema se construirá utilizando **Next.js** como framework principal, **Framer Motion** para animaciones fluidas y **Lucide React** para los íconos. Además, se realizará el deploy del proyecto en **Vercel**, aprovechando su base de datos para almacenar la información de los asistentes, la cual se importará desde un archivo **CSV**.

## Tecnologías Utilizadas

- **Next.js**: Framework de React que permite crear aplicaciones web rápidas y optimizadas, usando características como renderizado del lado del servidor y generación estática de páginas.
- **Framer Motion**: Biblioteca de animación para React que permite crear transiciones y animaciones fluidas de manera sencilla.
- **Lucide React**: Conjunto de íconos en React que será usado para los íconos interactivos dentro de la interfaz de usuario.
- **Vercel**: Plataforma para el deploy de aplicaciones frontend y backend (con API Routes), que nos permitirá gestionar fácilmente el entorno de producción y escalar la aplicación según sea necesario.
- **Base de datos (Vercel)**: Usaremos la base de datos de Vercel para almacenar la información de los asistentes y los check-ins. Los datos se importarán desde un archivo CSV y se sincronizarán con la base de datos de Vercel.

## Estructura del Proyecto

### 1. **Frontend (Next.js)**
El frontend se desarrollará usando **Next.js**, lo que permitirá la generación de páginas estáticas y dinámicas con rutas basadas en archivos. El sistema tendrá dos partes principales:
- **Formulario de registro de usuarios**: Donde los asistentes podrán registrar su información y generar un QR único.
- **Página de escaneo de QR**: Página que permite a los organizadores escanear el código QR del asistente para registrar el check-in. La cámara del dispositivo se utilizará para escanear el código QR.
  
### 2. **Animaciones con Framer Motion**
Usaremos **Framer Motion** para hacer que las transiciones entre las páginas y las interacciones con los usuarios sean fluidas y agradables. Esto incluirá animaciones como:
- Transiciones suaves al cargar y cambiar de página.
- Animaciones para la generación y confirmación del ticket PDF.

### 3. **Íconos con Lucide React**
**Lucide React** se usará para agregar íconos a las interfaces, como botones de acción, navegación y elementos de entrada de datos (por ejemplo, iconos de cámara, correo, check-in).

### 4. **Base de Datos y Backend**
El backend será implementado usando **API Routes** de Next.js para gestionar las siguientes operaciones:
- **Generación y almacenamiento de datos**: Cuando los asistentes se registren a través del formulario, los datos se almacenarán en la base de datos de Vercel.
- **Escaneo de QR y check-in**: Cuando se escanee un QR, el sistema verificará los datos en la base de datos y actualizará el registro de asistencia.
  
### 5. **Importación de CSV a Base de Datos**
El archivo **CSV** contendrá los datos iniciales de los asistentes (por ejemplo: nombre, correo, ID, jornada). Este archivo será importado a la base de datos de Vercel para inicializar la aplicación. Se podrá actualizar más tarde a través de una interfaz de administración si se requiere agregar más registros.

### 6. **Deploy con Vercel**
El deploy se hará directamente en **Vercel**, que optimiza el uso de Next.js con su infraestructura de CI/CD. Vercel gestionará el dominio, la base de datos y la escalabilidad de la aplicación.

### 7. **Generación de Ticket PDF**
Cuando un asistente complete su registro, se generará un **PDF** con un ticket que incluirá el QR único del asistente. Este PDF será enviado por correo electrónico al usuario y almacenado en la base de datos para futuros accesos.

### 8. **Escaneo de QR y Confirmación de Check-in**
El organizador podrá escanear el código QR de cada asistente usando la cámara de su dispositivo móvil. Al escanear el código, el sistema actualizará el estado de **check-in** para el asistente y enviará una confirmación al correo electrónico del asistente.

## Flujo de Trabajo

1. **Registro de Asistentes**:
   - Los asistentes completan el formulario en la web.
   - El sistema genera un código QR único para cada asistente.
   - Los datos se almacenan en la base de datos y se genera un ticket PDF que se envía por correo.

2. **Check-in en el Evento**:
   - Los organizadores escanean el QR del asistente usando un dispositivo móvil.
   - El sistema valida los datos y registra el check-in en la base de datos.
   - Se envía una confirmación de check-in al correo del asistente.

## Roadmap

1. **Semana 1**:
   - Configuración de Next.js y estructura inicial del proyecto.
   - Creación del formulario de registro.
   - Implementación del backend con las API Routes para recibir los datos y generar el QR.

2. **Semana 2**:
   - Implementación de la página de escaneo de QR y registro de check-ins.
   - Integración con la base de datos de Vercel.
   - Uso de Framer Motion para animaciones de transición.
   - Generación de tickets PDF y envío de correos.

3. **Semana 3**:
   - Pruebas de funcionalidad con datos reales del CSV.
   - Optimización del rendimiento y pruebas de carga.

4. **Semana 4**:
   - Deploy en Vercel.
   - Pruebas finales y ajustes de última hora.

---

## Conclusión

Este proyecto proporcionará una forma eficiente y moderna de gestionar el registro y el check-in de los asistentes a eventos mediante el uso de tecnología avanzada como **Next.js**, **Framer Motion**, **Lucide React** y la plataforma de **Vercel**. Aprovechando la base de datos de Vercel y la importación de datos desde un archivo **CSV**, el sistema será escalable y fácil de mantener.

