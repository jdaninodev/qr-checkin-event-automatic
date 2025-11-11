'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';
import InputField from './InputField';
import SelectField from './SelectField';

interface AcudienteFormProps {
  parentesco: string;
  nombreEstudiante: string;
  gradoEstudiante: string;
  sedeEstudiante: string;
  onParentescoChange: (value: string) => void;
  onNombreChange: (value: string) => void;
  onGradoChange: (value: string) => void;
  onSedeChange: (value: string) => void;
  sedes: string[];
}

export default function AcudienteForm({
  parentesco,
  nombreEstudiante,
  gradoEstudiante,
  sedeEstudiante,
  onParentescoChange,
  onNombreChange,
  onGradoChange,
  onSedeChange,
  sedes,
}: AcudienteFormProps) {
  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-6 overflow-hidden"
      >
        <div className="flex items-center gap-3 pb-4 border-b-2 border-green-200">
          <Users className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Información del Acudiente
          </h2>
        </div>

        <InputField
          label="Parentesco"
          required
          value={parentesco}
          onChange={onParentescoChange}
          placeholder="Ej: Madre, Padre, Tutor"
        />

        <InputField
          label="Nombre Completo del Estudiante"
          required
          value={nombreEstudiante}
          onChange={onNombreChange}
          placeholder="Nombre completo del estudiante"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Grado del Estudiante"
            required
            value={gradoEstudiante}
            onChange={onGradoChange}
            placeholder="Ej: 5°, 8°"
          />

          <SelectField
            label="Sede del Estudiante"
            required
            value={sedeEstudiante}
            onChange={onSedeChange}
            options={sedes}
            placeholder="Selecciona una sede"
          />
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
