# 📦 Componentes del Formulario

Esta carpeta contiene todos los componentes reutilizables del formulario de registro para la Feria Empresarial 2025.

## 🎨 Esquema de Colores

Basado en el banner del evento:
- **Naranja**: `#f97316` (orange-500) - Color primario
- **Azul**: `#2563eb` (blue-600) - Color secundario
- **Gradientes**: Combinaciones de naranja y azul para efectos visuales

## 📁 Estructura de Componentes

### `Header.tsx`
**Descripción**: Encabezado principal con banner del evento y título.

**Características**:
- Banner responsive con imagen del evento
- Título con gradiente animado
- Animaciones de entrada suaves con Framer Motion

---

### `SectionHeader.tsx`
**Descripción**: Encabezado para cada sección del formulario.

**Props**:
- `icon?: React.ReactNode` - Ícono opcional
- `title: string` - Título de la sección
- `delay?: number` - Retraso de animación

**Características**:
- Animación de rotación en el ícono
- Texto con gradiente

---

### `JornadaSelector.tsx`
**Descripción**: Selector de jornadas con checkboxes múltiples.

**Props**:
- `jornadas: string[]` - Lista de jornadas disponibles
- `selectedJornadas: string[]` - Jornadas seleccionadas
- `onChange: (jornada: string) => void` - Handler de cambio

**Características**:
- Animación individual para cada opción
- Efecto hover y tap
- Estilo personalizado según selección

---

### `InputField.tsx`
**Descripción**: Campo de entrada de texto genérico.

**Props**:
- `label: string` - Etiqueta del campo
- `icon?: LucideIcon` - Ícono opcional
- `type?: string` - Tipo de input (default: 'text')
- `required?: boolean` - Si es requerido
- `value: string` - Valor actual
- `onChange: (value: string) => void` - Handler de cambio
- `placeholder?: string` - Texto placeholder
- `delay?: number` - Retraso de animación

**Características**:
- Animación de entrada
- Efecto hover y focus
- Indicador visual de campo requerido

---

### `SelectField.tsx`
**Descripción**: Campo de selección (dropdown) genérico.

**Props**:
- `label: string` - Etiqueta del campo
- `icon?: LucideIcon` - Ícono opcional
- `required?: boolean` - Si es requerido
- `value: string` - Valor actual
- `onChange: (value: string) => void` - Handler de cambio
- `options: string[]` - Opciones disponibles
- `placeholder?: string` - Texto placeholder
- `delay?: number` - Retraso de animación

**Características**:
- Animación de entrada
- Efecto hover y focus
- Indicador visual de campo requerido

---

### `TipoAsistenteSelector.tsx`
**Descripción**: Selector visual de tipo de asistente con radio buttons personalizados.

**Props**:
- `tipos: string[]` - Tipos de asistente disponibles
- `selected: string` - Tipo seleccionado
- `onChange: (tipo: string) => void` - Handler de cambio

**Características**:
- Animaciones spring para cada opción
- Radio buttons personalizados con animación
- Gradientes únicos por tipo de asistente
- Efectos hover interactivos
- Animación de fondo en hover

**Colores por tipo**:
- Estudiante: purple-500 → pink-500
- Acudiente: green-500 → teal-500
- Docente: blue-500 → indigo-500
- Directivos: orange-500 → red-500
- Administrativos: yellow-500 → orange-500
- Invitado: gray-500 → slate-500

---

### `EstudianteForm.tsx`
**Descripción**: Formulario específico para estudiantes.

**Props**:
- `gradoEstudio: string` - Grado del estudiante
- `onGradoChange: (value: string) => void` - Handler de cambio

**Características**:
- Aparición/desaparición animada
- Ícono con rotación animada
- Borde temático morado

---

### `AcudienteForm.tsx`
**Descripción**: Formulario específico para acudientes/padres de familia.

**Props**:
- `parentesco: string` - Parentesco con el estudiante
- `nombreEstudiante: string` - Nombre del estudiante
- `gradoEstudiante: string` - Grado del estudiante
- `sedeEstudiante: string` - Sede del estudiante
- `onParentescoChange: (value: string) => void`
- `onNombreChange: (value: string) => void`
- `onGradoChange: (value: string) => void`
- `onSedeChange: (value: string) => void`
- `sedes: string[]` - Lista de sedes disponibles

**Características**:
- Aparición/desaparición animada
- Ícono con escala pulsante
- Borde temático verde
- Múltiples campos organizados

---

### `PoliticasPrivacidad.tsx`
**Descripción**: Sección de políticas de privacidad con checkbox de aceptación.

**Props**:
- `aceptado: boolean` - Estado de aceptación
- `onChange: (value: boolean) => void` - Handler de cambio

**Características**:
- Caja de información con gradiente
- Checkbox con ícono de confirmación animado
- Efecto hover en el label
- Múltiples animaciones secuenciales

---

### `SubmitButton.tsx`
**Descripción**: Botón de envío con efectos especiales.

**Características**:
- Gradiente animado naranja-azul
- Efecto de brillo deslizante continuo
- Partículas decorativas (Sparkles) animadas
- Ícono rotatorio
- Efecto hover con sombra
- Efecto de escala al hacer clic
- Texto informativo debajo

**Animaciones**:
- Brillo deslizante: loop infinito
- Ícono: rotación continua
- Partículas: flotación vertical
- Hover: escala y sombra
- Tap: reducción de escala

---

## 🎭 Animaciones Globales

### Página Principal (`page.tsx`)
- Elementos decorativos de fondo animados (círculos con blur)
- Backdrop blur en el contenedor del formulario
- Animaciones secuenciales con delays
- Transiciones suaves entre secciones

### Efectos Comunes
- **Entrada**: `opacity: 0 → 1`, `y: 20 → 0` o `x: -20 → 0`
- **Hover**: `scale: 1.02`, cambio de sombra
- **Tap**: `scale: 0.98`
- **Transiciones**: Spring physics para movimientos naturales

## 🎨 Estilos

### Colores Principales
- Naranja: Acción primaria, selección, énfasis
- Azul: Secundario, información, íconos
- Verde: Acudientes
- Morado: Estudiantes
- Gris: Texto, bordes, fondos

### Bordes y Sombras
- Bordes: `2px` para elementos seleccionables
- Sombras: `shadow-2xl` para contenedores principales
- Radius: `rounded-xl` (12px) o `rounded-2xl` (16px)

## 📱 Responsividad

Todos los componentes son completamente responsive:
- Grid adaptativo: `grid-cols-1 md:grid-cols-2`
- Padding responsive: `p-6 md:p-10`
- Texto responsive: `text-4xl md:text-5xl lg:text-6xl`

## 🚀 Uso

```tsx
import {
  Header,
  InputField,
  SelectField,
  // ... otros componentes
} from '@/components';

// Usar en tu formulario
<InputField
  label="Nombres"
  icon={User}
  required
  value={nombres}
  onChange={setNombres}
  placeholder="Tu nombre"
  delay={0.3}
/>
```

## ✨ Mejores Prácticas

1. **Delays escalonados**: Usa delays incrementales (0.1, 0.2, 0.3) para animaciones secuenciales
2. **Spring physics**: Usa `type: "spring"` para movimientos naturales
3. **Colores consistentes**: Mantén la paleta naranja-azul en todo el formulario
4. **Iconos temáticos**: Cada sección tiene su propio color de acento
