'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, IdCard, Mail, Phone, Building2 } from 'lucide-react';
import Image from 'next/image';

// Server Actions
import { registrarAsistente, type AsistenteData } from '@/app/actions';

// Components
import Navbar from '@/components/Navbar';
import Header from '@/components/Header';
import SectionHeader from '@/components/SectionHeader';
import JornadaSelector from '@/components/JornadaSelector';
import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import TipoAsistenteSelector from '@/components/TipoAsistenteSelector';
import EstudianteForm from '@/components/EstudianteForm';
import AcudienteForm from '@/components/AcudienteForm';
import PoliticasPrivacidad from '@/components/PoliticasPrivacidad';
import SubmitButton from '@/components/SubmitButton';

type TipoAsistente = '' | 'Estudiante' | 'Acudiente / Padre de familia' | 'Docente' | 'Directivos' | 'Administrativos' | 'Invitado';

interface FormData {
  // Información Personal
  jornada: string[];
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroIdentidad: string;
  correo: string;
  telefono: string;
  tipoAsistente: TipoAsistente;
  sedeEducativa: string;
  
  // Estudiante
  gradoEstudio: string;
  
  // Acudiente
  parentesco: string;
  nombreEstudiante: string;
  gradoEstudiante: string;
  sedeEstudiante: string;
  
  // Políticas
  aceptaPoliticas: boolean;
}

const jornadas = [
  'Mañana - Miércoles 12 de Noviembre',
  'Tarde - Miércoles 12 de Noviembre',
  'Mañana - Jueves 13 de Noviembre',
  'Tarde - Jueves 13 de Noviembre',
];

const tiposDocumento = [
  'Tarjeta de Identidad',
  'Cédula de ciudadanía',
  'Cédula de extranjería',
];

const tiposAsistente: TipoAsistente[] = [
  'Estudiante',
  'Acudiente / Padre de familia',
  'Docente',
  'Directivos',
  'Administrativos',
  'Invitado',
];

const sedes = [
  'Principal',
  'Julio Arboleda',
  'Emeterio Piedrahita',
  'Sagrado Corazón',
];

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    jornada: [],
    nombres: '',
    apellidos: '',
    tipoDocumento: '',
    numeroIdentidad: '',
    correo: '',
    telefono: '',
    tipoAsistente: '',
    sedeEducativa: '',
    gradoEstudio: '',
    parentesco: '',
    nombreEstudiante: '',
    gradoEstudiante: '',
    sedeEstudiante: '',
    aceptaPoliticas: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleJornadaChange = (jornada: string) => {
    setFormData(prev => ({
      ...prev,
      jornada: prev.jornada.includes(jornada)
        ? prev.jornada.filter(j => j !== jornada)
        : [...prev.jornada, jornada]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Validar campos obligatorios
      if (!formData.aceptaPoliticas) {
        setSubmitMessage({
          type: 'error',
          text: 'Debes aceptar las políticas de privacidad para continuar'
        });
        setIsSubmitting(false);
        return;
      }

      // Mapear el tipo de asistente al formato de la BD
      let tipoAsistente: 'estudiante' | 'acudiente' = 'estudiante';
      if (formData.tipoAsistente === 'Acudiente / Padre de familia') {
        tipoAsistente = 'acudiente';
      }

      // Preparar datos para enviar
      const dataToSend: AsistenteData = {
        tipoAsistente,
        jornada: formData.jornada.length > 0 
          ? (formData.jornada.includes('Mañana') ? 'mañana' : 'tarde')
          : undefined,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        tipoDocumento: formData.tipoDocumento,
        numeroDocumento: formData.numeroIdentidad,
        correoElectronico: formData.correo,
        telefono: formData.telefono,
        aceptaPoliticas: formData.aceptaPoliticas,
      };

      // Añadir campos específicos de estudiante
      if (tipoAsistente === 'estudiante') {
        dataToSend.grado = formData.gradoEstudio;
        dataToSend.grupo = formData.sedeEducativa;
      }

      // Añadir campos específicos de acudiente
      if (tipoAsistente === 'acudiente') {
        dataToSend.nombreAcudiente = formData.nombreEstudiante;
        dataToSend.profesion = formData.parentesco; // Usando parentesco como profesión temporalmente
      }

      // Llamar a la server action
      const resultado = await registrarAsistente(dataToSend);

      if (resultado.success) {
        setSubmitMessage({
          type: 'success',
          text: '¡Registro exitoso! Tu asistencia ha sido confirmada.'
        });
        
        // Limpiar formulario después de 2 segundos
        setTimeout(() => {
          setFormData({
            jornada: [],
            nombres: '',
            apellidos: '',
            tipoDocumento: '',
            numeroIdentidad: '',
            correo: '',
            telefono: '',
            tipoAsistente: '',
            sedeEducativa: '',
            gradoEstudio: '',
            parentesco: '',
            nombreEstudiante: '',
            gradoEstudiante: '',
            sedeEstudiante: '',
            aceptaPoliticas: false,
          });
          setSubmitMessage(null);
        }, 3000);
      } else {
        setSubmitMessage({
          type: 'error',
          text: resultado.message || 'Error al registrar. Por favor intenta de nuevo.'
        });
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setSubmitMessage({
        type: 'error',
        text: 'Error al procesar el registro. Por favor intenta de nuevo.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#2b54bf]/5 via-[#fed113]/5 to-white">
      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <Header />

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Sección 1: Información Personal */}
            <section className="space-y-6">
              <SectionHeader 
                icon={<User className="w-6 h-6 text-[#2b54bf]" />}
                title="Información Personal"
              />

              <JornadaSelector
                jornadas={jornadas}
                selectedJornadas={formData.jornada}
                onChange={handleJornadaChange}
              />

              {/* Nombres y Apellidos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Nombres"
                  icon={User}
                  required
                  value={formData.nombres}
                  onChange={(value) => setFormData({ ...formData, nombres: value })}
                  placeholder="Ingresa tus nombres"
                />
                <InputField
                  label="Apellidos"
                  icon={User}
                  required
                  value={formData.apellidos}
                  onChange={(value) => setFormData({ ...formData, apellidos: value })}
                  placeholder="Ingresa tus apellidos"
                />
              </div>

              {/* Documento de Identidad */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  label="Tipo de Documento"
                  icon={IdCard}
                  required
                  value={formData.tipoDocumento}
                  onChange={(value) => setFormData({ ...formData, tipoDocumento: value })}
                  options={tiposDocumento}
                />
                <InputField
                  label="Número de Identidad"
                  icon={IdCard}
                  required
                  value={formData.numeroIdentidad}
                  onChange={(value) => setFormData({ ...formData, numeroIdentidad: value })}
                  placeholder="Número de documento"
                />
              </div>

              {/* Correo y Teléfono */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Correo Electrónico"
                  icon={Mail}
                  type="email"
                  required
                  value={formData.correo}
                  onChange={(value) => setFormData({ ...formData, correo: value })}
                  placeholder="correo@ejemplo.com"
                />
                <InputField
                  label="Número de Teléfono"
                  icon={Phone}
                  type="tel"
                  required
                  value={formData.telefono}
                  onChange={(value) => setFormData({ ...formData, telefono: value })}
                  placeholder="3001234567"
                />
              </div>

              {/* Tipo de Asistente */}
              <TipoAsistenteSelector
                tipos={tiposAsistente}
                selected={formData.tipoAsistente}
                onChange={(value) => setFormData({ ...formData, tipoAsistente: value as TipoAsistente })}
              />

              {/* Sede Educativa (solo para Estudiante, Acudiente y Docente) */}
              {formData.tipoAsistente && 
               (formData.tipoAsistente === 'Estudiante' || 
                formData.tipoAsistente === 'Acudiente / Padre de familia' || 
                formData.tipoAsistente === 'Docente') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <SelectField
                    label="Sede Educativa"
                    icon={Building2}
                    required
                    value={formData.sedeEducativa}
                    onChange={(value) => setFormData({ ...formData, sedeEducativa: value })}
                    options={sedes}
                    placeholder="Selecciona una sede"
                  />
                </motion.div>
              )}
            </section>

            {/* Sección 2: Estudiante */}
            {formData.tipoAsistente === 'Estudiante' && (
              <EstudianteForm
                gradoEstudio={formData.gradoEstudio}
                onGradoChange={(value) => setFormData({ ...formData, gradoEstudio: value })}
              />
            )}

            {/* Sección 3: Acudiente */}
            {formData.tipoAsistente === 'Acudiente / Padre de familia' && (
              <AcudienteForm
                parentesco={formData.parentesco}
                nombreEstudiante={formData.nombreEstudiante}
                gradoEstudiante={formData.gradoEstudiante}
                sedeEstudiante={formData.sedeEstudiante}
                onParentescoChange={(value) => setFormData({ ...formData, parentesco: value })}
                onNombreChange={(value) => setFormData({ ...formData, nombreEstudiante: value })}
                onGradoChange={(value) => setFormData({ ...formData, gradoEstudiante: value })}
                onSedeChange={(value) => setFormData({ ...formData, sedeEstudiante: value })}
                sedes={sedes}
              />
            )}

            {/* Sección 4: Políticas de Privacidad */}
            <PoliticasPrivacidad
              aceptado={formData.aceptaPoliticas}
              onChange={(value) => setFormData({ ...formData, aceptaPoliticas: value })}
            />

            {/* Mensaje de resultado */}
            {submitMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg ${
                  submitMessage.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                <p className="text-sm font-medium">{submitMessage.text}</p>
              </motion.div>
            )}

            {/* Botón de Envío */}
            <SubmitButton disabled={isSubmitting} />
            {isSubmitting && (
              <p className="text-center text-sm text-gray-500">Enviando registro...</p>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-4">
          <div className="flex justify-center items-center gap-4">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden shadow-md">
              <Image
                src="/logo-atc.jpeg"
                alt="Logo ATC"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-700">Feria Empresarial 2025</p>
              <p className="text-xs text-gray-500">Todos los derechos reservados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
