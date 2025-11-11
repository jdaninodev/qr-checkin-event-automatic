'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import InputField from './InputField';

interface EstudianteFormProps {
  gradoEstudio: string;
  onGradoChange: (value: string) => void;
}

export default function EstudianteForm({ gradoEstudio, onGradoChange }: EstudianteFormProps) {
  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-6 overflow-hidden"
      >
        <div className="flex items-center gap-3 pb-4 border-b-2 border-purple-200">
          <GraduationCap className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Información del Estudiante
          </h2>
        </div>

        <InputField
          label="Grado de Estudio"
          icon={GraduationCap}
          required
          value={gradoEstudio}
          onChange={onGradoChange}
          placeholder="Ej: 10°, 11°"
        />
      </motion.section>
    </AnimatePresence>
  );
}
